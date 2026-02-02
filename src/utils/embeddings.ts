// Geração de embeddings para memória vetorial
// Usa a API de embeddings da Cloudflare AI (gratuita nos Workers)

export async function generateEmbedding(text: string): Promise<number[]> {
  // Cloudflare Workers AI tem um modelo de embeddings embutido
  // Por enquanto, usamos um hash simples como fallback
  // Em produção, integrar com @cf/baai/bge-large-en-v1.5
  return simpleEmbedding(text);
}

// Embedding simplificado para desenvolvimento
// SUBSTITUIR por Cloudflare AI embeddings em produção
function simpleEmbedding(text: string): number[] {
  const dimensions = 1024;
  const embedding = new Array(dimensions).fill(0);
  const normalized = text.toLowerCase().trim();

  for (let i = 0; i < normalized.length; i++) {
    const charCode = normalized.charCodeAt(i);
    const idx = (charCode * (i + 1)) % dimensions;
    embedding[idx] += 1 / (1 + Math.sqrt(i));
  }

  // Normalizar o vetor
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < dimensions; i++) {
      embedding[i] /= magnitude;
    }
  }

  return embedding;
}
