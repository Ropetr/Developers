// Ferramentas reais que os agentes podem usar via Claude Tool Use
// Cada ferramenta é executada no servidor (Worker) e o resultado volta ao Claude

import { Env } from "../types";

// Definição das ferramentas no formato da API do Claude
export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required: string[];
  };
}

// Resultado de uma operação de arquivo (enviado ao browser para aplicar na pasta local)
export interface FileOperation {
  action: "create" | "edit" | "delete";
  path: string;
  content: string;
}

// Resultado da execução de uma ferramenta
export interface ToolResult {
  output: string;
  file_operations?: FileOperation[];
}

// --- DEFINIÇÕES DAS FERRAMENTAS ---

export const AGENT_TOOLS: ToolDefinition[] = [
  {
    name: "create_file",
    description:
      "Cria um novo arquivo no projeto do usuario. Use para gerar codigo, configuracoes, documentacao, etc. O arquivo sera aplicado automaticamente na pasta local do usuario se estiver conectada.",
    input_schema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description:
            "Caminho do arquivo relativo a raiz do projeto (ex: src/components/Button.tsx, package.json, README.md)",
        },
        content: {
          type: "string",
          description: "Conteudo completo do arquivo",
        },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "edit_file",
    description:
      "Edita um arquivo existente no projeto. Substitui o conteudo atual pelo novo conteudo. Use quando o usuario pedir para modificar um arquivo que foi compartilhado no contexto.",
    input_schema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Caminho do arquivo a ser editado",
        },
        content: {
          type: "string",
          description: "Novo conteudo completo do arquivo",
        },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "create_project_structure",
    description:
      "Cria multiplos arquivos de uma vez para montar a estrutura de um projeto (ex: package.json + src/index.ts + tsconfig.json etc). Mais eficiente que criar um arquivo por vez.",
    input_schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          description: "Lista de arquivos para criar",
          items: {
            type: "object",
            properties: {
              path: { type: "string", description: "Caminho do arquivo" },
              content: { type: "string", description: "Conteudo do arquivo" },
            },
            required: ["path", "content"],
          },
        },
      },
      required: ["files"],
    },
  },
  {
    name: "github_list_repos",
    description:
      "Lista os repositorios do usuario no GitHub. Use para saber quais projetos existem antes de criar novos.",
    input_schema: {
      type: "object",
      properties: {
        per_page: {
          type: "number",
          description: "Numero de repositorios por pagina (max 30)",
        },
      },
      required: [],
    },
  },
  {
    name: "github_create_repo",
    description:
      "Cria um novo repositorio no GitHub para o usuario.",
    input_schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Nome do repositorio (ex: meu-saas)",
        },
        description: {
          type: "string",
          description: "Descricao do repositorio",
        },
        is_private: {
          type: "boolean",
          description: "Se true, repositorio privado. Default: false",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "github_push_files",
    description:
      "Envia (push) um ou mais arquivos para um repositorio GitHub, criando um commit. Use para publicar codigo criado no repositorio do usuario.",
    input_schema: {
      type: "object",
      properties: {
        repo: {
          type: "string",
          description: "Nome do repositorio (ex: owner/repo ou apenas repo se for do usuario)",
        },
        branch: {
          type: "string",
          description: "Branch para fazer o push (default: main)",
        },
        message: {
          type: "string",
          description: "Mensagem do commit",
        },
        files: {
          type: "array",
          description: "Arquivos para enviar",
          items: {
            type: "object",
            properties: {
              path: { type: "string" },
              content: { type: "string" },
            },
            required: ["path", "content"],
          },
        },
      },
      required: ["repo", "message", "files"],
    },
  },
  {
    name: "github_read_file",
    description:
      "Le o conteudo de um arquivo de um repositorio GitHub. Use para ver codigo existente antes de modificar.",
    input_schema: {
      type: "object",
      properties: {
        repo: {
          type: "string",
          description: "Nome do repositorio (ex: owner/repo)",
        },
        path: {
          type: "string",
          description: "Caminho do arquivo no repositorio",
        },
        branch: {
          type: "string",
          description: "Branch (default: main)",
        },
      },
      required: ["repo", "path"],
    },
  },
  {
    name: "github_list_files",
    description:
      "Lista arquivos e pastas de um diretorio em um repositorio GitHub.",
    input_schema: {
      type: "object",
      properties: {
        repo: {
          type: "string",
          description: "Nome do repositorio (ex: owner/repo)",
        },
        path: {
          type: "string",
          description: "Caminho do diretorio (vazio para raiz)",
        },
        branch: {
          type: "string",
          description: "Branch (default: main)",
        },
      },
      required: ["repo"],
    },
  },
];

// --- EXECUTOR DE FERRAMENTAS ---

export class ToolExecutor {
  private env: Env;
  private fileOps: FileOperation[] = [];

  constructor(env: Env) {
    this.env = env;
  }

  getFileOperations(): FileOperation[] {
    return this.fileOps;
  }

  async execute(
    toolName: string,
    input: Record<string, unknown>
  ): Promise<ToolResult> {
    switch (toolName) {
      case "create_file":
        return this.createFile(input);
      case "edit_file":
        return this.editFile(input);
      case "create_project_structure":
        return this.createProjectStructure(input);
      case "github_list_repos":
        return this.githubListRepos(input);
      case "github_create_repo":
        return this.githubCreateRepo(input);
      case "github_push_files":
        return this.githubPushFiles(input);
      case "github_read_file":
        return this.githubReadFile(input);
      case "github_list_files":
        return this.githubListFiles(input);
      default:
        return { output: `Ferramenta "${toolName}" nao reconhecida.` };
    }
  }

  // --- FILE TOOLS ---

  private createFile(input: Record<string, unknown>): ToolResult {
    const path = input.path as string;
    const content = input.content as string;
    this.fileOps.push({ action: "create", path, content });
    return {
      output: `Arquivo criado: ${path} (${content.length} caracteres). Sera aplicado automaticamente na pasta local do usuario.`,
      file_operations: [{ action: "create", path, content }],
    };
  }

  private editFile(input: Record<string, unknown>): ToolResult {
    const path = input.path as string;
    const content = input.content as string;
    this.fileOps.push({ action: "edit", path, content });
    return {
      output: `Arquivo editado: ${path} (${content.length} caracteres). Sera aplicado automaticamente.`,
      file_operations: [{ action: "edit", path, content }],
    };
  }

  private createProjectStructure(input: Record<string, unknown>): ToolResult {
    const files = input.files as Array<{ path: string; content: string }>;
    const ops: FileOperation[] = [];
    for (const f of files) {
      ops.push({ action: "create", path: f.path, content: f.content });
      this.fileOps.push({ action: "create", path: f.path, content: f.content });
    }
    return {
      output: `Estrutura criada com ${files.length} arquivos: ${files.map((f) => f.path).join(", ")}. Serao aplicados automaticamente.`,
      file_operations: ops,
    };
  }

  // --- GITHUB TOOLS ---

  private async getGitHubToken(): Promise<string | null> {
    try {
      const { createTokenStore } = await import("../integrations/tokens");
      const store = createTokenStore(this.env.DB, this.env.ENCRYPTION_SECRET);
      return await store.get("github");
    } catch {
      // ignore
    }
    return null;
  }

  private async githubAPI(
    method: string,
    endpoint: string,
    body?: unknown
  ): Promise<{ ok: boolean; data: unknown; status: number }> {
    const token = await this.getGitHubToken();
    if (!token) {
      return {
        ok: false,
        data: "Token do GitHub nao configurado. Va em Integracoes e adicione seu token.",
        status: 401,
      };
    }
    const res = await fetch(`https://api.github.com${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Developers-AI",
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  }

  private async githubListRepos(input: Record<string, unknown>): Promise<ToolResult> {
    const perPage = (input.per_page as number) || 20;
    const res = await this.githubAPI("GET", `/user/repos?per_page=${perPage}&sort=updated`);
    if (!res.ok) return { output: `Erro GitHub: ${JSON.stringify(res.data)}` };
    const repos = res.data as Array<{ full_name: string; description: string; private: boolean; html_url: string }>;
    const list = repos.map((r) => `- ${r.full_name}${r.private ? " (privado)" : ""}: ${r.description || "sem descricao"}`).join("\n");
    return { output: `${repos.length} repositorios encontrados:\n${list}` };
  }

  private async githubCreateRepo(input: Record<string, unknown>): Promise<ToolResult> {
    const name = input.name as string;
    const description = (input.description as string) || "";
    const isPrivate = (input.is_private as boolean) || false;
    const res = await this.githubAPI("POST", "/user/repos", {
      name,
      description,
      private: isPrivate,
      auto_init: true,
    });
    if (!res.ok) return { output: `Erro ao criar repositorio: ${JSON.stringify(res.data)}` };
    const repo = res.data as { full_name: string; html_url: string };
    return { output: `Repositorio criado: ${repo.full_name}\nURL: ${repo.html_url}` };
  }

  private async githubPushFiles(input: Record<string, unknown>): Promise<ToolResult> {
    const repo = input.repo as string;
    const branch = (input.branch as string) || "main";
    const message = input.message as string;
    const files = input.files as Array<{ path: string; content: string }>;

    // Get the latest commit SHA for the branch
    const refRes = await this.githubAPI("GET", `/repos/${repo}/git/ref/heads/${branch}`);
    if (!refRes.ok) {
      return { output: `Erro: branch '${branch}' nao encontrada no repo '${repo}'. ${JSON.stringify(refRes.data)}` };
    }
    const latestCommitSha = ((refRes.data as { object: { sha: string } }).object).sha;

    // Get the tree SHA
    const commitRes = await this.githubAPI("GET", `/repos/${repo}/git/commits/${latestCommitSha}`);
    if (!commitRes.ok) return { output: `Erro ao ler commit: ${JSON.stringify(commitRes.data)}` };
    const baseTreeSha = ((commitRes.data as { tree: { sha: string } }).tree).sha;

    // Create blobs for each file
    const tree: Array<{ path: string; mode: string; type: string; sha: string }> = [];
    for (const file of files) {
      const blobRes = await this.githubAPI("POST", `/repos/${repo}/git/blobs`, {
        content: file.content,
        encoding: "utf-8",
      });
      if (!blobRes.ok) return { output: `Erro ao criar blob para ${file.path}: ${JSON.stringify(blobRes.data)}` };
      tree.push({
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: (blobRes.data as { sha: string }).sha,
      });
    }

    // Create tree
    const treeRes = await this.githubAPI("POST", `/repos/${repo}/git/trees`, {
      base_tree: baseTreeSha,
      tree,
    });
    if (!treeRes.ok) return { output: `Erro ao criar tree: ${JSON.stringify(treeRes.data)}` };
    const newTreeSha = (treeRes.data as { sha: string }).sha;

    // Create commit
    const newCommitRes = await this.githubAPI("POST", `/repos/${repo}/git/commits`, {
      message,
      tree: newTreeSha,
      parents: [latestCommitSha],
    });
    if (!newCommitRes.ok) return { output: `Erro ao criar commit: ${JSON.stringify(newCommitRes.data)}` };
    const newCommitSha = (newCommitRes.data as { sha: string }).sha;

    // Update reference
    const updateRefRes = await this.githubAPI("PATCH", `/repos/${repo}/git/ref/heads/${branch}`, {
      sha: newCommitSha,
    });
    if (!updateRefRes.ok) return { output: `Erro ao atualizar ref: ${JSON.stringify(updateRefRes.data)}` };

    return {
      output: `Push realizado com sucesso!\nRepo: ${repo}\nBranch: ${branch}\nCommit: ${newCommitSha.substring(0, 7)}\nArquivos: ${files.map((f) => f.path).join(", ")}\nMensagem: ${message}`,
    };
  }

  private async githubReadFile(input: Record<string, unknown>): Promise<ToolResult> {
    const repo = input.repo as string;
    const path = input.path as string;
    const branch = (input.branch as string) || "main";
    const res = await this.githubAPI("GET", `/repos/${repo}/contents/${path}?ref=${branch}`);
    if (!res.ok) return { output: `Erro ao ler ${path}: ${JSON.stringify(res.data)}` };
    const data = res.data as { content: string; encoding: string; size: number };
    if (data.encoding === "base64") {
      const decoded = atob(data.content.replace(/\n/g, ""));
      return { output: `Arquivo: ${path} (${data.size} bytes)\n\n${decoded}` };
    }
    return { output: `Arquivo: ${path}\n\n${data.content}` };
  }

  private async githubListFiles(input: Record<string, unknown>): Promise<ToolResult> {
    const repo = input.repo as string;
    const path = (input.path as string) || "";
    const branch = (input.branch as string) || "main";
    const res = await this.githubAPI("GET", `/repos/${repo}/contents/${path}?ref=${branch}`);
    if (!res.ok) return { output: `Erro ao listar ${path || "/"}: ${JSON.stringify(res.data)}` };
    const items = res.data as Array<{ name: string; type: string; size: number; path: string }>;
    const list = items
      .map((item) => `${item.type === "dir" ? "📁" : "📄"} ${item.path}${item.type === "file" ? ` (${item.size}b)` : ""}`)
      .join("\n");
    return { output: `Conteudo de ${repo}/${path || "/"}:\n${list}` };
  }
}
