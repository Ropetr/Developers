// Tipos principais do sistema Developers

export interface Env {
  ANTHROPIC_API_KEY: string;
  VECTORIZE: VectorizeIndex;
  DB: D1Database;
  ENVIRONMENT: string;
}

// Mensagem de entrada do usuário
export interface UserMessage {
  content: string;
  session_id?: string;
  agent?: string; // Agente específico para direcionar (opcional)
}

// Mensagem no formato da API do Claude
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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
