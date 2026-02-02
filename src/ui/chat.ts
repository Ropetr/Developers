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

    header h1 { font-size: 20px; font-weight: 600; color: #fff; }
    header h1 span { color: #6366f1; }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .agent-selector {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .agent-selector label { font-size: 13px; color: #888; }

    .agent-selector select {
      background: #2a2a2a;
      color: #e0e0e0;
      border: 1px solid #3a3a3a;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 13px;
      cursor: pointer;
    }

    .agent-selector select:focus { outline: none; border-color: #6366f1; }

    .settings-btn {
      background: #2a2a2a;
      border: 1px solid #3a3a3a;
      color: #888;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .settings-btn:hover { border-color: #6366f1; color: #e0e0e0; }

    .settings-btn .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ef4444;
    }

    .settings-btn .dot.connected { background: #22c55e; }

    /* Modal overlay */
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7);
      z-index: 100;
      justify-content: center;
      align-items: center;
      padding: 16px;
    }

    .modal-overlay.active { display: flex; }

    .modal {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #2a2a2a;
    }

    .modal-header h2 { font-size: 18px; color: #fff; }

    .modal-close {
      background: none;
      border: none;
      color: #666;
      font-size: 24px;
      cursor: pointer;
      padding: 0 4px;
    }

    .modal-close:hover { color: #fff; }

    .modal-body { padding: 24px; }

    .integration-card {
      background: #0f0f0f;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
    }

    .integration-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .integration-name {
      font-size: 14px;
      font-weight: 600;
      color: #e0e0e0;
    }

    .integration-status {
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 600;
    }

    .integration-status.connected {
      background: rgba(34,197,94,0.15);
      color: #22c55e;
    }

    .integration-status.disconnected {
      background: rgba(239,68,68,0.15);
      color: #ef4444;
    }

    .integration-desc {
      font-size: 12px;
      color: #666;
      margin-bottom: 12px;
    }

    .token-input-row {
      display: flex;
      gap: 8px;
    }

    .token-input-row input {
      flex: 1;
      background: #1a1a1a;
      border: 1px solid #3a3a3a;
      border-radius: 6px;
      padding: 8px 12px;
      color: #e0e0e0;
      font-size: 13px;
      font-family: monospace;
    }

    .token-input-row input:focus { outline: none; border-color: #6366f1; }

    .token-input-row input::placeholder { color: #444; }

    .btn-save {
      background: #6366f1;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }

    .btn-save:hover { background: #4f46e5; }

    .btn-save:disabled { background: #333; color: #666; cursor: not-allowed; }

    .btn-test {
      background: transparent;
      color: #6366f1;
      border: 1px solid #6366f1;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 13px;
      cursor: pointer;
      white-space: nowrap;
    }

    .btn-test:hover { background: rgba(99,102,241,0.1); }

    .btn-remove {
      background: transparent;
      color: #ef4444;
      border: 1px solid #ef4444;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 13px;
      cursor: pointer;
      white-space: nowrap;
    }

    .btn-remove:hover { background: rgba(239,68,68,0.1); }

    .integration-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    .test-result {
      font-size: 12px;
      margin-top: 8px;
      padding: 8px;
      border-radius: 4px;
    }

    .test-result.success { background: rgba(34,197,94,0.1); color: #22c55e; }
    .test-result.error { background: rgba(239,68,68,0.1); color: #ef4444; }

    /* Chat area */
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

    .welcome h2 { font-size: 24px; color: #888; margin-bottom: 12px; }

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

    .agent-card h3 { font-size: 13px; color: #6366f1; margin-bottom: 4px; }
    .agent-card p { font-size: 11px; color: #666; margin: 0; }

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

    .input-area textarea:focus { outline: none; border-color: #6366f1; }

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

    .input-area button:hover { background: #4f46e5; }
    .input-area button:disabled { background: #333; color: #666; cursor: not-allowed; }

    .typing {
      align-self: flex-start;
      color: #555;
      font-size: 13px;
      padding: 8px 16px;
    }

    .typing span { animation: blink 1.4s infinite; }
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

    @media (max-width: 600px) {
      header { padding: 12px 16px; flex-wrap: wrap; gap: 8px; }
      .header-actions { width: 100%; justify-content: space-between; }
      .chat-area { padding: 16px; }
      .input-area { padding: 12px 16px; }
      .message { max-width: 90%; }
      .modal { margin: 8px; max-height: 95vh; }
      .agents-grid { gap: 8px; }
      .agent-card { width: 100%; }
    }
  </style>
</head>
<body>
  <header>
    <h1><span>Developers</span> AI</h1>
    <div class="header-actions">
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
      <button class="settings-btn" onclick="openSettings()">
        <div class="dot" id="statusDot"></div>
        Integracoes
      </button>
    </div>
  </header>

  <!-- Modal de Configuracoes -->
  <div class="modal-overlay" id="settingsModal">
    <div class="modal">
      <div class="modal-header">
        <h2>Integracoes</h2>
        <button class="modal-close" onclick="closeSettings()">&times;</button>
      </div>
      <div class="modal-body">

        <!-- GitHub -->
        <div class="integration-card" id="card-github">
          <div class="integration-header">
            <span class="integration-name">GitHub</span>
            <span class="integration-status disconnected" id="status-github">Desconectado</span>
          </div>
          <div class="integration-desc">
            Permite que os agentes criem repositorios, commits, branches e pull requests.
          </div>
          <div class="token-input-row">
            <input type="password" id="token-github" placeholder="ghp_xxxxxxxxxxxx ou github_pat_xxx" />
            <button class="btn-save" onclick="saveToken('github')">Salvar</button>
          </div>
          <div class="integration-actions" id="actions-github" style="display:none">
            <button class="btn-test" onclick="testToken('github')">Testar conexao</button>
            <button class="btn-remove" onclick="removeToken('github')">Remover</button>
          </div>
          <div id="result-github"></div>
        </div>

        <!-- Cloudflare -->
        <div class="integration-card" id="card-cloudflare">
          <div class="integration-header">
            <span class="integration-name">Cloudflare</span>
            <span class="integration-status disconnected" id="status-cloudflare">Desconectado</span>
          </div>
          <div class="integration-desc">
            Permite que os agentes gerenciem Workers, D1, KV e DNS.
          </div>
          <div class="token-input-row">
            <input type="password" id="token-cloudflare" placeholder="Token API Cloudflare" />
            <button class="btn-save" onclick="saveToken('cloudflare')">Salvar</button>
          </div>
          <div class="integration-actions" id="actions-cloudflare" style="display:none">
            <button class="btn-test" onclick="testToken('cloudflare')">Testar conexao</button>
            <button class="btn-remove" onclick="removeToken('cloudflare')">Remover</button>
          </div>
          <div id="result-cloudflare"></div>
        </div>

        <!-- Anthropic -->
        <div class="integration-card" id="card-anthropic">
          <div class="integration-header">
            <span class="integration-name">Anthropic (Claude)</span>
            <span class="integration-status disconnected" id="status-anthropic">Desconectado</span>
          </div>
          <div class="integration-desc">
            API key do Claude para o cerebro dos agentes. Ja configurada via Wrangler secrets, mas pode ser gerenciada aqui tambem.
          </div>
          <div class="token-input-row">
            <input type="password" id="token-anthropic" placeholder="sk-ant-xxxxxxxxxxxx" />
            <button class="btn-save" onclick="saveToken('anthropic')">Salvar</button>
          </div>
          <div class="integration-actions" id="actions-anthropic" style="display:none">
            <button class="btn-test" onclick="testToken('anthropic')">Testar conexao</button>
            <button class="btn-remove" onclick="removeToken('anthropic')">Remover</button>
          </div>
          <div id="result-anthropic"></div>
        </div>

        <!-- Vercel -->
        <div class="integration-card" id="card-vercel">
          <div class="integration-header">
            <span class="integration-name">Vercel</span>
            <span class="integration-status disconnected" id="status-vercel">Desconectado</span>
          </div>
          <div class="integration-desc">
            Deploy automatico de projetos Next.js na Vercel.
          </div>
          <div class="token-input-row">
            <input type="password" id="token-vercel" placeholder="Token Vercel" />
            <button class="btn-save" onclick="saveToken('vercel')">Salvar</button>
          </div>
          <div class="integration-actions" id="actions-vercel" style="display:none">
            <button class="btn-test" onclick="testToken('vercel')">Testar conexao</button>
            <button class="btn-remove" onclick="removeToken('vercel')">Remover</button>
          </div>
          <div id="result-vercel"></div>
        </div>

        <!-- Supabase -->
        <div class="integration-card" id="card-supabase">
          <div class="integration-header">
            <span class="integration-name">Supabase</span>
            <span class="integration-status disconnected" id="status-supabase">Desconectado</span>
          </div>
          <div class="integration-desc">
            Banco de dados, autenticacao e storage para projetos.
          </div>
          <div class="token-input-row">
            <input type="password" id="token-supabase" placeholder="Supabase service role key" />
            <button class="btn-save" onclick="saveToken('supabase')">Salvar</button>
          </div>
          <div class="integration-actions" id="actions-supabase" style="display:none">
            <button class="btn-test" onclick="testToken('supabase')">Testar conexao</button>
            <button class="btn-remove" onclick="removeToken('supabase')">Remover</button>
          </div>
          <div id="result-supabase"></div>
        </div>

      </div>
    </div>
  </div>

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
    <textarea id="messageInput" placeholder="Descreva o que voce precisa..." rows="1"></textarea>
    <button id="sendBtn" onclick="sendMessage()">Enviar</button>
  </div>

  <script>
    const chatArea = document.getElementById('chatArea');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const agentSelect = document.getElementById('agentSelect');
    const sessionInfo = document.getElementById('sessionInfo');
    const statusDot = document.getElementById('statusDot');

    let sessionId = null;
    let welcomeVisible = true;

    // ---- SETTINGS / INTEGRATIONS ----

    function openSettings() {
      document.getElementById('settingsModal').classList.add('active');
      loadIntegrations();
    }

    function closeSettings() {
      document.getElementById('settingsModal').classList.remove('active');
    }

    // Fechar modal clicando fora
    document.getElementById('settingsModal').addEventListener('click', function(e) {
      if (e.target === this) closeSettings();
    });

    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeSettings();
    });

    async function loadIntegrations() {
      try {
        const res = await fetch('/integrations');
        const data = await res.json();
        let connectedCount = 0;

        // Reset all to disconnected
        ['github', 'cloudflare', 'anthropic', 'vercel', 'supabase'].forEach(function(p) {
          const statusEl = document.getElementById('status-' + p);
          const actionsEl = document.getElementById('actions-' + p);
          statusEl.textContent = 'Desconectado';
          statusEl.className = 'integration-status disconnected';
          actionsEl.style.display = 'none';
        });

        data.forEach(function(item) {
          const statusEl = document.getElementById('status-' + item.provider);
          const actionsEl = document.getElementById('actions-' + item.provider);
          if (statusEl) {
            statusEl.textContent = 'Conectado';
            statusEl.className = 'integration-status connected';
            connectedCount++;
          }
          if (actionsEl) {
            actionsEl.style.display = 'flex';
          }
        });

        statusDot.className = connectedCount > 0 ? 'dot connected' : 'dot';
      } catch (err) {
        console.error('Erro ao carregar integracoes:', err);
      }
    }

    async function saveToken(provider) {
      const input = document.getElementById('token-' + provider);
      const token = input.value.trim();
      if (!token) return;

      try {
        const res = await fetch('/integrations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: provider, token: token }),
        });
        const data = await res.json();

        if (data.success) {
          input.value = '';
          showResult(provider, 'Token salvo com sucesso!', 'success');
          loadIntegrations();
        } else {
          showResult(provider, 'Erro: ' + (data.error || 'desconhecido'), 'error');
        }
      } catch (err) {
        showResult(provider, 'Erro de conexao: ' + err.message, 'error');
      }
    }

    async function testToken(provider) {
      showResult(provider, 'Testando...', 'success');
      try {
        const res = await fetch('/integrations/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: provider }),
        });
        const data = await res.json();

        if (data.success) {
          let msg = 'Conexao OK!';
          if (data.user) msg += ' Conta: ' + data.user;
          if (data.name) msg += ' (' + data.name + ')';
          if (data.status) msg += ' Status: ' + data.status;
          showResult(provider, msg, 'success');
        } else {
          showResult(provider, 'Falha: ' + (data.error || 'token invalido'), 'error');
        }
      } catch (err) {
        showResult(provider, 'Erro: ' + err.message, 'error');
      }
    }

    async function removeToken(provider) {
      if (!confirm('Remover token de ' + provider + '?')) return;

      try {
        const res = await fetch('/integrations', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: provider }),
        });
        const data = await res.json();
        if (data.success) {
          showResult(provider, 'Token removido.', 'success');
          loadIntegrations();
        }
      } catch (err) {
        showResult(provider, 'Erro: ' + err.message, 'error');
      }
    }

    function showResult(provider, message, type) {
      const el = document.getElementById('result-' + provider);
      el.innerHTML = '<div class="test-result ' + type + '">' + message + '</div>';
      setTimeout(function() { el.innerHTML = ''; }, 5000);
    }

    // Load integrations on startup
    loadIntegrations();

    // ---- CHAT ----

    messageInput.addEventListener('input', function() {
      this.style.height = '48px';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

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

      addMessage(content, 'user');
      messageInput.value = '';
      messageInput.style.height = '48px';

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

      sendBtn.disabled = false;
      messageInput.disabled = false;
      messageInput.focus();
    }
  </script>
</body>
</html>`;
}
