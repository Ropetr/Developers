// Integração com Cloudflare API
// Permite aos agentes gerenciar Workers, D1, KV, DNS, etc.

export interface CloudflareClient {
  verifyToken(): Promise<{ status: string }>;
  listWorkers(): Promise<Array<{ id: string; modified_on: string }>>;
  listD1Databases(): Promise<Array<{ uuid: string; name: string }>>;
  listKVNamespaces(): Promise<Array<{ id: string; title: string }>>;
  listZones(): Promise<Array<{ id: string; name: string; status: string }>>;
  createWorker(name: string, script: string): Promise<void>;
  createD1Database(name: string): Promise<{ uuid: string; name: string }>;
}

export function createCloudflareClient(token: string, accountId: string): CloudflareClient {
  const baseUrl = "https://api.cloudflare.com/client/v4";

  async function request<T>(method: string, path: string, body?: unknown, contentType?: string): Promise<T> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (contentType) {
      headers["Content-Type"] = contentType;
    } else if (body && typeof body === "object") {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body
        ? typeof body === "string"
          ? body
          : JSON.stringify(body)
        : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare API (${response.status}): ${error}`);
    }

    const data = (await response.json()) as { result: T; success: boolean; errors: Array<{ message: string }> };
    if (!data.success) {
      throw new Error(`Cloudflare: ${data.errors.map((e) => e.message).join(", ")}`);
    }

    return data.result;
  }

  return {
    async verifyToken() {
      const result = await request<{ status: string }>("GET", "/user/tokens/verify");
      return result;
    },

    async listWorkers() {
      return request("GET", `/accounts/${accountId}/workers/scripts`);
    },

    async listD1Databases() {
      return request("GET", `/accounts/${accountId}/d1/database`);
    },

    async listKVNamespaces() {
      return request("GET", `/accounts/${accountId}/storage/kv/namespaces`);
    },

    async listZones() {
      return request("GET", "/zones?per_page=50");
    },

    async createWorker(name, script) {
      await request(
        "PUT",
        `/accounts/${accountId}/workers/scripts/${name}`,
        script,
        "application/javascript"
      );
    },

    async createD1Database(name) {
      return request("POST", `/accounts/${accountId}/d1/database`, { name });
    },
  };
}
