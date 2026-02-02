# Como Executar os Agentes

## Conceitos Fundamentais

### Context Pack
Cada agente recebe um **Context Pack** — o conjunto de informacoes necessarias para executar sua tarefa:

```
Context Pack = System Prompt + Base de Conhecimento + Memorias Relevantes + Historico da Sessao + Mensagem do Usuario
```

### Modos de Operacao

| Modo | Descricao | Exemplo |
|------|-----------|---------|
| **CORE** | Sempre disponivel, responde a qualquer momento | Frontend, Backend, CTO |
| **On-Demand (OD)** | Ativado quando o contexto exige | SEO, Tributario, Advogado |

### Fluxo de Execucao

```
1. Usuario envia mensagem
2. Sistema identifica melhor agente (ou usuario escolhe)
3. AgentRunner monta Context Pack:
   a. Busca conhecimento do agente no D1 (type='learning')
   b. Busca memorias relevantes no Vectorize
   c. Busca historico recente da sessao
4. Monta system prompt + conhecimento + mensagens
5. Chama Claude API
6. Salva conversa na memoria
7. Retorna resposta
```

## Formas de Executar

### 1. Chat Web (Interface Principal)

Acesse `https://developers.planacacabamentos.workers.dev/app`

- **Seletor de Agente**: Dropdown no header permite escolher agente especifico
- **Modo Auto**: O sistema escolhe o agente baseado em keywords da mensagem
- **Anexos**: Clipe permite enviar imagens e arquivos de texto como contexto
- **Pasta Local**: Conecte uma pasta do seu computador para enviar arquivos como contexto

### 2. API REST

#### Enviar Mensagem
```bash
POST /chat
Content-Type: application/json

{
  "content": "Sua mensagem aqui",
  "agent": "frontend",           # Opcional - omita para auto-routing
  "session_id": "uuid-aqui",     # Opcional - omita para nova sessao
  "attachments": [                # Opcional
    {
      "name": "arquivo.txt",
      "type": "text",
      "data": "conteudo do arquivo"
    }
  ]
}
```

#### Resposta
```json
{
  "agent": "Desenvolvedor Frontend",
  "message": "Resposta do agente...",
  "session_id": "uuid-gerado",
  "memories_used": 3
}
```

#### Listar Agentes
```bash
GET /agents
```

#### Gerenciar Sessoes
```bash
GET /sessions              # Lista sessoes
GET /sessions/history?session_id=uuid  # Historico de uma sessao
DELETE /sessions           # Deleta sessao (body: {"session_id": "uuid"})
```

### 3. Alimentar Base de Conhecimento

Os agentes podem ser alimentados com conhecimento especializado que sera injetado no system prompt.

#### Via Interface Web
1. Clique no botao "Agentes" no header
2. Selecione a aba do agente
3. Cole texto ou faca upload de arquivo
4. O conhecimento sera usado em todas as futuras conversas daquele agente

#### Via API
```bash
# Adicionar conhecimento
POST /agents/knowledge
Content-Type: application/json

{
  "agent_id": "frontend",
  "title": "Padrao de Componentes React",
  "text": "Sempre usar functional components com hooks...",
  "source": "manual"
}

# Listar conhecimento
GET /agents/knowledge?agent_id=frontend

# Remover conhecimento
DELETE /agents/knowledge
Content-Type: application/json

{"id": "uuid-do-item"}
```

## Roteamento Automatico

Quando nenhum agente e especificado, o sistema usa `findBestAgent()` que:

1. Analisa a mensagem do usuario
2. Compara com keywords de cada agente
3. Conta quantas keywords coincidem
4. Retorna o agente com maior score
5. Se nenhum match, retorna o `maestro` (orquestrador padrao)

### Exemplos de Roteamento

| Mensagem | Agente Selecionado |
|----------|--------------------|
| "Crie um componente React" | frontend |
| "Configure o deploy no Cloudflare" | devops |
| "Preciso de uma API de autenticacao" | backend |
| "Analise o SEO do meu site" | seo |
| "Qual a melhor estrategia de preco?" | pricing |
| "Preciso de um plano de projeto" | maestro |

## Protocolo de Execucao dos Agentes

Cada agente segue este protocolo ao responder:

### 1. Receber
- Ler Context Pack completo
- Identificar objetivo da tarefa

### 2. Planejar
- Listar passos necessarios
- Verificar se tem todas as informacoes
- Pedir mais contexto se necessario

### 3. Executar
- Realizar tarefa dentro dos seus limites (contrato)
- Usar base de conhecimento alimentada
- Gerar artefatos prometidos

### 4. Entregar
- Responder com outputs definidos no contrato
- Indicar proximos passos (hand-offs)
- Registrar decisoes importantes

### 5. Escalar (se necessario)
- Se a tarefa esta fora dos seus limites → indicar qual agente chamar
- Se ha conflito → sugerir mesa-redonda com Moderador
- Se ha risco → alertar Seguranca ou CTO

## Boas Praticas

1. **Seja especifico**: Quanto mais contexto na mensagem, melhor a resposta
2. **Use o agente certo**: Selecione manualmente quando souber qual especialista precisa
3. **Alimente a base**: Documente padroes, decisoes e conhecimento especifico
4. **Mantenha sessoes**: Use a mesma sessao para um projeto/tema — o agente lembra do contexto
5. **Invoque com formato**: Use "Aja como [ID] DEV.com e [tarefa]" para ativacao precisa
