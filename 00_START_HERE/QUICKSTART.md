# Developers - Quick Start

## O que e o Developers?

**Developers** e uma software house completa operada por 54 agentes de IA especializados, organizados em 15 diretorias. Cada agente tem um contrato claro (missao, inputs, outputs, limites) e trabalha de forma coordenada.

## Acesso Rapido

| Recurso | URL |
|---------|-----|
| Chat Web | `https://developers.planacacabamentos.workers.dev/app` |
| API Health | `https://developers.planacacabamentos.workers.dev/health` |
| Lista de Agentes | `https://developers.planacacabamentos.workers.dev/agents` |

## Arquitetura

```
Usuario → Chat Web (/app)
           ↓
      Cloudflare Worker (index.ts)
           ↓
      AgentRunner (runner.ts)
           ↓
   ┌───────┴───────┐
   D1 (memorias)   Vectorize (busca semantica)
   └───────┬───────┘
           ↓
      Claude API (Anthropic)
           ↓
      Resposta do Agente
```

## Stack Tecnologica

- **Runtime**: Cloudflare Workers
- **Banco de Dados**: Cloudflare D1 (SQLite)
- **Busca Semantica**: Cloudflare Vectorize
- **IA**: Claude API (Anthropic)
- **Frontend**: HTML/CSS/JS inline (template literal em chat.ts)
- **Deploy**: Wrangler CLI

## Estrutura do Repositorio

```
├── 00_START_HERE/          ← Voce esta aqui
│   ├── QUICKSTART.md       ← Este arquivo
│   └── HOW_TO_RUN_AGENTS.md
├── 01_PLAYBOOK/
│   └── AGENTS_OPERATING_SYSTEM.md  ← Sistema operacional dos agentes
├── 03_TEMPLATES/
│   ├── AGENT_CONTRACT_TEMPLATE.md
│   ├── PRD_TEMPLATE.md
│   ├── ADR_TEMPLATE.md
│   ├── POSTMORTEM_TEMPLATE.md
│   └── RUNBOOK_TEMPLATE.md
├── 04_AGENTS/
│   ├── REGISTRY.yaml       ← Registro de todos os 54 agentes
│   ├── core/               ← 14 agentes CORE (sempre ativos)
│   └── on_demand/          ← 40 agentes On-Demand (por gatilho)
└── src/
    ├── index.ts             ← Ponto de entrada do Worker
    ├── types.ts             ← Tipos TypeScript
    ├── agents/
    │   ├── definitions.ts   ← Definicoes dos agentes no codigo
    │   └── runner.ts        ← Motor de execucao (chama Claude API)
    ├── memory/
    │   ├── store.ts         ← MemoryStore (D1 + Vectorize)
    │   └── schema.sql       ← Schema do banco
    ├── integrations/
    │   ├── tokens.ts        ← Armazenamento encriptado de tokens
    │   ├── github.ts        ← Cliente GitHub API
    │   └── cloudflare.ts    ← Cliente Cloudflare API
    ├── utils/
    │   └── embeddings.ts    ← Gerador de embeddings
    └── ui/
        └── chat.ts          ← Interface web completa
```

## Os 54 Agentes

### CORE (14 — sempre ativos)

| ID | Nome | Diretoria |
|----|------|-----------|
| maestro | Maestro | Orquestracao |
| escrivao | Escrivao (Knowledge Curator) | Orquestracao |
| cpo | CPO (Chief Product Officer) | Estrategia |
| cto | CTO (Chief Technology Officer) | Tecnica |
| dev_senior | Desenvolvedor Senior | Tecnica |
| frontend | Desenvolvedor Frontend | Tecnica |
| backend | Desenvolvedor Backend | Tecnica |
| integracoes | Especialista em Integracoes | Tecnica |
| devops | DevOps / SRE | Tecnica |
| github_cloudflare | GitHub & Cloudflare Ops | Tecnica |
| seguranca | Seguranca / LGPD | Tecnica |
| qa_tecnico | QA Lead Tecnico | Tecnica |
| ux_ui | UX/UI Designer | Experiencia |
| design_system_owner | Design System Owner | Experiencia |

### ON-DEMAND (40 — ativados por gatilho)

Consulte `04_AGENTS/REGISTRY.yaml` para a lista completa com keywords e diretorias.

## Como Usar

### Via Chat Web
1. Acesse `/app`
2. Selecione um agente no dropdown ou use "Auto" para roteamento automatico
3. Digite sua mensagem
4. O sistema escolhe o melhor agente baseado em keywords

### Via API
```bash
curl -X POST https://developers.planacacabamentos.workers.dev/chat \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Crie um componente de login em React com Tailwind",
    "agent": "frontend"
  }'
```

### Formato de Invocacao
```
Aja como [ID] DEV.com e [tarefa detalhada]
```

Exemplo:
```
Aja como frontend DEV.com e crie um componente de card de produto responsivo com React e Tailwind
```

## Deploy

```bash
# Variaveis necessarias
export CLOUDFLARE_API_TOKEN=seu_token
export CLOUDFLARE_ACCOUNT_ID=seu_account_id

# Deploy
npx wrangler deploy
```

## Proximos Passos

1. Leia `HOW_TO_RUN_AGENTS.md` para entender como executar agentes
2. Leia `01_PLAYBOOK/AGENTS_OPERATING_SYSTEM.md` para o sistema operacional completo
3. Explore os contratos em `04_AGENTS/core/` e `04_AGENTS/on_demand/`
