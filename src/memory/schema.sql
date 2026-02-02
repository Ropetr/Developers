-- Schema do banco D1 para o sistema Developers
-- Executar com: wrangler d1 execute developers-db --file=src/memory/schema.sql

-- Tabela de memórias (conteúdo completo das conversas e decisões)
CREATE TABLE IF NOT EXISTS memories (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('conversation', 'decision', 'code', 'learning')),
  timestamp INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_memories_session ON memories(session_id);
CREATE INDEX IF NOT EXISTS idx_memories_agent ON memories(agent_id);
CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);
CREATE INDEX IF NOT EXISTS idx_memories_timestamp ON memories(timestamp DESC);

-- Tabela de sessões (para agrupar conversas)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  last_active INTEGER NOT NULL,
  summary TEXT
);

-- Tabela de projetos (para organizar o trabalho dos agentes)
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'paused', 'completed')),
  created_at INTEGER NOT NULL
);
