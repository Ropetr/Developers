// Gerenciamento seguro de tokens de integração
// Tokens são criptografados antes de salvar no D1

const ALGORITHM = "AES-GCM";

async function getEncryptionKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret.padEnd(32, "0").slice(0, 32)),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("developers-tokens"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGORITHM, length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encrypt(text: string, secret: string): Promise<string> {
  const key = await getEncryptionKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoder.encode(text)
  );

  const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined));
}

async function decrypt(encoded: string, secret: string): Promise<string> {
  const key = await getEncryptionKey(secret);
  const combined = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));

  const iv = combined.slice(0, 12);
  const data = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  return new TextDecoder().decode(decrypted);
}

// Tipos
export interface Integration {
  id: string;
  provider: string;
  label: string | null;
  created_at: number;
  updated_at: number;
  has_token: boolean;
}

export interface TokenStore {
  save(provider: string, token: string, label?: string): Promise<void>;
  get(provider: string): Promise<string | null>;
  list(): Promise<Integration[]>;
  remove(provider: string): Promise<void>;
}

export function createTokenStore(db: D1Database, encryptionSecret: string): TokenStore {
  return {
    async save(provider: string, token: string, label?: string): Promise<void> {
      const encrypted = await encrypt(token, encryptionSecret);
      const now = Date.now();
      const id = `int_${provider}`;

      await db
        .prepare(
          `INSERT INTO integrations (id, provider, token_encrypted, label, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(provider) DO UPDATE SET
             token_encrypted = excluded.token_encrypted,
             label = excluded.label,
             updated_at = excluded.updated_at`
        )
        .bind(id, provider, encrypted, label ?? null, now, now)
        .run();
    },

    async get(provider: string): Promise<string | null> {
      const row = await db
        .prepare("SELECT token_encrypted FROM integrations WHERE provider = ?")
        .bind(provider)
        .first<{ token_encrypted: string }>();

      if (!row) return null;

      return decrypt(row.token_encrypted, encryptionSecret);
    },

    async list(): Promise<Integration[]> {
      const { results } = await db
        .prepare("SELECT id, provider, label, created_at, updated_at FROM integrations ORDER BY provider")
        .all<{ id: string; provider: string; label: string | null; created_at: number; updated_at: number }>();

      return (results ?? []).map((r) => ({
        ...r,
        has_token: true,
      }));
    },

    async remove(provider: string): Promise<void> {
      await db.prepare("DELETE FROM integrations WHERE provider = ?").bind(provider).run();
    },
  };
}
