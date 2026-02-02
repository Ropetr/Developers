// Motor de execução dos agentes - conecta com a API do Claude

import { Env, ChatMessage, ClaudeContentBlock, Attachment, AgentResponse } from "../types";
import { AgentDefinition, AGENTS } from "./definitions";
import { MemoryStore } from "../memory/store";

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
  ): Promise<AgentResponse> {
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

    // 6. Chama a API do Claude
    const response = await this.callClaude(systemPrompt, messages);

    // 5. Salva a conversa na memória (sem os binários dos anexos)
    const attachmentSummary = attachments?.length
      ? `\n[Anexos: ${attachments.map(a => a.name).join(", ")}]`
      : "";
    await this.saveToMemory(sessionId, agentId, userMessage + attachmentSummary, response);

    return {
      agent: agent.name,
      message: response,
      session_id: sessionId,
      memories_used: relevantMemories.length,
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

  private async callClaude(
    systemPrompt: string,
    messages: ChatMessage[]
  ): Promise<string> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error (${response.status}): ${error}`);
    }

    const data = (await response.json()) as {
      content: Array<{ type: string; text: string }>;
    };

    return data.content[0]?.text ?? "Sem resposta do agente.";
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
