// Interface de chat web com sidebar de conversas

export function getChatHTML(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Developers - Software House IA</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #555; }
    * { scrollbar-width: thin; scrollbar-color: #333 transparent; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f0f0f;
      color: #e0e0e0;
      height: 100vh;
      display: flex;
    }

    /* SIDEBAR */
    .sidebar {
      width: 280px;
      background: #111;
      border-right: 1px solid #2a2a2a;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: transform 0.3s;
    }
    .sidebar.hidden { transform: translateX(-100%); position: absolute; z-index: 50; height: 100%; }
    .sidebar-header {
      padding: 16px;
      border-bottom: 1px solid #2a2a2a;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sidebar-header h2 { font-size: 14px; color: #888; }
    .btn-new-chat {
      background: #6366f1;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-new-chat:hover { background: #4f46e5; }
    .sessions-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }
    .session-item {
      padding: 10px 12px;
      border-radius: 6px;
      cursor: pointer;
      margin-bottom: 2px;
      transition: background 0.15s;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }
    .session-item:hover { background: #1a1a1a; }
    .session-item.active { background: #1e1e2e; border: 1px solid #333; }
    .session-item-content { flex: 1; min-width: 0; }
    .session-item-summary {
      font-size: 13px;
      color: #ccc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .session-item-meta {
      font-size: 11px;
      color: #555;
      margin-top: 3px;
    }
    .session-item-delete {
      background: none;
      border: none;
      color: #444;
      cursor: pointer;
      font-size: 14px;
      padding: 2px 4px;
      flex-shrink: 0;
      border-radius: 4px;
    }
    .session-item-delete:hover { color: #ef4444; background: rgba(239,68,68,0.1); }
    .sessions-empty {
      text-align: center;
      padding: 40px 16px;
      color: #444;
      font-size: 13px;
    }

    /* MAIN */
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    header {
      background: #1a1a1a;
      border-bottom: 1px solid #2a2a2a;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .header-left { display: flex; align-items: center; gap: 12px; }
    .btn-toggle-sidebar {
      background: none;
      border: 1px solid #333;
      color: #888;
      border-radius: 6px;
      padding: 6px 8px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    }
    .btn-toggle-sidebar:hover { color: #fff; border-color: #6366f1; }
    header h1 { font-size: 18px; font-weight: 600; color: #fff; }
    header h1 span { color: #6366f1; }
    .header-actions { display: flex; gap: 10px; align-items: center; }
    .agent-selector { display: flex; gap: 6px; align-items: center; }
    .agent-selector label { font-size: 12px; color: #888; }
    .agent-selector select {
      background: #2a2a2a; color: #e0e0e0; border: 1px solid #3a3a3a;
      border-radius: 6px; padding: 5px 10px; font-size: 12px; cursor: pointer;
    }
    .agent-selector select:focus { outline: none; border-color: #6366f1; }
    .settings-btn {
      background: #2a2a2a; border: 1px solid #3a3a3a; color: #888;
      border-radius: 6px; padding: 5px 10px; font-size: 12px; cursor: pointer;
      display: flex; align-items: center; gap: 5px;
    }
    .settings-btn:hover { border-color: #6366f1; color: #e0e0e0; }
    .settings-btn .dot { width: 7px; height: 7px; border-radius: 50%; background: #ef4444; }
    .settings-btn .dot.connected { background: #22c55e; }

    /* MODAL */
    .modal-overlay {
      display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7); z-index: 100; justify-content: center; align-items: center; padding: 16px;
    }
    .modal-overlay.active { display: flex; }
    .modal {
      background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px;
      width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto;
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 20px 24px; border-bottom: 1px solid #2a2a2a;
    }
    .modal-header h2 { font-size: 18px; color: #fff; }
    .modal-close { background: none; border: none; color: #666; font-size: 24px; cursor: pointer; }
    .modal-close:hover { color: #fff; }
    .modal-body { padding: 24px; }
    .integration-card {
      background: #0f0f0f; border: 1px solid #2a2a2a; border-radius: 8px;
      padding: 16px; margin-bottom: 12px;
    }
    .integration-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .integration-name { font-size: 14px; font-weight: 600; color: #e0e0e0; }
    .integration-status { font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: 600; }
    .integration-status.connected { background: rgba(34,197,94,0.15); color: #22c55e; }
    .integration-status.disconnected { background: rgba(239,68,68,0.15); color: #ef4444; }
    .integration-desc { font-size: 12px; color: #666; margin-bottom: 10px; }
    .token-input-row { display: flex; gap: 8px; }
    .token-input-row input {
      flex: 1; background: #1a1a1a; border: 1px solid #3a3a3a; border-radius: 6px;
      padding: 8px 12px; color: #e0e0e0; font-size: 13px; font-family: monospace;
    }
    .token-input-row input:focus { outline: none; border-color: #6366f1; }
    .token-input-row input::placeholder { color: #444; }
    .btn-save {
      background: #6366f1; color: #fff; border: none; border-radius: 6px;
      padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap;
    }
    .btn-save:hover { background: #4f46e5; }
    .btn-test {
      background: transparent; color: #6366f1; border: 1px solid #6366f1;
      border-radius: 6px; padding: 8px 16px; font-size: 13px; cursor: pointer; white-space: nowrap;
    }
    .btn-test:hover { background: rgba(99,102,241,0.1); }
    .btn-remove {
      background: transparent; color: #ef4444; border: 1px solid #ef4444;
      border-radius: 6px; padding: 8px 16px; font-size: 13px; cursor: pointer; white-space: nowrap;
    }
    .btn-remove:hover { background: rgba(239,68,68,0.1); }
    .integration-actions { display: flex; gap: 8px; margin-top: 8px; }
    .test-result { font-size: 12px; margin-top: 8px; padding: 8px; border-radius: 4px; }
    .test-result.success { background: rgba(34,197,94,0.1); color: #22c55e; }
    .test-result.error { background: rgba(239,68,68,0.1); color: #ef4444; }

    /* AGENTS CONFIG MODAL */
    .modal.wide { max-width: 700px; }
    .agent-tabs { display: flex; gap: 4px; padding: 0 24px 16px; overflow-x: auto; }
    .agent-tab {
      background: #0f0f0f; border: 1px solid #2a2a2a; border-radius: 6px;
      padding: 8px 14px; font-size: 12px; color: #888; cursor: pointer; white-space: nowrap;
      transition: all 0.15s;
    }
    .agent-tab:hover { border-color: #6366f1; color: #e0e0e0; }
    .agent-tab.active { background: #6366f1; border-color: #6366f1; color: #fff; }
    .agent-info { padding: 0 24px 16px; }
    .agent-info p { font-size: 12px; color: #666; margin-bottom: 12px; }
    .agent-skills { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
    .agent-skill { background: rgba(99,102,241,0.15); color: #818cf8; border-radius: 4px; padding: 3px 8px; font-size: 11px; }
    .knowledge-form { padding: 0 24px 16px; }
    .knowledge-form input {
      width: 100%; background: #0f0f0f; border: 1px solid #3a3a3a; border-radius: 6px;
      padding: 8px 12px; color: #e0e0e0; font-size: 13px; margin-bottom: 8px;
    }
    .knowledge-form input:focus { outline: none; border-color: #6366f1; }
    .knowledge-form textarea {
      width: 100%; background: #0f0f0f; border: 1px solid #3a3a3a; border-radius: 6px;
      padding: 10px 12px; color: #e0e0e0; font-size: 13px; font-family: inherit;
      resize: vertical; min-height: 100px; margin-bottom: 8px;
    }
    .knowledge-form textarea:focus { outline: none; border-color: #6366f1; }
    .knowledge-actions { display: flex; gap: 8px; }
    .knowledge-actions .btn-save { flex: 1; }
    .btn-upload-k {
      background: #2a2a2a; border: 1px solid #3a3a3a; color: #888; border-radius: 6px;
      padding: 8px 16px; font-size: 13px; cursor: pointer; white-space: nowrap;
    }
    .btn-upload-k:hover { border-color: #6366f1; color: #e0e0e0; }
    .knowledge-list { padding: 0 24px 24px; }
    .knowledge-list h4 { font-size: 13px; color: #888; margin-bottom: 10px; }
    .knowledge-item {
      background: #0f0f0f; border: 1px solid #2a2a2a; border-radius: 6px;
      padding: 10px 12px; margin-bottom: 6px; display: flex; justify-content: space-between;
      align-items: flex-start; gap: 10px;
    }
    .knowledge-item-info { flex: 1; min-width: 0; }
    .knowledge-item-title { font-size: 13px; color: #e0e0e0; font-weight: 600; }
    .knowledge-item-meta { font-size: 11px; color: #555; margin-top: 3px; }
    .knowledge-item-preview { font-size: 12px; color: #666; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .knowledge-item-delete {
      background: none; border: none; color: #444; cursor: pointer; font-size: 16px;
      padding: 2px 4px; flex-shrink: 0; border-radius: 4px;
    }
    .knowledge-item-delete:hover { color: #ef4444; background: rgba(239,68,68,0.1); }
    .knowledge-empty { text-align: center; padding: 20px; color: #444; font-size: 13px; }
    .knowledge-count { font-size: 11px; color: #6366f1; margin-left: 6px; }

    /* PROJECT LOCAL */
    .sidebar-section { border-top: 1px solid #2a2a2a; }
    .sidebar-section-header {
      padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;
    }
    .sidebar-section-header h3 { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .btn-connect-folder {
      background: #22c55e; color: #fff; border: none; border-radius: 6px;
      padding: 4px 10px; font-size: 11px; cursor: pointer; font-weight: 600;
    }
    .btn-connect-folder:hover { background: #16a34a; }
    .btn-disconnect-folder {
      background: transparent; color: #ef4444; border: 1px solid #ef4444; border-radius: 6px;
      padding: 3px 8px; font-size: 10px; cursor: pointer;
    }
    .btn-disconnect-folder:hover { background: rgba(239,68,68,0.1); }
    .project-info {
      padding: 0 16px 8px; font-size: 11px; color: #6366f1; display: flex; align-items: center; gap: 6px;
    }
    .project-info .folder-name { font-weight: 600; }
    .file-tree { padding: 0 8px 12px; overflow-y: auto; max-height: 40vh; }
    .ft-item {
      display: flex; align-items: center; gap: 6px; padding: 3px 8px; border-radius: 4px;
      cursor: pointer; font-size: 12px; color: #aaa; user-select: none;
    }
    .ft-item:hover { background: #1a1a1a; }
    .ft-item.selected { background: rgba(99,102,241,0.15); color: #c7d2fe; }
    .ft-item .ft-icon { font-size: 11px; width: 16px; text-align: center; flex-shrink: 0; }
    .ft-item .ft-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ft-dir > .ft-name { color: #e0e0e0; font-weight: 500; }
    .ft-children { padding-left: 16px; }
    .ft-children.collapsed { display: none; }
    .project-selected-count {
      padding: 8px 16px; font-size: 11px; color: #888; border-top: 1px solid #2a2a2a;
      display: flex; justify-content: space-between; align-items: center;
    }
    .project-selected-count span { color: #6366f1; font-weight: 600; }
    .btn-clear-sel {
      background: none; border: none; color: #666; cursor: pointer; font-size: 11px; text-decoration: underline;
    }
    .btn-clear-sel:hover { color: #e0e0e0; }

    /* CHAT */
    .chat-area { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
    .message {
      max-width: 80%; padding: 12px 16px; border-radius: 12px;
      font-size: 14px; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word;
    }
    .message.user { align-self: flex-end; background: #6366f1; color: #fff; border-bottom-right-radius: 4px; }
    .message.assistant { align-self: flex-start; background: #1e1e1e; border: 1px solid #2a2a2a; border-bottom-left-radius: 4px; }
    .message .agent-badge { font-size: 11px; color: #6366f1; font-weight: 600; margin-bottom: 6px; display: block; }
    .message .memory-info { font-size: 11px; color: #555; margin-top: 8px; display: block; }
    .welcome { text-align: center; padding: 60px 24px; color: #555; }
    .welcome h2 { font-size: 24px; color: #888; margin-bottom: 12px; }
    .welcome p { font-size: 14px; max-width: 500px; margin: 0 auto 24px; line-height: 1.6; }
    .agents-grid { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; max-width: 700px; margin: 0 auto; }
    .agent-card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; padding: 12px 16px; text-align: left; width: 200px; }
    .agent-card h3 { font-size: 13px; color: #6366f1; margin-bottom: 4px; }
    .agent-card p { font-size: 11px; color: #666; margin: 0; }
    .input-wrapper { background: #1a1a1a; border-top: 1px solid #2a2a2a; }
    .attachments-preview {
      display: flex; gap: 8px; padding: 8px 20px 0; flex-wrap: wrap;
    }
    .attachment-chip {
      background: #2a2a2a; border: 1px solid #3a3a3a; border-radius: 6px;
      padding: 4px 10px; font-size: 12px; color: #aaa; display: flex; align-items: center; gap: 6px;
    }
    .attachment-chip img {
      width: 24px; height: 24px; border-radius: 4px; object-fit: cover;
    }
    .attachment-chip .remove-att {
      background: none; border: none; color: #666; cursor: pointer; font-size: 14px; padding: 0 2px;
    }
    .attachment-chip .remove-att:hover { color: #ef4444; }
    .input-area { padding: 14px 20px; display: flex; gap: 12px; align-items: flex-end; }
    .input-area textarea {
      flex: 1; background: #2a2a2a; color: #e0e0e0; border: 1px solid #3a3a3a;
      border-radius: 8px; padding: 12px 16px; font-size: 14px; font-family: inherit;
      resize: none; height: 48px; max-height: 120px;
    }
    .input-area textarea:focus { outline: none; border-color: #6366f1; }
    .btn-attach {
      background: #2a2a2a; border: 1px solid #3a3a3a; color: #888; border-radius: 8px;
      padding: 12px 14px; cursor: pointer; font-size: 18px; line-height: 1; flex-shrink: 0;
    }
    .btn-attach:hover { border-color: #6366f1; color: #e0e0e0; }
    .input-area button.send-btn {
      background: #6366f1; color: #fff; border: none; border-radius: 8px;
      padding: 12px 24px; font-size: 14px; font-weight: 600; cursor: pointer;
    }
    .input-area button.send-btn:hover { background: #4f46e5; }
    .input-area button.send-btn:disabled { background: #333; color: #666; cursor: not-allowed; }
    .typing { align-self: flex-start; color: #555; font-size: 13px; padding: 8px 16px; }
    .typing span { animation: blink 1.4s infinite; }
    .typing span:nth-child(2) { animation-delay: 0.2s; }
    .typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0%,20%{opacity:.2} 50%{opacity:1} 80%,100%{opacity:.2} }

    @media (max-width: 768px) {
      .sidebar { position: absolute; z-index: 50; height: 100%; transform: translateX(-100%); }
      .sidebar.visible { transform: translateX(0); }
      header { padding: 10px 14px; }
      .chat-area { padding: 16px; }
      .input-area { padding: 12px 14px; }
      .message { max-width: 90%; }
      .modal { margin: 8px; }
      .agents-grid { gap: 8px; }
      .agent-card { width: 100%; }
    }
  </style>
</head>
<body>
  <!-- SIDEBAR -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <h2>Conversas</h2>
      <button class="btn-new-chat" onclick="newChat()">+ Nova</button>
    </div>
    <div class="sessions-list" id="sessionsList">
      <div class="sessions-empty">Nenhuma conversa ainda</div>
    </div>
    <div class="sidebar-section" id="projectSection">
      <div class="sidebar-section-header">
        <h3>Projeto Local</h3>
        <button class="btn-connect-folder" id="btnConnectFolder" onclick="connectFolder()">Conectar Pasta</button>
      </div>
      <div id="projectInfo" style="display:none"></div>
      <div class="file-tree" id="fileTree"></div>
      <div class="project-selected-count" id="selectedCount" style="display:none"></div>
    </div>
  </aside>

  <!-- MAIN -->
  <div class="main">
    <header>
      <div class="header-left">
        <button class="btn-toggle-sidebar" onclick="toggleSidebar()" title="Conversas">&#9776;</button>
        <h1><span>Developers</span> AI</h1>
      </div>
      <div class="header-actions">
        <div class="agent-selector">
          <label>Agente:</label>
          <select id="agentSelect">
            <option value="auto">Auto</option>
            <option value="manager">Gerente</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Fullstack</option>
            <option value="devops">DevOps</option>
          </select>
        </div>
        <button class="settings-btn" onclick="openAgentsConfig()">
          &#9881; Agentes
        </button>
        <button class="settings-btn" onclick="openSettings()">
          <div class="dot" id="statusDot"></div>
          Integracoes
        </button>
      </div>
    </header>

    <!-- MODAL -->
    <div class="modal-overlay" id="settingsModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Integracoes</h2>
          <button class="modal-close" onclick="closeSettings()">&times;</button>
        </div>
        <div class="modal-body" id="modalBody">
          ${['github','cloudflare','anthropic','vercel','supabase'].map(p => {
            const names = {github:'GitHub',cloudflare:'Cloudflare',anthropic:'Anthropic (Claude)',vercel:'Vercel',supabase:'Supabase'};
            const descs = {github:'Repositorios, commits, branches e PRs.',cloudflare:'Workers, D1, KV e DNS.',anthropic:'API key do Claude.',vercel:'Deploy de projetos Next.js.',supabase:'Banco de dados e auth.'};
            const placeholders = {github:'ghp_xxx ou github_pat_xxx',cloudflare:'Token API Cloudflare',anthropic:'sk-ant-xxx',vercel:'Token Vercel',supabase:'Supabase service role key'};
            return '<div class="integration-card"><div class="integration-header"><span class="integration-name">'+(names as any)[p]+'</span><span class="integration-status disconnected" id="status-'+p+'">Desconectado</span></div><div class="integration-desc">'+(descs as any)[p]+'</div><div class="token-input-row"><input type="password" id="token-'+p+'" placeholder="'+(placeholders as any)[p]+'" /><button class="btn-save" onclick="saveToken(\''+p+'\')">Salvar</button></div><div class="integration-actions" id="actions-'+p+'" style="display:none"><button class="btn-test" onclick="testToken(\''+p+'\')">Testar</button><button class="btn-remove" onclick="removeToken(\''+p+'\')">Remover</button></div><div id="result-'+p+'"></div></div>';
          }).join('')}
        </div>
      </div>
    </div>

    <!-- AGENTS CONFIG MODAL -->
    <div class="modal-overlay" id="agentsModal">
      <div class="modal wide">
        <div class="modal-header">
          <h2>Configurar Agentes</h2>
          <button class="modal-close" onclick="closeAgentsConfig()">&times;</button>
        </div>
        <div class="agent-tabs" id="agentTabs"></div>
        <div class="agent-info" id="agentInfo"></div>
        <div class="knowledge-form" id="knowledgeForm">
          <input type="text" id="kTitle" placeholder="Titulo (ex: Docs React 19, Regras CSS, API Stripe...)" />
          <textarea id="kText" placeholder="Cole aqui a documentacao, instrucoes, exemplos de codigo, ou qualquer informacao que o agente precisa saber..."></textarea>
          <input type="file" id="kFileInput" multiple accept=".txt,.md,.js,.ts,.py,.json,.css,.html,.sql,.csv,.xml,.yaml,.yml,.toml,.cfg,.ini,.sh" style="display:none" />
          <div class="knowledge-actions">
            <button class="btn-save" onclick="saveKnowledge()">Salvar Conhecimento</button>
            <button class="btn-upload-k" onclick="document.getElementById('kFileInput').click()">Enviar Arquivo</button>
          </div>
        </div>
        <div class="knowledge-list" id="knowledgeList">
          <h4>Base de Conhecimento</h4>
          <div id="knowledgeItems"></div>
        </div>
      </div>
    </div>

    <div class="chat-area" id="chatArea">
      <div class="welcome" id="welcomeScreen">
        <h2>Developers AI</h2>
        <p>Sua software house com agentes IA especializados.</p>
        <div class="agents-grid">
          <div class="agent-card"><h3>Gerente</h3><p>Coordena e planeja</p></div>
          <div class="agent-card"><h3>Frontend</h3><p>React, Next.js, UI/UX</p></div>
          <div class="agent-card"><h3>Backend</h3><p>APIs, banco de dados</p></div>
          <div class="agent-card"><h3>Fullstack</h3><p>Apps end-to-end</p></div>
          <div class="agent-card"><h3>DevOps</h3><p>Deploy, CI/CD</p></div>
        </div>
      </div>
    </div>

    <div class="input-wrapper">
      <div class="attachments-preview" id="attachmentsPreview"></div>
      <div class="input-area">
        <input type="file" id="fileInput" multiple accept="image/*,.txt,.js,.ts,.py,.json,.css,.html,.md,.sql,.csv,.xml,.yaml,.yml,.env,.toml,.cfg,.ini,.sh,.bat" style="display:none" />
        <button class="btn-attach" onclick="document.getElementById('fileInput').click()" title="Anexar arquivo">&#128206;</button>
        <textarea id="messageInput" placeholder="Descreva o que voce precisa..." rows="1"></textarea>
        <button class="send-btn" id="sendBtn" onclick="sendMessage()">Enviar</button>
      </div>
    </div>
  </div>

  <script>
    var chatArea = document.getElementById('chatArea');
    var messageInput = document.getElementById('messageInput');
    var sendBtn = document.getElementById('sendBtn');
    var agentSelect = document.getElementById('agentSelect');
    var statusDot = document.getElementById('statusDot');
    var sessionsList = document.getElementById('sessionsList');
    var sidebar = document.getElementById('sidebar');

    var sessionId = null;
    var welcomeVisible = true;
    var pendingAttachments = [];
    var fileInput = document.getElementById('fileInput');
    var attachmentsPreview = document.getElementById('attachmentsPreview');

    // ---- ATTACHMENTS ----
    fileInput.addEventListener('change', function(e) {
      var files = Array.from(e.target.files || []);
      files.forEach(function(file) {
        if (file.size > 10 * 1024 * 1024) {
          alert('Arquivo "' + file.name + '" excede 10MB');
          return;
        }
        var reader = new FileReader();
        var isImage = file.type.startsWith('image/');
        if (isImage) {
          reader.onload = function(ev) {
            var base64 = ev.target.result.split(',')[1];
            pendingAttachments.push({
              type: 'image',
              name: file.name,
              media_type: file.type,
              data: base64,
              preview: ev.target.result
            });
            renderAttachmentPreviews();
          };
          reader.readAsDataURL(file);
        } else {
          reader.onload = function(ev) {
            pendingAttachments.push({
              type: 'text',
              name: file.name,
              data: ev.target.result,
              preview: null
            });
            renderAttachmentPreviews();
          };
          reader.readAsText(file);
        }
      });
      fileInput.value = '';
    });

    function renderAttachmentPreviews() {
      if (pendingAttachments.length === 0) {
        attachmentsPreview.innerHTML = '';
        return;
      }
      attachmentsPreview.innerHTML = pendingAttachments.map(function(att, idx) {
        var imgTag = att.preview ? '<img src="' + att.preview + '" />' : '';
        var icon = att.type === 'text' ? '&#128196; ' : '';
        return '<div class="attachment-chip">'
          + imgTag + icon + escapeHtml(att.name)
          + ' <button class="remove-att" onclick="removeAttachment(' + idx + ')">&times;</button>'
          + '</div>';
      }).join('');
    }

    function removeAttachment(idx) {
      pendingAttachments.splice(idx, 1);
      renderAttachmentPreviews();
    }

    // ---- SIDEBAR ----
    function toggleSidebar() {
      sidebar.classList.toggle('visible');
      sidebar.classList.toggle('hidden');
    }

    function newChat() {
      sessionId = null;
      welcomeVisible = true;
      chatArea.innerHTML = '<div class="welcome" id="welcomeScreen"><h2>Developers AI</h2><p>Nova conversa. Descreva o que voce precisa.</p></div>';
      document.querySelectorAll('.session-item').forEach(function(el) { el.classList.remove('active'); });
      messageInput.focus();
      // Em mobile, fecha sidebar
      if (window.innerWidth < 768) sidebar.classList.remove('visible');
    }

    async function loadSessions() {
      try {
        var res = await fetch('/sessions');
        var data = await res.json();
        if (!data.length) {
          sessionsList.innerHTML = '<div class="sessions-empty">Nenhuma conversa ainda</div>';
          return;
        }
        sessionsList.innerHTML = data.map(function(s) {
          var summary = s.summary || 'Conversa sem titulo';
          var date = new Date(s.last_active).toLocaleDateString('pt-BR', {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
          var active = s.id === sessionId ? ' active' : '';
          return '<div class="session-item' + active + '" data-id="' + s.id + '" onclick="loadSession(\\''+s.id+'\\')">'
            + '<div class="session-item-content">'
            + '<div class="session-item-summary">' + escapeHtml(summary) + '</div>'
            + '<div class="session-item-meta">' + date + ' &middot; ' + s.message_count + ' msgs</div>'
            + '</div>'
            + '<button class="session-item-delete" onclick="event.stopPropagation();deleteSession(\\''+s.id+'\\')" title="Deletar">&times;</button>'
            + '</div>';
        }).join('');
      } catch(e) { console.error(e); }
    }

    async function loadSession(id) {
      sessionId = id;
      welcomeVisible = false;
      chatArea.innerHTML = '';

      // Marca ativo
      document.querySelectorAll('.session-item').forEach(function(el) {
        el.classList.toggle('active', el.dataset.id === id);
      });

      // Em mobile, fecha sidebar
      if (window.innerWidth < 768) sidebar.classList.remove('visible');

      try {
        var res = await fetch('/sessions/history?session_id=' + id);
        var messages = await res.json();
        messages.forEach(function(m) {
          if (m.role === 'user') {
            addMessage(m.message, 'user');
          } else if (m.role === 'assistant') {
            addMessage(m.message, 'assistant', agentName(m.agent_id), 0);
          }
        });
      } catch(e) { addMessage('Erro ao carregar historico: ' + e.message, 'assistant', 'Sistema', 0); }
    }

    async function deleteSession(id) {
      if (!confirm('Deletar esta conversa?')) return;
      try {
        await fetch('/sessions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: id }),
        });
        if (sessionId === id) newChat();
        loadSessions();
      } catch(e) { console.error(e); }
    }

    function agentName(id) {
      var names = {manager:'Gerente de Projetos',frontend:'Desenvolvedor Frontend',backend:'Desenvolvedor Backend',fullstack:'Desenvolvedor Fullstack',devops:'Engenheiro DevOps'};
      return names[id] || id;
    }

    function escapeHtml(text) {
      var d = document.createElement('div');
      d.textContent = text;
      return d.innerHTML;
    }

    // ---- SETTINGS ----
    function openSettings() { document.getElementById('settingsModal').classList.add('active'); loadIntegrations(); }
    function closeSettings() { document.getElementById('settingsModal').classList.remove('active'); }
    document.getElementById('settingsModal').addEventListener('click', function(e) { if (e.target === this) closeSettings(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeSettings(); });

    async function loadIntegrations() {
      try {
        var res = await fetch('/integrations');
        var data = await res.json();
        var count = 0;
        ['github','cloudflare','anthropic','vercel','supabase'].forEach(function(p) {
          var s = document.getElementById('status-'+p);
          var a = document.getElementById('actions-'+p);
          if(s){s.textContent='Desconectado';s.className='integration-status disconnected';}
          if(a)a.style.display='none';
        });
        data.forEach(function(item) {
          var s = document.getElementById('status-'+item.provider);
          var a = document.getElementById('actions-'+item.provider);
          if(s){s.textContent='Conectado';s.className='integration-status connected';count++;}
          if(a)a.style.display='flex';
        });
        statusDot.className = count > 0 ? 'dot connected' : 'dot';
      } catch(e) { console.error(e); }
    }

    async function saveToken(p) {
      var input = document.getElementById('token-'+p);
      var token = input.value.trim();
      if (!token) return;
      try {
        var res = await fetch('/integrations',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({provider:p,token:token})});
        var data = await res.json();
        if(data.success){input.value='';showResult(p,'Token salvo!','success');loadIntegrations();}
        else showResult(p,'Erro: '+(data.error||'?'),'error');
      } catch(e){showResult(p,'Erro: '+e.message,'error');}
    }
    async function testToken(p) {
      showResult(p,'Testando...','success');
      try {
        var res = await fetch('/integrations/test',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({provider:p})});
        var data = await res.json();
        if(data.success){var m='OK!';if(data.user)m+=' Conta: '+data.user;showResult(p,m,'success');}
        else showResult(p,'Falha: '+(data.error||'invalido'),'error');
      }catch(e){showResult(p,'Erro: '+e.message,'error');}
    }
    async function removeToken(p) {
      if(!confirm('Remover token?'))return;
      try{
        await fetch('/integrations',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({provider:p})});
        showResult(p,'Removido.','success');loadIntegrations();
      }catch(e){showResult(p,'Erro: '+e.message,'error');}
    }
    function showResult(p,msg,type) {
      var el=document.getElementById('result-'+p);
      el.innerHTML='<div class="test-result '+type+'">'+msg+'</div>';
      setTimeout(function(){el.innerHTML='';},5000);
    }

    // ---- CHAT ----
    messageInput.addEventListener('input', function() {
      this.style.height = '48px';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    messageInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    function addMessage(content, type, agentN, memoriesUsed) {
      if (welcomeVisible) {
        var w = document.getElementById('welcomeScreen');
        if (w) w.remove();
        welcomeVisible = false;
      }
      var div = document.createElement('div');
      div.className = 'message ' + type;
      if (type === 'assistant' && agentN) {
        var badge = document.createElement('span');
        badge.className = 'agent-badge';
        badge.textContent = agentN;
        div.appendChild(badge);
      }
      var text = document.createElement('span');
      text.textContent = content;
      div.appendChild(text);
      if (type === 'assistant' && memoriesUsed > 0) {
        var info = document.createElement('span');
        info.className = 'memory-info';
        info.textContent = memoriesUsed + ' memoria(s)';
        div.appendChild(info);
      }
      chatArea.appendChild(div);
      chatArea.scrollTop = chatArea.scrollHeight;
    }

    function showTyping() {
      var div = document.createElement('div');
      div.className = 'typing'; div.id = 'typingIndicator';
      div.innerHTML = 'Pensando<span>.</span><span>.</span><span>.</span>';
      chatArea.appendChild(div);
      chatArea.scrollTop = chatArea.scrollHeight;
    }
    function hideTyping() { var el = document.getElementById('typingIndicator'); if (el) el.remove(); }

    async function sendMessage() {
      var content = messageInput.value.trim();
      if (!content && pendingAttachments.length === 0) return;
      if (!content) content = '(anexo)';

      // Build display text with attachment names
      var displayText = content;
      if (pendingAttachments.length > 0) {
        var names = pendingAttachments.map(function(a) { return a.name; });
        displayText += '\\n[Anexos: ' + names.join(', ') + ']';
      }
      addMessage(displayText, 'user');

      // Capture attachments for request, then clear
      var attachmentsToSend = pendingAttachments.map(function(a) {
        return { type: a.type, name: a.name, media_type: a.media_type || undefined, data: a.data };
      });
      pendingAttachments = [];
      renderAttachmentPreviews();

      messageInput.value = '';
      messageInput.style.height = '48px';
      sendBtn.disabled = true;
      messageInput.disabled = true;
      showTyping();

      // Read selected project files and add as text attachments
      var projectFiles = await readSelectedFiles();
      projectFiles.forEach(function(pf) {
        attachmentsToSend.push({ type: 'text', name: pf.name, data: pf.content });
      });

      try {
        var body = { content: content };
        if (sessionId) body.session_id = sessionId;
        var sel = agentSelect.value;
        if (sel !== 'auto') body.agent = sel;
        if (attachmentsToSend.length > 0) body.attachments = attachmentsToSend;
        var response = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        var data = await response.json();
        hideTyping();
        if (data.error) {
          addMessage('Erro: ' + data.error, 'assistant', 'Sistema', 0);
        } else {
          sessionId = data.session_id;
          addMessage(data.message, 'assistant', data.agent, data.memories_used);
          loadSessions();
        }
      } catch (err) {
        hideTyping();
        addMessage('Erro: ' + err.message, 'assistant', 'Sistema', 0);
      }
      sendBtn.disabled = false;
      messageInput.disabled = false;
      messageInput.focus();
    }

    // ---- AGENTS CONFIG ----
    var agentsData = {
      manager: { name: 'Gerente de Projetos', desc: 'Coordena, planeja e distribui tarefas entre os agentes.', skills: ['planejamento','coordenacao','requisitos','priorizacao'] },
      frontend: { name: 'Desenvolvedor Frontend', desc: 'React, Next.js, Tailwind CSS, UI/UX e responsividade.', skills: ['react','nextjs','tailwind','typescript','ui/ux'] },
      backend: { name: 'Desenvolvedor Backend', desc: 'APIs, banco de dados, autenticacao e logica de negocio.', skills: ['api','sql','autenticacao','cloudflare workers'] },
      fullstack: { name: 'Desenvolvedor Fullstack', desc: 'Aplicacoes completas frontend + backend integrados.', skills: ['react','nextjs','api','sql','deploy'] },
      devops: { name: 'Engenheiro DevOps', desc: 'Deploy, CI/CD, infraestrutura, dominios e monitoramento.', skills: ['deploy','ci/cd','cloudflare','github actions'] }
    };
    var selectedAgent = 'manager';

    function openAgentsConfig() {
      document.getElementById('agentsModal').classList.add('active');
      renderAgentTabs();
      selectAgentTab('manager');
    }
    function closeAgentsConfig() { document.getElementById('agentsModal').classList.remove('active'); }
    document.getElementById('agentsModal').addEventListener('click', function(e) { if (e.target === this) closeAgentsConfig(); });

    function renderAgentTabs() {
      var tabs = document.getElementById('agentTabs');
      tabs.innerHTML = Object.keys(agentsData).map(function(id) {
        var a = agentsData[id];
        return '<button class="agent-tab' + (id === selectedAgent ? ' active' : '') + '" onclick="selectAgentTab(\\'' + id + '\\')">' + a.name + '<span class="knowledge-count" id="kcount-' + id + '"></span></button>';
      }).join('');
    }

    function selectAgentTab(id) {
      selectedAgent = id;
      var a = agentsData[id];
      document.querySelectorAll('.agent-tab').forEach(function(el, i) {
        el.classList.toggle('active', Object.keys(agentsData)[i] === id);
      });
      document.getElementById('agentInfo').innerHTML =
        '<p>' + a.desc + '</p>'
        + '<div class="agent-skills">' + a.skills.map(function(s) { return '<span class="agent-skill">' + s + '</span>'; }).join('') + '</div>';
      document.getElementById('kTitle').value = '';
      document.getElementById('kText').value = '';
      loadKnowledge(id);
    }

    async function loadKnowledge(agentId) {
      try {
        var res = await fetch('/agents/knowledge?agent_id=' + agentId);
        var data = await res.json();
        var container = document.getElementById('knowledgeItems');
        // Update counts
        var countEl = document.getElementById('kcount-' + agentId);
        if (countEl) countEl.textContent = data.length > 0 ? ' (' + data.length + ')' : '';

        if (!data.length) {
          container.innerHTML = '<div class="knowledge-empty">Nenhum conhecimento adicionado. Alimente o agente com documentacao, regras ou exemplos.</div>';
          return;
        }
        container.innerHTML = data.map(function(item) {
          var date = new Date(item.timestamp).toLocaleDateString('pt-BR', {day:'2-digit',month:'2-digit',year:'2-digit'});
          return '<div class="knowledge-item">'
            + '<div class="knowledge-item-info">'
            + '<div class="knowledge-item-title">' + escapeHtml(item.title) + '</div>'
            + '<div class="knowledge-item-meta">' + item.source + ' &middot; ' + date + '</div>'
            + '<div class="knowledge-item-preview">' + escapeHtml(item.preview) + '</div>'
            + '</div>'
            + '<button class="knowledge-item-delete" onclick="deleteKnowledge(\\'' + item.id + '\\')" title="Remover">&times;</button>'
            + '</div>';
        }).join('');
      } catch(e) { console.error(e); }
    }

    async function saveKnowledge() {
      var title = document.getElementById('kTitle').value.trim();
      var text = document.getElementById('kText').value.trim();
      if (!text) { alert('Cole o conteudo que o agente precisa aprender.'); return; }
      if (!title) title = text.substring(0, 60) + '...';
      try {
        var res = await fetch('/agents/knowledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agent_id: selectedAgent, title: title, text: text, source: 'manual' })
        });
        var data = await res.json();
        if (data.success) {
          document.getElementById('kTitle').value = '';
          document.getElementById('kText').value = '';
          loadKnowledge(selectedAgent);
        } else {
          alert('Erro: ' + (data.error || '?'));
        }
      } catch(e) { alert('Erro: ' + e.message); }
    }

    async function deleteKnowledge(id) {
      if (!confirm('Remover este conhecimento?')) return;
      try {
        await fetch('/agents/knowledge', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id })
        });
        loadKnowledge(selectedAgent);
      } catch(e) { console.error(e); }
    }

    // File upload for knowledge
    document.getElementById('kFileInput').addEventListener('change', function(e) {
      var files = Array.from(e.target.files || []);
      files.forEach(function(file) {
        var reader = new FileReader();
        reader.onload = function(ev) {
          var content = ev.target.result;
          var title = file.name;
          fetch('/agents/knowledge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agent_id: selectedAgent, title: title, text: content, source: 'arquivo: ' + file.name })
          }).then(function() { loadKnowledge(selectedAgent); });
        };
        reader.readAsText(file);
      });
      e.target.value = '';
    });

    // Load all knowledge counts on init
    async function loadAllKnowledgeCounts() {
      try {
        var res = await fetch('/agents/knowledge');
        var data = await res.json();
        var counts = {};
        data.forEach(function(item) {
          counts[item.agent_id] = (counts[item.agent_id] || 0) + 1;
        });
        Object.keys(agentsData).forEach(function(id) {
          var el = document.getElementById('kcount-' + id);
          if (el && counts[id]) el.textContent = ' (' + counts[id] + ')';
        });
      } catch(e) {}
    }

    // ---- PROJECT LOCAL ----
    var projectHandle = null;
    var projectTree = [];
    var selectedFiles = {};
    var IGNORE_DIRS = ['node_modules','.git','.next','dist','build','.cache','__pycache__','.vscode','.idea'];
    var TEXT_EXTS = ['.txt','.md','.js','.ts','.jsx','.tsx','.py','.json','.css','.html','.sql','.csv','.xml','.yaml','.yml','.toml','.cfg','.ini','.sh','.bat','.env','.gitignore','.svelte','.vue','.php','.rb','.go','.rs','.java','.kt','.swift','.c','.cpp','.h'];

    async function connectFolder() {
      if (!window.showDirectoryPicker) {
        alert('Seu navegador nao suporta File System Access API. Use Chrome ou Edge.');
        return;
      }
      try {
        projectHandle = await window.showDirectoryPicker({ mode: 'read' });
        selectedFiles = {};
        projectTree = await readDirRecursive(projectHandle, '', 0);
        renderProjectUI();
      } catch(e) {
        if (e.name !== 'AbortError') alert('Erro: ' + e.message);
      }
    }

    function disconnectFolder() {
      projectHandle = null;
      projectTree = [];
      selectedFiles = {};
      document.getElementById('projectInfo').style.display = 'none';
      document.getElementById('fileTree').innerHTML = '';
      document.getElementById('selectedCount').style.display = 'none';
      document.getElementById('btnConnectFolder').textContent = 'Conectar Pasta';
      document.getElementById('btnConnectFolder').className = 'btn-connect-folder';
      document.getElementById('btnConnectFolder').onclick = connectFolder;
    }

    async function readDirRecursive(dirHandle, path, depth) {
      if (depth > 4) return [];
      var items = [];
      for await (var entry of dirHandle.values()) {
        if (entry.kind === 'directory') {
          if (IGNORE_DIRS.indexOf(entry.name) >= 0) continue;
          var children = await readDirRecursive(entry, path + entry.name + '/', depth + 1);
          items.push({ name: entry.name, path: path + entry.name, kind: 'dir', handle: entry, children: children });
        } else {
          items.push({ name: entry.name, path: path + entry.name, kind: 'file', handle: entry });
        }
      }
      items.sort(function(a, b) {
        if (a.kind !== b.kind) return a.kind === 'dir' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      return items;
    }

    function renderProjectUI() {
      document.getElementById('projectInfo').style.display = 'flex';
      document.getElementById('projectInfo').innerHTML =
        '<span class="folder-name">' + escapeHtml(projectHandle.name) + '</span>';
      document.getElementById('btnConnectFolder').textContent = 'Desconectar';
      document.getElementById('btnConnectFolder').className = 'btn-disconnect-folder';
      document.getElementById('btnConnectFolder').onclick = disconnectFolder;
      document.getElementById('fileTree').innerHTML = renderTreeHTML(projectTree);
      updateSelectedCount();
    }

    function renderTreeHTML(items) {
      return items.map(function(item) {
        if (item.kind === 'dir') {
          return '<div>'
            + '<div class="ft-item ft-dir" onclick="toggleDir(this)">'
            + '<span class="ft-icon">&#9660;</span><span class="ft-name">' + escapeHtml(item.name) + '</span></div>'
            + '<div class="ft-children">' + renderTreeHTML(item.children) + '</div></div>';
        }
        var sel = selectedFiles[item.path] ? ' selected' : '';
        return '<div class="ft-item' + sel + '" data-path="' + escapeHtml(item.path) + '" onclick="toggleFileSelect(this, \\'' + escapeHtml(item.path).replace(/'/g, "\\\\'") + '\\')">'
          + '<span class="ft-icon">&#9679;</span><span class="ft-name">' + escapeHtml(item.name) + '</span></div>';
      }).join('');
    }

    function toggleDir(el) {
      var children = el.nextElementSibling;
      if (children) {
        children.classList.toggle('collapsed');
        var icon = el.querySelector('.ft-icon');
        if (children.classList.contains('collapsed')) icon.innerHTML = '&#9654;';
        else icon.innerHTML = '&#9660;';
      }
    }

    function toggleFileSelect(el, path) {
      if (selectedFiles[path]) {
        delete selectedFiles[path];
        el.classList.remove('selected');
      } else {
        selectedFiles[path] = true;
        el.classList.add('selected');
      }
      updateSelectedCount();
    }

    function updateSelectedCount() {
      var count = Object.keys(selectedFiles).length;
      var countEl = document.getElementById('selectedCount');
      if (count === 0) {
        countEl.style.display = 'none';
      } else {
        countEl.style.display = 'flex';
        countEl.innerHTML = '<span>' + count + ' arquivo(s)</span> incluidos no chat <button class="btn-clear-sel" onclick="clearFileSelection()">limpar</button>';
      }
    }

    function clearFileSelection() {
      selectedFiles = {};
      document.querySelectorAll('.ft-item.selected').forEach(function(el) { el.classList.remove('selected'); });
      updateSelectedCount();
    }

    async function readSelectedFiles() {
      var paths = Object.keys(selectedFiles);
      if (paths.length === 0 || !projectHandle) return [];
      var results = [];
      for (var i = 0; i < paths.length; i++) {
        try {
          var content = await readFileByPath(projectHandle, paths[i]);
          if (content !== null) {
            results.push({ name: paths[i], content: content });
          }
        } catch(e) { console.error('Erro lendo ' + paths[i], e); }
      }
      return results;
    }

    async function readFileByPath(dirHandle, filePath) {
      var parts = filePath.split('/');
      var current = dirHandle;
      for (var i = 0; i < parts.length - 1; i++) {
        current = await current.getDirectoryHandle(parts[i]);
      }
      var fileHandle = await current.getFileHandle(parts[parts.length - 1]);
      var file = await fileHandle.getFile();
      var ext = '.' + file.name.split('.').pop().toLowerCase();
      if (TEXT_EXTS.indexOf(ext) >= 0 || file.type.startsWith('text/')) {
        return await file.text();
      }
      return null;
    }

    // Init
    loadSessions();
    loadIntegrations();
  </script>
</body>
</html>`;
}
