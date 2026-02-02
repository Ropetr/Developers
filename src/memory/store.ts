// Sistema de memória contínua usando Cloudflare Vectorize + D1

import { Env, Memory } from "../types";
import { generateEmbedding } from "../utils/embeddings";

export class MemoryStore {
  private vectorize: VectorizeIndex;
  private db: D1Database;

  constructor(env: Env) {
    this.vectorize = env.VECTORIZE;
    this.db = env.DB;
  }

  // Salva uma memória no Vectorize e D1
  async save(memory: Omit<Memory, "id" | "timestamp">): Promise<string> {
    const id = crypto.randomUUID();
    const timestamp = Date.now();

    // Gera embedding do conteúdo
    const embedding = await generateEmbedding(memory.content);

    // Salva no Vectorize (busca semântica)
    await this.vectorize.upsert([
      {
        id,
        values: embedding,
        metadata: {
          session_id: memory.session_id,
          agent_id: memory.agent_id,
          type: memory.type,
          timestamp,
          // Vectorize metadata tem limite de tamanho
          preview: memory.content.substring(0, 500),
        },
      },
    ]);

    // Salva conteúdo completo no D1
    await this.db
      .prepare(
        `INSERT INTO memories (id, session_id, agent_id, content, type, timestamp)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(id, memory.session_id, memory.agent_id, memory.content, memory.type, timestamp)
      .run();

    return id;
  }

  // Busca memórias relevantes por similaridade semântica
  async search(query: string, options?: { limit?: number; agent_id?: string }): Promise<Memory[]> {
    const limit = options?.limit ?? 5;
    const embedding = await generateEmbedding(query);

    // Busca no Vectorize por similaridade
    const filter: VectorizeVectorMetadataFilter = {};
    if (options?.agent_id) {
      filter.agent_id = options.agent_id;
    }

    const results = await this.vectorize.query(embedding, {
      topK: limit,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      returnMetadata: "all",
    });

    if (!results.matches || results.matches.length === 0) {
      return [];
    }

    // Busca conteúdo completo no D1
    const ids = results.matches.map((m) => m.id);
    const placeholders = ids.map(() => "?").join(",");

    const { results: rows } = await this.db
      .prepare(`SELECT * FROM memories WHERE id IN (${placeholders}) ORDER BY timestamp DESC`)
      .bind(...ids)
      .all<Memory>();

    return rows ?? [];
  }

  // Busca histórico recente de uma sessão
  async getRecentHistory(session_id: string, limit: number = 10): Promise<Memory[]> {
    const { results } = await this.db
      .prepare(
        `SELECT * FROM memories WHERE session_id = ? AND type = 'conversation'
         ORDER BY timestamp DESC LIMIT ?`
      )
      .bind(session_id, limit)
      .all<Memory>();

    return (results ?? []).reverse();
  }
}
