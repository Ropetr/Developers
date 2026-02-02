// Developers - Sistema de agentes IA especializados
// Ponto de entrada do Cloudflare Worker

import { Env, UserMessage, AgentResponse } from "./types";
import { AgentRunner } from "./agents/runner";
import { AGENTS, findBestAgent, DEFAULT_AGENT } from "./agents/definitions";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Rotas da API
      switch (url.pathname) {
        case "/":
          return jsonResponse(
            {
              name: "Developers",
              description: "Software house powered by AI agents",
              version: "1.0.0",
              agents: Object.values(AGENTS).map((a) => ({
                id: a.id,
                name: a.name,
                description: a.description,
                skills: a.skills,
              })),
              endpoints: {
                "POST /chat": "Enviar mensagem para um agente",
                "GET /agents": "Listar agentes disponíveis",
                "GET /health": "Status do sistema",
              },
            },
            200,
            corsHeaders
          );

        case "/health":
          return jsonResponse({ status: "ok", timestamp: Date.now() }, 200, corsHeaders);

        case "/agents":
          return jsonResponse(
            Object.values(AGENTS).map((a) => ({
              id: a.id,
              name: a.name,
              description: a.description,
              skills: a.skills,
            })),
            200,
            corsHeaders
          );

        case "/chat":
          if (request.method !== "POST") {
            return jsonResponse({ error: "Use POST" }, 405, corsHeaders);
          }
          return handleChat(request, env, corsHeaders);

        default:
          return jsonResponse({ error: "Rota não encontrada" }, 404, corsHeaders);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro interno";
      return jsonResponse({ error: message }, 500, corsHeaders);
    }
  },
};

async function handleChat(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const body = (await request.json()) as UserMessage;

  if (!body.content || body.content.trim() === "") {
    return jsonResponse({ error: "Campo 'content' é obrigatório" }, 400, corsHeaders);
  }

  // Gera ou usa session_id existente
  const sessionId = body.session_id ?? crypto.randomUUID();

  // Determina qual agente usar
  const agentId = body.agent ?? findBestAgent(body.content);

  // Executa o agente
  const runner = new AgentRunner(env);
  const response: AgentResponse = await runner.run(agentId, body.content, sessionId);

  return jsonResponse(response, 200, corsHeaders);
}

function jsonResponse(
  data: unknown,
  status: number,
  extraHeaders: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}
