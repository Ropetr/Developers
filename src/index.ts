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

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      switch (url.pathname) {
        case "/":
          return jsonResponse({ name: "Developers", version: "1.2.0" }, 200, corsHeaders);

        case "/app":
          return new Response(getChatHTML(), {
            headers: { "Content-Type": "text/html;charset=UTF-8", ...corsHeaders },
          });

        case "/health":
          return jsonResponse({ status: "ok", timestamp: Date.now() }, 200, corsHeaders);

        case "/agents":
          return jsonResponse(
            Object.values(AGENTS).map((a) => ({
              id: a.id, name: a.name, description: a.description, skills: a.skills,
            })),
            200, corsHeaders
          );

        case "/chat":
          if (request.method !== "POST") return jsonResponse({ error: "Use POST" }, 405, corsHeaders);
          return handleChat(request, env, corsHeaders);

        case "/sessions":
          return handleSessions(request, env, corsHeaders);

        case "/sessions/history":
          return handleSessionHistory(request, env, corsHeaders);

        case "/agents/knowledge":
          return handleAgentKnowledge(request, env, corsHeaders);

        case "/integrations":
          return handleIntegrations(request, env, corsHeaders);

        case "/integrations/test":
          if (request.method !== "POST") return jsonResponse({ error: "Use POST" }, 405, corsHeaders);
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

async function handleChat(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const body = (await request.json()) as UserMessage;
  if (!body.content || body.content.trim() === "") {
    return jsonResponse({ error: "Campo 'content' é obrigatório" }, 400, corsHeaders);
  }

  const sessionId = body.session_id ?? crypto.randomUUID();
  const agentId = body.agent ?? findBestAgent(body.content);

  // Upsert session
  await env.DB.prepare(
    `INSERT INTO sessions (id, created_at, last_active, summary)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET last_active = excluded.last_active`
  ).bind(sessionId, Date.now(), Date.now(), body.content.substring(0, 100)).run();

  const runner = new AgentRunner(env);
  const response: AgentResponse = await runner.run(agentId, body.content, sessionId, body.attachments);

  return jsonResponse(response, 200, corsHeaders);
}

async function handleSessions(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  switch (request.method) {
    case "GET": {
      const { results } = await env.DB.prepare(
        `SELECT s.id, s.created_at, s.last_active, s.summary,
                COUNT(m.id) as message_count
         FROM sessions s
         LEFT JOIN memories m ON m.session_id = s.id AND m.type = 'conversation'
         GROUP BY s.id
         ORDER BY s.last_active DESC
         LIMIT 50`
      ).all<{ id: string; created_at: number; last_active: number; summary: string | null; message_count: number }>();
      return jsonResponse(results ?? [], 200, corsHeaders);
    }

    case "DELETE": {
      const body = (await request.json()) as { session_id: string };
      if (!body.session_id) return jsonResponse({ error: "session_id é obrigatório" }, 400, corsHeaders);
      await env.DB.prepare("DELETE FROM memories WHERE session_id = ?").bind(body.session_id).run();
      await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(body.session_id).run();
      return jsonResponse({ success: true }, 200, corsHeaders);
    }

    default:
      return jsonResponse({ error: "Método não permitido" }, 405, corsHeaders);
  }
}

async function handleSessionHistory(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  if (request.method !== "GET") return jsonResponse({ error: "Use GET" }, 405, corsHeaders);

  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  if (!sessionId) return jsonResponse({ error: "session_id query param é obrigatório" }, 400, corsHeaders);

  const { results } = await env.DB.prepare(
    `SELECT id, agent_id, content, type, timestamp FROM memories
     WHERE session_id = ? AND type = 'conversation' ORDER BY timestamp ASC`
  ).bind(sessionId).all<{ id: string; agent_id: string; content: string; type: string; timestamp: number }>();

  const messages = (results ?? []).map((row) => {
    try {
      const parsed = JSON.parse(row.content);
      return { role: parsed.role, message: parsed.message, agent_id: row.agent_id, timestamp: row.timestamp };
    } catch {
      return { role: "system", message: row.content, agent_id: row.agent_id, timestamp: row.timestamp };
    }
  });

  return jsonResponse(messages, 200, corsHeaders);
}

async function handleIntegrations(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const store = createTokenStore(env.DB, env.ENCRYPTION_SECRET || env.ANTHROPIC_API_KEY);
  switch (request.method) {
    case "GET": return jsonResponse(await store.list(), 200, corsHeaders);
    case "PUT": {
      const body = (await request.json()) as { provider: string; token: string; label?: string };
      if (!body.provider || !body.token) return jsonResponse({ error: "provider e token são obrigatórios" }, 400, corsHeaders);
      await store.save(body.provider, body.token, body.label);
      return jsonResponse({ success: true, provider: body.provider }, 200, corsHeaders);
    }
    case "DELETE": {
      const body = (await request.json()) as { provider: string };
      if (!body.provider) return jsonResponse({ error: "provider é obrigatório" }, 400, corsHeaders);
      await store.remove(body.provider);
      return jsonResponse({ success: true }, 200, corsHeaders);
    }
    default: return jsonResponse({ error: "Método não permitido" }, 405, corsHeaders);
  }
}

async function handleTestIntegration(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const store = createTokenStore(env.DB, env.ENCRYPTION_SECRET || env.ANTHROPIC_API_KEY);
  const body = (await request.json()) as { provider: string };
  if (!body.provider) return jsonResponse({ error: "provider é obrigatório" }, 400, corsHeaders);

  const token = await store.get(body.provider);
  if (!token) return jsonResponse({ error: "Token não configurado" }, 404, corsHeaders);

  try {
    switch (body.provider) {
      case "github": {
        const gh = createGitHubClient(token);
        const user = await gh.getUser();
        return jsonResponse({ success: true, provider: "github", user: user.login, name: user.name }, 200, corsHeaders);
      }
      case "cloudflare": {
        const cf = createCloudflareClient(token, "");
        const result = await cf.verifyToken();
        return jsonResponse({ success: true, provider: "cloudflare", status: result.status }, 200, corsHeaders);
      }
      case "anthropic": {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "x-api-key": token, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
          body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 10, messages: [{ role: "user", content: "ping" }] }),
        });
        return jsonResponse({ success: res.ok, provider: "anthropic", status: res.ok ? "active" : "invalid" }, 200, corsHeaders);
      }
      default: return jsonResponse({ error: `Teste não implementado para ${body.provider}` }, 400, corsHeaders);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    return jsonResponse({ success: false, provider: body.provider, error: msg }, 200, corsHeaders);
  }
}

async function handleAgentKnowledge(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const url = new URL(request.url);

  switch (request.method) {
    case "GET": {
      const agentId = url.searchParams.get("agent_id");
      let query = "SELECT id, agent_id, content, timestamp FROM memories WHERE type = 'learning'";
      const binds: string[] = [];
      if (agentId) {
        query += " AND agent_id = ?";
        binds.push(agentId);
      }
      query += " ORDER BY timestamp DESC LIMIT 100";
      const stmt = binds.length > 0
        ? env.DB.prepare(query).bind(...binds)
        : env.DB.prepare(query);
      const { results } = await stmt.all<{ id: string; agent_id: string; content: string; timestamp: number }>();
      const items = (results ?? []).map((r) => {
        try {
          const parsed = JSON.parse(r.content);
          return { id: r.id, agent_id: r.agent_id, title: parsed.title || "Sem titulo", source: parsed.source || "manual", preview: (parsed.text || "").substring(0, 150), timestamp: r.timestamp };
        } catch {
          return { id: r.id, agent_id: r.agent_id, title: "Sem titulo", source: "manual", preview: r.content.substring(0, 150), timestamp: r.timestamp };
        }
      });
      return jsonResponse(items, 200, corsHeaders);
    }

    case "POST": {
      const body = (await request.json()) as { agent_id: string; title: string; text: string; source?: string };
      if (!body.agent_id || !body.text) {
        return jsonResponse({ error: "agent_id e text sao obrigatorios" }, 400, corsHeaders);
      }
      if (!AGENTS[body.agent_id]) {
        return jsonResponse({ error: "Agente nao encontrado" }, 400, corsHeaders);
      }
      const id = crypto.randomUUID();
      const timestamp = Date.now();
      const content = JSON.stringify({ title: body.title || "Sem titulo", text: body.text, source: body.source || "manual" });

      // Salva no D1
      await env.DB.prepare(
        "INSERT INTO memories (id, session_id, agent_id, content, type, timestamp) VALUES (?, ?, ?, ?, ?, ?)"
      ).bind(id, "knowledge", body.agent_id, content, "learning", timestamp).run();

      // Salva no Vectorize para busca semantica
      const { generateEmbedding } = await import("./utils/embeddings");
      const embedding = await generateEmbedding(body.text.substring(0, 2000));
      await env.VECTORIZE.upsert([{
        id,
        values: embedding,
        metadata: { agent_id: body.agent_id, type: "learning", timestamp, preview: body.text.substring(0, 500) },
      }]);

      return jsonResponse({ success: true, id }, 200, corsHeaders);
    }

    case "DELETE": {
      const body = (await request.json()) as { id: string };
      if (!body.id) return jsonResponse({ error: "id e obrigatorio" }, 400, corsHeaders);
      await env.DB.prepare("DELETE FROM memories WHERE id = ? AND type = 'learning'").bind(body.id).run();
      try { await env.VECTORIZE.deleteByIds([body.id]); } catch {}
      return jsonResponse({ success: true }, 200, corsHeaders);
    }

    default:
      return jsonResponse({ error: "Metodo nao permitido" }, 405, corsHeaders);
  }
}

function jsonResponse(data: unknown, status: number, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status, headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}
