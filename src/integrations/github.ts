// Integração com GitHub API
// Permite aos agentes criar repos, commits, branches, PRs, etc.

export interface GitHubClient {
  getUser(): Promise<{ login: string; name: string }>;
  listRepos(): Promise<Array<{ name: string; full_name: string; html_url: string; private: boolean }>>;
  createRepo(name: string, description?: string, isPrivate?: boolean): Promise<{ html_url: string; clone_url: string }>;
  getRepoContents(owner: string, repo: string, path?: string): Promise<Array<{ name: string; path: string; type: string }>>;
  createOrUpdateFile(owner: string, repo: string, path: string, content: string, message: string, branch?: string): Promise<{ commit: { sha: string } }>;
  createBranch(owner: string, repo: string, branchName: string, fromBranch?: string): Promise<void>;
  createPullRequest(owner: string, repo: string, title: string, body: string, head: string, base?: string): Promise<{ html_url: string; number: number }>;
}

export function createGitHubClient(token: string): GitHubClient {
  const baseUrl = "https://api.github.com";

  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "Developers-AI",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API (${response.status}): ${error}`);
    }

    return response.json() as Promise<T>;
  }

  return {
    async getUser() {
      return request("GET", "/user");
    },

    async listRepos() {
      return request("GET", "/user/repos?sort=updated&per_page=30");
    },

    async createRepo(name, description = "", isPrivate = true) {
      return request("POST", "/user/repos", {
        name,
        description,
        private: isPrivate,
        auto_init: true,
      });
    },

    async getRepoContents(owner, repo, path = "") {
      return request("GET", `/repos/${owner}/${repo}/contents/${path}`);
    },

    async createOrUpdateFile(owner, repo, path, content, message, branch = "main") {
      // Verifica se arquivo existe para pegar o SHA
      let sha: string | undefined;
      try {
        const existing = await request<{ sha: string }>("GET", `/repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
        sha = existing.sha;
      } catch {
        // Arquivo não existe, será criado
      }

      return request("PUT", `/repos/${owner}/${repo}/contents/${path}`, {
        message,
        content: btoa(unescape(encodeURIComponent(content))),
        branch,
        sha,
      });
    },

    async createBranch(owner, repo, branchName, fromBranch = "main") {
      const ref = await request<{ object: { sha: string } }>("GET", `/repos/${owner}/${repo}/git/ref/heads/${fromBranch}`);
      await request("POST", `/repos/${owner}/${repo}/git/refs`, {
        ref: `refs/heads/${branchName}`,
        sha: ref.object.sha,
      });
    },

    async createPullRequest(owner, repo, title, body, head, base = "main") {
      return request("POST", `/repos/${owner}/${repo}/pulls`, {
        title,
        body,
        head,
        base,
      });
    },
  };
}
