// Motor de execução dos agentes - conecta com a API do Claude
// Agora com TOOL USE: agentes podem executar ações reais (criar arquivos, GitHub, etc.)

import { Env, ChatMessage, ClaudeContentBlock, Attachment, AgentResponse, AgentDefinition } from "../types";
import { AGENTS } from "./definitions";
import { MemoryStore } from "../memory/store";
import { AGENT_TOOLS, ToolExecutor, FileOperation } from "./tools";

// Tipo de resposta extendido com file operations
export interface AgentResponseWithActions extends AgentResponse {
  file_operations?: FileOperation[];
}

// Tipos da resposta do Claude com tool use
interface ClaudeResponse {
  content: Array<ClaudeContentItem>;
  stop_reason: "end_turn" | "tool_use" | "max_tokens";
}

interface ClaudeContentItem {
  type: "text" | "tool_use";
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
}

interface ToolResultMessage {
  type: "tool_result";
  tool_use_id: string;
  content: string;
}

export class AgentRunner {
  private env: Env;
  private memory: MemoryStore;

  constructor(env: Env) {
    this.env = env;
    this.memory = new MemoryStore(env);
  }

  async run(
    agentId: string,
    userMessage: string,
    sessionId: string,
    attachments?: Attachment[]
  ): Promise<AgentResponseWithActions> {
    const agent = AGENTS[agentId];
    if (!agent) {
      throw new Error(`Agente "${agentId}" não encontrado`);
    }

    // 1. Busca conhecimento do agente (documentacao alimentada)
    const knowledgeResults = await this.env.DB
      .prepare("SELECT content FROM memories WHERE agent_id = ? AND type = 'learning' ORDER BY timestamp DESC LIMIT 20")
      .bind(agentId)
      .all<{ content: string }>();
    const knowledgeEntries = (knowledgeResults.results ?? []).map((r) => {
      try { const p = JSON.parse(r.content); return `[${p.title}]\n${p.text}`; }
      catch { return r.content; }
    });

    // 2. Busca memórias relevantes no Vectorize
    const relevantMemories = await this.memory.search(userMessage, {
      limit: 5,
      agent_id: agentId,
    });

    // 3. Busca histórico recente da sessão
    const recentHistory = await this.memory.getRecentHistory(sessionId, 10);

    // 4. Monta o contexto para o Claude
    const messages = this.buildMessages(agent, userMessage, relevantMemories, recentHistory, attachments);

    // 5. Monta system prompt com conhecimento do agente
    let systemPrompt = agent.systemPrompt;
    if (knowledgeEntries.length > 0) {
      systemPrompt += "\n\n--- BASE DE CONHECIMENTO ---\nVocê possui o seguinte conhecimento especializado. Use-o para fundamentar suas respostas:\n\n" + knowledgeEntries.join("\n\n---\n\n");
    }

    // 6. Chama a API do Claude COM TOOL USE LOOP
    const toolExecutor = new ToolExecutor(this.env);
    const { text: response, fileOps } = await this.callClaudeWithTools(
      systemPrompt,
      messages,
      toolExecutor
    );

    // 7. Salva a conversa na memória
    const attachmentSummary = attachments?.length
      ? `\n[Anexos: ${attachments.map(a => a.name).join(", ")}]`
      : "";
    const actionSummary = fileOps.length > 0
      ? `\n[Ações executadas: ${fileOps.map(op => `${op.action} ${op.path}`).join(", ")}]`
      : "";
    await this.saveToMemory(sessionId, agentId, userMessage + attachmentSummary, response + actionSummary);

    return {
      agent: agent.name,
      message: response,
      session_id: sessionId,
      memories_used: relevantMemories.length,
      file_operations: fileOps.length > 0 ? fileOps : undefined,
    };
  }

  private buildMessages(
    agent: AgentDefinition,
    userMessage: string,
    memories: { content: string }[],
    history: { content: string }[],
    attachments?: Attachment[]
  ): ChatMessage[] {
    const messages: ChatMessage[] = [];

    // Adiciona contexto das memórias relevantes
    if (memories.length > 0) {
      const memoryContext = memories.map((m) => m.content).join("\n---\n");
      messages.push({
        role: "user",
        content: `[CONTEXTO DE MEMÓRIAS ANTERIORES]\n${memoryContext}`,
      });
      messages.push({
        role: "assistant",
        content: "Entendido. Tenho acesso ao contexto das conversas e decisões anteriores. Como posso ajudar?",
      });
    }

    // Adiciona histórico recente da sessão
    for (const entry of history) {
      try {
        const parsed = JSON.parse(entry.content);
        if (parsed.role && parsed.message) {
          messages.push({
            role: parsed.role === "user" ? "user" : "assistant",
            content: parsed.message,
          });
        }
      } catch {
        // ignora
      }
    }

    // Monta mensagem atual (com ou sem anexos)
    if (attachments && attachments.length > 0) {
      const contentBlocks: ClaudeContentBlock[] = [];

      // Adiciona imagens primeiro
      for (const att of attachments) {
        if (att.type === "image" && att.media_type && att.data) {
          contentBlocks.push({
            type: "image",
            source: {
              type: "base64",
              media_type: att.media_type,
              data: att.data,
            },
          });
        } else if (att.type === "text" && att.data) {
          contentBlocks.push({
            type: "text",
            text: `[Arquivo: ${att.name}]\n${att.data}`,
          });
        }
      }

      // Adiciona texto do usuário
      contentBlocks.push({
        type: "text",
        text: userMessage,
      });

      messages.push({ role: "user", content: contentBlocks });
    } else {
      messages.push({ role: "user", content: userMessage });
    }

    return messages;
  }

  /**
   * Chama o Claude com Tool Use. Loop:
   * 1. Envia mensagem com ferramentas disponíveis
   * 2. Se Claude responde com tool_use → executa a ferramenta → envia resultado → repete
   * 3. Se Claude responde com end_turn → retorna texto final
   * Max 10 iterações para evitar loops infinitos
   */
  private async callClaudeWithTools(
    systemPrompt: string,
    messages: ChatMessage[],
    toolExecutor: ToolExecutor,
    maxIterations = 10
  ): Promise<{ text: string; fileOps: FileOperation[] }> {
    // Clone messages array para poder adicionar tool results
    const conversationMessages: Array<{
      role: string;
      content: unknown;
    }> = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    let finalText = "";
    let iterations = 0;

    while (iterations < maxIterations) {
      iterations++;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8192,
          system: systemPrompt,
          tools: AGENT_TOOLS,
          messages: conversationMessages,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude API error (${response.status}): ${error}`);
      }

      const data = (await response.json()) as ClaudeResponse;

      // Coleta texto e tool_use blocks
      const textParts: string[] = [];
      const toolUses: ClaudeContentItem[] = [];

      for (const block of data.content) {
        if (block.type === "text" && block.text) {
          textParts.push(block.text);
        } else if (block.type === "tool_use") {
          toolUses.push(block);
        }
      }

      // Adiciona resposta do assistant ao histórico
      conversationMessages.push({
        role: "assistant",
        content: data.content,
      });

      // Se não há tool_use, terminamos
      if (data.stop_reason !== "tool_use" || toolUses.length === 0) {
        finalText += textParts.join("\n");
        break;
      }

      // Tem tool_use: executa cada ferramenta e envia resultado
      finalText += textParts.join("\n");

      const toolResults: ToolResultMessage[] = [];
      for (const toolUse of toolUses) {
        if (!toolUse.name || !toolUse.id) continue;

        const result = await toolExecutor.execute(
          toolUse.name,
          toolUse.input || {}
        );

        toolResults.push({
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: result.output,
        });
      }

      // Envia resultados das ferramentas de volta ao Claude
      conversationMessages.push({
        role: "user",
        content: toolResults,
      });
    }

    return {
      text: finalText,
      fileOps: toolExecutor.getFileOperations(),
    };
  }

  private async saveToMemory(
    sessionId: string,
    agentId: string,
    userMessage: string,
    assistantResponse: string
  ): Promise<void> {
    await this.memory.save({
      session_id: sessionId,
      agent_id: agentId,
      content: JSON.stringify({ role: "user", message: userMessage }),
      type: "conversation",
    });

    await this.memory.save({
      session_id: sessionId,
      agent_id: agentId,
      content: JSON.stringify({ role: "assistant", message: assistantResponse }),
      type: "conversation",
    });
  }
}
