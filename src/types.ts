// Tipos principais do sistema Developers

export interface Env {
  ANTHROPIC_API_KEY: string;
  ENCRYPTION_SECRET: string;
  VECTORIZE: VectorizeIndex;
  DB: D1Database;
  ENVIRONMENT: string;
}

// Anexo enviado pelo usuário
export interface Attachment {
  type: "image" | "text";
  name: string;
  media_type?: string; // image/png, image/jpeg, etc.
  data: string; // base64 para imagens, texto puro para arquivos
}

// Mensagem de entrada do usuário
export interface UserMessage {
  content: string;
  session_id?: string;
  agent?: string;
  attachments?: Attachment[];
}

// Mensagem no formato da API do Claude (com suporte a multimodal)
export interface ChatMessage {
  role: "user" | "assistant";
  content: string | ClaudeContentBlock[];
}

export interface ClaudeContentBlock {
  type: "text" | "image";
  text?: string;
  source?: {
    type: "base64";
    media_type: string;
    data: string;
  };
}

// Definição de um agente especialista
export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  skills: string[];
}

// Memória armazenada no Vectorize
export interface Memory {
  id: string;
  session_id: string;
  agent_id: string;
  content: string;
  type: "conversation" | "decision" | "code" | "learning";
  timestamp: number;
}

// Resposta do sistema
export interface AgentResponse {
  agent: string;
  message: string;
  session_id: string;
  memories_used: number;
}
