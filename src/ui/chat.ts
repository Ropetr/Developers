// Interface de chat web para interagir com os agentes

export function getChatHTML(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Developers - Software House IA</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f0f0f;
      color: #e0e0e0;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    header {
      background: #1a1a1a;
      border-bottom: 1px solid #2a2a2a;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    header h1 {
      font-size: 20px;
      font-weight: 600;
      color: #fff;
    }

    header h1 span {
      color: #6366f1;
    }

    .agent-selector {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .agent-selector label {
      font-size: 13px;
      color: #888;
    }

    .agent-selector select {
      background: #2a2a2a;
      color: #e0e0e0;
      border: 1px solid #3a3a3a;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 13px;
      cursor: pointer;
    }

    .agent-selector select:focus {
      outline: none;
      border-color: #6366f1;
    }

    .chat-area {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .message {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .message.user {
      align-self: flex-end;
      background: #6366f1;
      color: #fff;
      border-bottom-right-radius: 4px;
    }

    .message.assistant {
      align-self: flex-start;
      background: #1e1e1e;
      border: 1px solid #2a2a2a;
      border-bottom-left-radius: 4px;
    }

    .message .agent-badge {
      font-size: 11px;
      color: #6366f1;
      font-weight: 600;
      margin-bottom: 6px;
      display: block;
    }

    .message .memory-info {
      font-size: 11px;
      color: #555;
      margin-top: 8px;
      display: block;
    }

    .welcome {
      text-align: center;
      padding: 60px 24px;
      color: #555;
    }

    .welcome h2 {
      font-size: 24px;
      color: #888;
      margin-bottom: 12px;
    }

    .welcome p {
      font-size: 14px;
      max-width: 500px;
      margin: 0 auto 24px;
      line-height: 1.6;
    }

    .agents-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      max-width: 700px;
      margin: 0 auto;
    }

    .agent-card {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 12px 16px;
      text-align: left;
      width: 200px;
    }

    .agent-card h3 {
      font-size: 13px;
      color: #6366f1;
      margin-bottom: 4px;
    }

    .agent-card p {
      font-size: 11px;
      color: #666;
      margin: 0;
    }

    .input-area {
      background: #1a1a1a;
      border-top: 1px solid #2a2a2a;
      padding: 16px 24px;
      display: flex;
      gap: 12px;
    }

    .input-area textarea {
      flex: 1;
      background: #2a2a2a;
      color: #e0e0e0;
      border: 1px solid #3a3a3a;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 14px;
      font-family: inherit;
      resize: none;
      height: 48px;
      max-height: 120px;
    }

    .input-area textarea:focus {
      outline: none;
      border-color: #6366f1;
    }

    .input-area button {
      background: #6366f1;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .input-area button:hover {
      background: #4f46e5;
    }

    .input-area button:disabled {
      background: #333;
      color: #666;
      cursor: not-allowed;
    }

    .typing {
      align-self: flex-start;
      color: #555;
      font-size: 13px;
      padding: 8px 16px;
    }

    .typing span {
      animation: blink 1.4s infinite;
    }
    .typing span:nth-child(2) { animation-delay: 0.2s; }
    .typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes blink {
      0%, 20% { opacity: 0.2; }
      50% { opacity: 1; }
      80%, 100% { opacity: 0.2; }
    }

    .session-info {
      font-size: 11px;
      color: #444;
      padding: 4px 24px;
      background: #1a1a1a;
      border-top: 1px solid #2a2a2a;
    }
  </style>
</head>
<body>
  <header>
    <h1><span>Developers</span> AI</h1>
    <div class="agent-selector">
      <label>Agente:</label>
      <select id="agentSelect">
        <option value="auto">Auto (detectar)</option>
        <option value="manager">Gerente de Projetos</option>
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
        <option value="fullstack">Fullstack</option>
        <option value="devops">DevOps</option>
      </select>
    </div>
  </header>

  <div class="chat-area" id="chatArea">
    <div class="welcome">
      <h2>Developers AI</h2>
      <p>Sua software house com agentes IA especializados. Descreva o que precisa e o agente certo vai te ajudar.</p>
      <div class="agents-grid">
        <div class="agent-card">
          <h3>Gerente de Projetos</h3>
          <p>Coordena, planeja e define prioridades</p>
        </div>
        <div class="agent-card">
          <h3>Frontend</h3>
          <p>React, Next.js, Tailwind, UI/UX</p>
        </div>
        <div class="agent-card">
          <h3>Backend</h3>
          <p>APIs, banco de dados, autenticacao</p>
        </div>
        <div class="agent-card">
          <h3>Fullstack</h3>
          <p>Aplicacoes completas end-to-end</p>
        </div>
        <div class="agent-card">
          <h3>DevOps</h3>
          <p>Deploy, CI/CD, infraestrutura</p>
        </div>
      </div>
    </div>
  </div>

  <div class="session-info" id="sessionInfo">Sessao: nova</div>

  <div class="input-area">
    <textarea
      id="messageInput"
      placeholder="Descreva o que voce precisa..."
      rows="1"
    ></textarea>
    <button id="sendBtn" onclick="sendMessage()">Enviar</button>
  </div>

  <script>
    const chatArea = document.getElementById('chatArea');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const agentSelect = document.getElementById('agentSelect');
    const sessionInfo = document.getElementById('sessionInfo');

    let sessionId = null;
    let welcomeVisible = true;

    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
      this.style.height = '48px';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // Enter para enviar (Shift+Enter para nova linha)
    messageInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    function addMessage(content, type, agentName, memoriesUsed) {
      if (welcomeVisible) {
        const welcome = chatArea.querySelector('.welcome');
        if (welcome) welcome.remove();
        welcomeVisible = false;
      }

      const div = document.createElement('div');
      div.className = 'message ' + type;

      if (type === 'assistant' && agentName) {
        const badge = document.createElement('span');
        badge.className = 'agent-badge';
        badge.textContent = agentName;
        div.appendChild(badge);
      }

      const text = document.createElement('span');
      text.textContent = content;
      div.appendChild(text);

      if (type === 'assistant' && memoriesUsed > 0) {
        const info = document.createElement('span');
        info.className = 'memory-info';
        info.textContent = memoriesUsed + ' memoria(s) utilizada(s)';
        div.appendChild(info);
      }

      chatArea.appendChild(div);
      chatArea.scrollTop = chatArea.scrollHeight;
    }

    function showTyping() {
      const div = document.createElement('div');
      div.className = 'typing';
      div.id = 'typingIndicator';
      div.innerHTML = 'Pensando<span>.</span><span>.</span><span>.</span>';
      chatArea.appendChild(div);
      chatArea.scrollTop = chatArea.scrollHeight;
    }

    function hideTyping() {
      const el = document.getElementById('typingIndicator');
      if (el) el.remove();
    }

    async function sendMessage() {
      const content = messageInput.value.trim();
      if (!content) return;

      // Mostra mensagem do usuario
      addMessage(content, 'user');
      messageInput.value = '';
      messageInput.style.height = '48px';

      // Desabilita input
      sendBtn.disabled = true;
      messageInput.disabled = true;
      showTyping();

      try {
        const body = { content: content };
        if (sessionId) body.session_id = sessionId;

        const selectedAgent = agentSelect.value;
        if (selectedAgent !== 'auto') body.agent = selectedAgent;

        const response = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        hideTyping();

        if (data.error) {
          addMessage('Erro: ' + data.error, 'assistant', 'Sistema', 0);
        } else {
          sessionId = data.session_id;
          sessionInfo.textContent = 'Sessao: ' + sessionId.substring(0, 8) + '...';
          addMessage(data.message, 'assistant', data.agent, data.memories_used);
        }
      } catch (err) {
        hideTyping();
        addMessage('Erro de conexao: ' + err.message, 'assistant', 'Sistema', 0);
      }

      // Reabilita input
      sendBtn.disabled = false;
      messageInput.disabled = false;
      messageInput.focus();
    }
  </script>
</body>
</html>`;
}
