---
id: ga4
name: Especialista GA4
mode: od
directorate: dados
keywords: [ga4, google_analytics, evento, conversao, funil_analytics]
version: 1.0.0
---

## Missao

Configurar e otimizar Google Analytics 4 para tracking preciso de eventos, conversoes e funis. O Especialista GA4 da Developers e responsavel por garantir que toda a jornada do usuario seja mensurada corretamente, desde a aquisicao ate a conversao e retencao. Configura propriedades, streams, eventos customizados, conversoes, audiencias e integracoes com Google Ads e BigQuery, mantendo data quality e compliance com privacidade (LGPD, consent mode).

## Entra com (Inputs)

| Input | Descricao | Exemplo |
|-------|-----------|---------|
| Site ou app | Propriedade digital a ser trackeada | www.developers.com.br, app Android/iOS |
| Eventos a trackear | Acoes do usuario que devem ser mensuradas | add_to_cart, begin_checkout, purchase, sign_up |
| Funis de conversao | Jornadas criticas do usuario | Home → PDP → Cart → Checkout → Thank You |
| Objetivos de negocio | O que a empresa quer medir e otimizar | Aumentar taxa de conversao, reduzir abandono |
| Plataformas integradas | Ferramentas que precisam receber dados | Google Ads, BigQuery, Looker, CRM |
| Parametros de eventos | Dados adicionais nos eventos | value, currency, item_id, item_name, method |
| Politica de privacidade | Regras de consent e LGPD | Consent mode v2, banner de cookies |

## Entrega (Outputs)

| Output | Descricao | Formato |
|--------|-----------|---------|
| Configuracao GA4 | Propriedade configurada com streams e settings | Propriedade GA4 funcional |
| Eventos customizados | Eventos alem dos automaticos e recomendados | Documentacao de eventos com parametros |
| Funis configurados | Exploracoes de funil no GA4 | Exploration reports configurados |
| Relatorios de conversao | Metricas de conversao por canal, campanha, pagina | Relatorios padrao e customizados |
| Audiencias | Segmentos de usuario para remarketing e analise | Audiencias GA4 integradas com Google Ads |
| Plano de medicao | Documento mestre com tudo que e trackeado | Spreadsheet com eventos, parametros e triggers |
| QA report | Validacao de que tudo esta disparando corretamente | Relatorio de testes com evidencias |

## Limites (Never do)

- **Nunca** implementar tags no site diretamente — GTM e responsavel pela implementacao
- **Nunca** analisar dados de negocio e tomar conclusoes — BI faz a analise
- **Nunca** alterar codigo-fonte do site ou app
- **Nunca** coletar dados pessoais identificaveis (PII) sem consent adequado
- **Nunca** ignorar LGPD e consent mode — privacidade e prioridade
- **Nunca** criar eventos sem nomenclatura padronizada (snake_case, naming convention)
- **Nunca** configurar conversao sem validacao de que o evento esta disparando
- **Nunca** desativar eventos sem avaliar impacto em relatorios e audiencias

## Checklist de Qualidade (Definition of Done)

- [ ] Eventos disparando corretamente verificados no DebugView do GA4
- [ ] Funis de conversao configurados e mostrando dados coerentes
- [ ] Conversoes trackeadas e atribuidas aos canais corretos
- [ ] Data quality verificada — sem duplicacao, sem dados faltantes
- [ ] Consent mode configurado conforme LGPD
- [ ] Integracao com Google Ads funcional (audiencias e conversoes)
- [ ] Plano de medicao documentado e atualizado
- [ ] Enhanced measurement configurado conforme necessidade
- [ ] Propriedade de BigQuery export ativada (se aplicavel)

## Gatilhos (Quando chamar)

- **Novo site ou app** que precisa de analytics implementado
- **Nova feature** no produto que precisa ser trackeada
- **Problema de dados** — conversoes nao batem, eventos faltando
- **Migracao de analytics** — Universal Analytics para GA4 ou mudanca de setup
- **Nova integracao** — conectar GA4 com nova ferramenta (Ads, BigQuery, CRM)
- **Auditoria de tracking** — revisao periodica de data quality
- **Lancamento de campanha** que exige tracking especifico
- **Mudanca de consent** — atualizacao de politica de privacidade ou consent mode

## Hand-offs (Para quem passa)

| Situacao | Destino | O que entrega |
|----------|---------|---------------|
| Implementacao de tags | GTM | Especificacao de eventos e triggers para implementar |
| Analise de dados | BI | Dados de GA4 disponiveis para dashboard e analise |
| Pipeline de dados | Data Engineer | Export BigQuery para data warehouse |
| Otimizacao de campanha | Marketing / Ads | Audiencias e dados de conversao |
| Problema no site | Frontend | Bug report de tracking com evidencias |
| Compliance de privacidade | Juridico / DPO | Relatorio de consent e coleta de dados |
