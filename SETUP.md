# Developers - Setup

## 1. Instalar dependências

```bash
npm install
```

## 2. Criar recursos no Cloudflare

### Banco de dados D1:
```bash
npx wrangler d1 create developers-db
```
Copie o `database_id` retornado e cole no `wrangler.toml`.

### Índice Vectorize:
```bash
npx wrangler vectorize create developers-memory --dimensions=1024 --metric=cosine
```

### Criar tabelas no D1:
```bash
npx wrangler d1 execute developers-db --remote --file=src/memory/schema.sql
```

## 3. Configurar API Key do Claude

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```
Cole sua chave da Anthropic quando solicitado.

## 4. Testar localmente

```bash
npm run dev
```

## 5. Deploy em produção

```bash
npm run deploy
```

## 6. Testar a API

```bash
# Ver agentes disponíveis
curl https://developers.<seu-subdomínio>.workers.dev/agents

# Enviar mensagem
curl -X POST https://developers.<seu-subdomínio>.workers.dev/chat \
  -H "Content-Type: application/json" \
  -d '{"content": "Preciso criar um SaaS de gestão financeira", "session_id": "test-1"}'
```
