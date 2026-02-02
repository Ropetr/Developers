-- Migration: Tabela de tokens/integrações
-- Executar com: wrangler d1 execute developers-db --remote --file=src/memory/migration-tokens.sql

CREATE TABLE IF NOT EXISTS integrations (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL CHECK(provider IN ('github', 'cloudflare', 'anthropic', 'vercel', 'supabase')),
  token_encrypted TEXT NOT NULL,
  label TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_integrations_provider ON integrations(provider);
