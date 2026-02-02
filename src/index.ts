// Developers - Sistema de agentes IA especializados
// Ponto de entrada do Cloudflare Worker

import { Env, UserMessage, AgentResponse } from "./types";
import { AgentRunner } from "./agents/runner";
import { AGENTS, findBestAgent, DEFAULT_AGENT } from "./agents/definitions";
import { getChatHTML } from "./ui/chat";
import { createTokenStore } from "./integrations/tokens";
import { createGitHubClient } from "./integrations/github";
import { createCloudflareClient } from "./integrations/cloudflare";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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
              version: "1.1.0",
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
                "GET /integrations": "Listar integrações configuradas",
                "PUT /integrations": "Salvar token de integração",
                "DELETE /integrations": "Remover integração",
                "POST /integrations/test": "Testar conexão de integração",
              },
            },
            200,
            corsHeaders
          );

        case "/app":
          return new Response(getChatHTML(), {
            headers: { "Content-Type": "text/html;charset=UTF-8", ...corsHeaders },
          });

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

        case "/integrations":
          return handleIntegrations(request, env, corsHeaders);

        case "/integrations/test":
          if (request.method !== "POST") {
            return jsonResponse({ error: "Use POST" }, 405, corsHeaders);
          }
          return handleTestIntegration(request, env, corsHeaders);

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

  const sessionId = body.session_id ?? crypto.randomUUID();
  const agentId = body.agent ?? findBestAgent(body.content);

  const runner = new AgentRunner(env);
  const response: AgentResponse = await runner.run(agentId, body.content, sessionId);

  return jsonResponse(response, 200, corsHeaders);
}

async function handleIntegrations(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const store = createTokenStore(env.DB, env.ENCRYPTION_SECRET || env.ANTHROPIC_API_KEY);

  switch (request.method) {
    case "GET": {
      const integrations = await store.list();
      return jsonResponse(integrations, 200, corsHeaders);
    }

    case "PUT": {
      const body = (await request.json()) as {
        provider: string;
        token: string;
        label?: string;
      };

      if (!body.provider || !body.token) {
        return jsonResponse({ error: "provider e token são obrigatórios" }, 400, corsHeaders);
      }

      await store.save(body.provider, body.token, body.label);
      return jsonResponse({ success: true, provider: body.provider }, 200, corsHeaders);
    }

    case "DELETE": {
      const body = (await request.json()) as { provider: string };
      if (!body.provider) {
        return jsonResponse({ error: "provider é obrigatório" }, 400, corsHeaders);
      }
      await store.remove(body.provider);
      return jsonResponse({ success: true }, 200, corsHeaders);
    }

    default:
      return jsonResponse({ error: "Método não permitido" }, 405, corsHeaders);
  }
}

async function handleTestIntegration(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const store = createTokenStore(env.DB, env.ENCRYPTION_SECRET || env.ANTHROPIC_API_KEY);
  const body = (await request.json()) as { provider: string };

  if (!body.provider) {
    return jsonResponse({ error: "provider é obrigatório" }, 400, corsHeaders);
  }

  const token = await store.get(body.provider);
  if (!token) {
    return jsonResponse({ error: "Token não configurado para este provider" }, 404, corsHeaders);
  }

  try {
    switch (body.provider) {
      case "github": {
        const gh = createGitHubClient(token);
        const user = await gh.getUser();
        return jsonResponse(
          { success: true, provider: "github", user: user.login, name: user.name },
          200,
          corsHeaders
        );
      }

      case "cloudflare": {
        const cf = createCloudflareClient(token, "");
        const result = await cf.verifyToken();
        return jsonResponse(
          { success: true, provider: "cloudflare", status: result.status },
          200,
          corsHeaders
        );
      }

      case "anthropic": {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": token,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 10,
            messages: [{ role: "user", content: "ping" }],
          }),
        });
        return jsonResponse(
          { success: response.ok, provider: "anthropic", status: response.ok ? "active" : "invalid" },
          200,
          corsHeaders
        );
      }

      default:
        return jsonResponse({ error: `Teste não implementado para ${body.provider}` }, 400, corsHeaders);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return jsonResponse({ success: false, provider: body.provider, error: message }, 200, corsHeaders);
  }
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
