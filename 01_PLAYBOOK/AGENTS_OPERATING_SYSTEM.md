# AGENTS OPERATING SYSTEM — Developers AI

> Versao: 2.0.0 | Atualizado: 2026-02-02 | Fonte de verdade: ESPECIALISTAS.md

## 0. Fonte de verdade e escopo

### 0.1 Fonte de verdade (Authoritative)

- **Catalogo base**: `ESPECIALISTAS.md` — versao 2.0.0, 54 especialistas (14 CORE + 40 OD)
- **Registry**: `04_AGENTS/REGISTRY.yaml` — IDs oficiais, modos e diretorias
- **Contratos**: `04_AGENTS/core/*.md` e `04_AGENTS/on_demand/*.md`

### 0.2 Regras inviolaveis

- IDs oficiais e modo (CORE vs OD) do catalogo devem ser respeitados
- Maestro nao decide fiscal sem Tributario; nao define arquitetura sem CTO
- Escrivao (Knowledge Curator) nao toma decisoes, apenas registra e preserva memoria
- Conflitos de opiniao sao resolvidos pelo Moderador de Mesa

### 0.3 Objetivo do sistema de agentes

Construir uma software house que:
- Transforma ideia → PRD/backlog → arquitetura → execucao → testes → release
- Mantem padroes consistentes (UI e engenharia)
- Cria memoria institucional (decisoes, runbooks, lessons learned)
- Aprende com erros via processo (postmortem + prevencao), nao via treino do modelo

---

## 1. Conceitos e definicoes

| Conceito | Definicao |
|---|---|
| **Agente** | Persona com contrato (missao, entradas, saidas, limites, DoD) |
| **CORE** | Sempre ativo; garante governanca e continuidade. 14 agentes |
| **OD (On-Demand)** | Entra por gatilho/necessidade do PRD/backlog. 40 agentes |
| **Diretoria** | Agrupamento logico (Orquestracao, Tecnica, Dados, Marketing...) |
| **Artefato** | Documento fonte da verdade (PRD, ADR, Runbook, Design System...) |
| **Gate** | Checkpoint obrigatorio antes de avancar (Produto, Tecnico, Seguranca) |
| **Context Pack** | Pacote minimo de arquivos para o agente trabalhar sem perder contexto |

---

## 2. Diretorias (15)

| # | Diretoria | Agentes CORE | Agentes OD |
|---|---|---|---|
| 1 | Orquestracao | maestro, escrivao | moderador |
| 2 | Estrategia | cpo | ceo, guardiao, scrum_master |
| 3 | Tecnica | cto, dev_senior, frontend, backend, integracoes, devops, github_cloudflare, seguranca, qa_tecnico | — |
| 4 | Experiencia | ux_ui, design_system_owner | ux_writer, branding, suporte_cx, onboarding, tech_writer |
| 5 | Comercial | — | vendas, marketplaces, omnichannel, ecommerce, crm_cs |
| 6 | Financeiro | — | cfo, tributario, economista, pricing |
| 7 | Operacoes | — | logistica, compras, estoque |
| 8 | Dados | — | bi, ga4, gtm, ia_automacoes, data_engineer, mlops |
| 9 | Marketing | — | seo, copywriter, email_marketing, social_media, video, designer_grafico |
| 10 | Juridico | — | advogado |
| 11 | People | — | rh_people |
| 12 | Qualidade | — | qa_processos |
| 13 | Sistemas | — | sistemas_fiscais, erp_backoffice |
| 14 | CFO Digital | — | cfo_pj |
| 15 | Growth | — | growth_pm, fiscal_comex |
| 16 | Educacao | — | treinamentos |

---

## 3. Protocolo de execucao

### 3.1 Regra de roteamento (Orquestracao)

1. **Maestro** e o cerebro que escolhe especialistas e garante coerencia
2. **Escrivao** mantem memoria e rastreabilidade; nao decide e nao executa
3. Em conflito de opinioes, chame o **Moderador de Mesa** para sintese/consenso

### 3.2 Formato padrao de Context Pack

Para qualquer tarefa, o Maestro monta (no minimo):
- `docs/PRD.md` + `docs/BACKLOG.md`
- `docs/ARCHITECTURE.md` + ADRs existentes
- `02_DESIGN_SYSTEM/*` (tokens e guidelines)
- `docs/RUNBOOK.md` (se ja existe)
- Links de PRs/Issues relevantes

### 3.3 Fluxo padrao (end-to-end)

1. **Maestro** recebe ideia → define plano e chama CORE necessarios
2. **CPO** gera PRD/backlog
3. **CTO** define arquitetura + ADRs
4. **UX/UI** + **Design System Owner** padronizam UI/fluxos
5. **Dev Senior** + **Frontend/Backend/Integracoes** implementam
6. **QA Lead** fecha plano de testes + gate tecnico
7. **DevOps/SRE** + **GitHub/Cloudflare** garantem pipeline/release
8. **Seguranca/LGPD** revisa riscos antes de producao
9. **Escrivao** registra decisoes, runbook, release notes e lessons

---

## 4. Gates obrigatorios

### 4.1 Gate de Produto (antes de construir)

- [ ] Escopo IN/OUT definido
- [ ] Criterios de aceite por historia
- [ ] Metricas definidas (quando aplicavel)

### 4.2 Gate Tecnico (antes de merge)

- [ ] Lint + typecheck + testes passando
- [ ] Cobertura minima em caminhos criticos
- [ ] Checklist de seguranca (auth/pagamentos/multi-tenant)

### 4.3 Gate de Seguranca (quando aplicavel)

- [ ] Dados pessoais protegidos (LGPD)
- [ ] Autenticacao/autorizacao revisada
- [ ] Integracoes externas auditadas

---

## 5. Aprendizado por erros

### 5.1 Ciclo obrigatorio apos bug/incidente

1. Abrir `POSTMORTEM.md` (template)
2. Registrar: root cause, impacto, timeline, acao corretiva
3. Criar prevencao (pelo menos 1):
   - Teste automatizado
   - Regra de lint
   - Validacao extra
   - Checklist novo no gate
4. Escrivao atualiza:
   - `RUNBOOK.md` (como detectar/mitigar)
   - `LESSONS.md` (o que mudou no padrao)

---

## 6. Como invocar os agentes

### Formato padrao

```
Aja como [ID] DEV.com e [tarefa].
```

### Exemplos

- `Aja como maestro DEV.com. Tenho uma ideia. Monte mesa e entregue plano completo.`
- `Aja como cpo DEV.com. Crie PRD completo com escopo IN/OUT, backlog e criterios de aceite.`
- `Aja como cto DEV.com. Defina arquitetura e registre ADR.`
- `Aja como frontend DEV.com. Implemente o componente de login seguindo o Design System.`
- `Aja como escrivao DEV.com. Documente decisoes, pendencias e proximos passos.`

### Quando usar Maestro vs chamada individual

- **Use Maestro** quando: nao sabe quem chamar, tarefa envolve multiplos especialistas, quer plano completo
- **Use chamada individual** quando: sabe exatamente qual especialista precisa, tarefa e isolada e bem definida
