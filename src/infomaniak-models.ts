// Generated types for Infomaniak AI Models
// Last updated: 2025-12-23T10:16:55.092Z
// Do not change this file, it will be regenerated automatically

export type ModelType = 'stt' | 'llm' | 'image' | 'embedding' | 'reranker'

export type InfoStatus = 'ready' | 'coming_soon' | (string & {})

// Model ID unions by type
export type InfomaniakSTTModelId
  = | 'whisper'
    | (string & {})

export type InfomaniakChatModelId
  = | 'llama3'
    | 'granite'
    | 'mistral3'
    | 'qwen3'
    | 'gemma3n'
    | 'swiss-ai/Apertus-70B-Instruct-2509'
    | 'openai/gpt-oss-120b'
    | (string & {})

export type InfomaniakImageModelId
  = | 'photomaker'
    | 'flux'
    | (string & {})

export type InfomaniakEmbeddingModelId
  = | 'bge_multilingual_gemma2'
    | 'mini_lm_l12_v2'
    | 'Qwen/Qwen3-Embedding-8B'
    | (string & {})

export type InfomaniakRERANKERModelId
  = | 'BAAI/bge-reranker-v2-m3'
    | 'Qwen/Qwen3-Reranker-0.6B'
    | (string & {})

// All model IDs union
export type InfomaniakModelId
  = | InfomaniakSTTModelId
    | InfomaniakChatModelId
    | InfomaniakImageModelId
    | InfomaniakEmbeddingModelId
    | InfomaniakRERANKERModelId

export interface InfomaniakModel {
  description: string
  documentation_link: string
  id: number
  info_status: InfoStatus
  last_updated_at: string
  logo_url: string
  max_token_input: number | null
  name: string
  type: ModelType
  version: string
}

export type InfomaniakModels = InfomaniakModel[]

// Model name constants for easy access
export const MODEL_NAMES = {
  'WHISPER': 'whisper' as const,
  'LLAMA3': 'llama3' as const,
  'PHOTOMAKER': 'photomaker' as const,
  'FLUX': 'flux' as const,
  'GRANITE': 'granite' as const,
  'BGE_MULTILINGUAL_GEMMA2': 'bge_multilingual_gemma2' as const,
  'MINI_LM_L12_V2': 'mini_lm_l12_v2' as const,
  'MISTRAL3': 'mistral3' as const,
  'QWEN3': 'qwen3' as const,
  'GEMMA3N': 'gemma3n' as const,
  'SWISS-AI/APERTUS-70B-INSTRUCT-2509': 'swiss-ai/Apertus-70B-Instruct-2509' as const,
  'QWEN/QWEN3-EMBEDDING-8B': 'Qwen/Qwen3-Embedding-8B' as const,
  'OPENAI/GPT-OSS-120B': 'openai/gpt-oss-120b' as const,
  'BAAI/BGE-RERANKER-V2-M3': 'BAAI/bge-reranker-v2-m3' as const,
  'QWEN/QWEN3-RERANKER-0.6B': 'Qwen/Qwen3-Reranker-0.6B' as const,
} as const

// Helper functions
export function getModelsByType<T extends ModelType>(models: InfomaniakModels, type: T): InfomaniakModel[] {
  return models.filter(model => model.type === type)
}

export function getReadyModels(models: InfomaniakModels): InfomaniakModels {
  return models.filter(model => model.info_status === 'ready')
}

export function getSTTModels(models: InfomaniakModels): InfomaniakModels {
  return getModelsByType(models, 'stt')
}

export function getChatModels(models: InfomaniakModels): InfomaniakModels {
  return getModelsByType(models, 'llm')
}

export function getImageModels(models: InfomaniakModels): InfomaniakModels {
  return getModelsByType(models, 'image')
}

export function getEmbeddingModels(models: InfomaniakModels): InfomaniakModels {
  return getModelsByType(models, 'embedding')
}

export function getRERANKERModels(models: InfomaniakModels): InfomaniakModels {
  return getModelsByType(models, 'reranker')
}
