---
id: erp_backoffice
name: ERP / Backoffice
mode: od
directorate: sistemas
keywords: [erp, backoffice, contas_pagar, contas_receber, conciliacao]
version: 1.0.0
---

## Missao

Gerenciar e otimizar os sistemas ERP e backoffice da Developers: contas a pagar e receber, conciliacao bancaria, processos administrativos e integracoes financeiras. Garante que o fluxo financeiro-administrativo opere de forma automatizada, integrada e confiavel, fornecendo dados precisos para a tomada de decisao. Atua como ponte entre as necessidades financeiras/administrativas e a implementacao tecnica nos sistemas, mantendo a integridade dos dados e a rastreabilidade das operacoes.

## Entra com (Inputs)

- **Processos financeiros**: fluxo de contas a pagar (fornecedores, despesas) e contas a receber (clientes, recorrencia)
- **Integracao com banco**: APIs bancarias (Open Banking), arquivos CNAB 240/400, boletos, PIX
- **Notas fiscais**: NF-e de entrada e saida para conciliacao com financeiro
- **Folha de pagamento**: dados de RH para processamento de folha e provisoes
- **Regras de negocio**: planos, precos, descontos, comissoes, split de pagamento

## Entrega (Outputs)

- **Configuracao ERP**: modulos financeiro, estoque, compras e faturamento configurados e funcionais
- **Automacao de contas**: contas a pagar/receber automatizadas com regras de vencimento, juros e multa
- **Conciliacao bancaria**: processo automatico de conciliacao entre extratos bancarios e lancamentos do ERP
- **Relatorios gerenciais**: DRE, fluxo de caixa, aging de recebiveis, previsao de pagamentos, balancete
- **Integracoes**: conexao com bancos, gateways de pagamento, marketplace, ferramentas de cobranca

## Limites (Never do)

- **Nao define processos financeiros** — CFO define politicas financeiras; ERP/Backoffice implementa no sistema
- **Nao substitui contabilidade** — nao fecha balanco, nao calcula impostos, nao entrega obrigacoes acessorias
- **Nao emite NF** — Sistemas Fiscais cuida da emissao e transmissao de documentos fiscais
- **Nao aprova pagamentos** — sistema processa mas aprovacao segue alcada definida pelo CFO
- **Nao define precificacao** — implementa tabelas de preco definidas por Pricing/CPO

## Checklist de Qualidade (Definition of Done)

- [ ] ERP configurado com todos os modulos necessarios operacionais
- [ ] Conciliacao automatica funcionando (extrato vs. lancamentos com match rate > 95%)
- [ ] Relatorios gerenciais gerados automaticamente no periodo definido
- [ ] Integracao bancaria funcional (envio de remessa e retorno de boletos/PIX)
- [ ] Contas a pagar com alerta de vencimento e fluxo de aprovacao
- [ ] Contas a receber com cobranca automatica e registro de inadimplencia
- [ ] Backup e audit trail de todas as operacoes financeiras
- [ ] Plano de contingencia para falha de integracao bancaria

## Gatilhos (Quando chamar)

- **Implantacao de ERP**: empresa adotando novo sistema ERP ou migrando de planilha para sistema
- **Novo modulo**: ativacao de modulo adicional (estoque, compras, CRM, projetos)
- **Problema de conciliacao**: divergencias entre banco e sistema que nao se resolvem automaticamente
- **Integracao com banco**: novo banco, nova API bancaria, migracao CNAB para API
- **Crescimento operacional**: volume de transacoes exigindo automacao ou otimizacao
- **Auditoria interna/externa**: preparacao de dados e rastreabilidade para auditores

## Hand-offs (Para quem passa)

- **Emissao fiscal** → Sistemas Fiscais (NF-e, NFC-e, SPED e obrigacoes fiscais)
- **Decisoes financeiras** → CFO (politicas, aprovacoes, investimentos, budget)
- **Integracoes tecnicas** → Integracoes (APIs, webhooks, middlewares entre sistemas)
- **Dados e analytics** → BI (dashboards financeiros, analise de cohort de receita, previsoes)
- **Folha e beneficios** → RH / People (dados de funcionarios, ferias, rescisoes)
- **Infraestrutura** → DevOps (servidores, banco de dados, monitoramento do ERP)
