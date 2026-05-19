// Generated types for Infomaniak AI Models
// Last updated: 2026-05-19T15:48:46.018Z
// Do not change this file, it will be regenerated automatically

export type ModelType = 'stt' | 'image' | 'embedding' | 'llm' | 'reranker'

export type InfoStatus = 'ready' | 'coming_soon' | (string & {})

// Model ID unions by type
export type InfomaniakSTTModelId
  = | 'whisper'
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

export type InfomaniakChatModelId
  = | 'swiss-ai/Apertus-70B-Instruct-2509'
    | 'mistralai/Ministral-3-14B-Instruct-2512'
    | 'Qwen/Qwen3.5-122B-A10B-FP8'
    | 'google/gemma-4-31B-it'
    | 'moonshotai/Kimi-K2.6'
    | (string & {})

export type InfomaniakRERANKERModelId
  = | 'BAAI/bge-reranker-v2-m3'
    | 'Qwen/Qwen3-Reranker-0.6B'
    | (string & {})

// All model IDs union
export type InfomaniakModelId
  = | InfomaniakSTTModelId
    | InfomaniakImageModelId
    | InfomaniakEmbeddingModelId
    | InfomaniakChatModelId
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
  'PHOTOMAKER': 'photomaker' as const,
  'FLUX': 'flux' as const,
  'BGE_MULTILINGUAL_GEMMA2': 'bge_multilingual_gemma2' as const,
  'MINI_LM_L12_V2': 'mini_lm_l12_v2' as const,
  'SWISS-AI/APERTUS-70B-INSTRUCT-2509': 'swiss-ai/Apertus-70B-Instruct-2509' as const,
  'QWEN/QWEN3-EMBEDDING-8B': 'Qwen/Qwen3-Embedding-8B' as const,
  'BAAI/BGE-RERANKER-V2-M3': 'BAAI/bge-reranker-v2-m3' as const,
  'QWEN/QWEN3-RERANKER-0.6B': 'Qwen/Qwen3-Reranker-0.6B' as const,
  'MISTRALAI/MINISTRAL-3-14B-INSTRUCT-2512': 'mistralai/Ministral-3-14B-Instruct-2512' as const,
  'QWEN/QWEN3.5-122B-A10B-FP8': 'Qwen/Qwen3.5-122B-A10B-FP8' as const,
  'GOOGLE/GEMMA-4-31B-IT': 'google/gemma-4-31B-it' as const,
  'MOONSHOTAI/KIMI-K2.6': 'moonshotai/Kimi-K2.6' as const,
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

export function getImageModels(models: InfomaniakModels): InfomaniakModels {
  return getModelsByType(models, 'image')
}

export function getEmbeddingModels(models: InfomaniakModels): InfomaniakModels {
  return getModelsByType(models, 'embedding')
}

export function getChatModels(models: InfomaniakModels): InfomaniakModels {
  return getModelsByType(models, 'llm')
}

export function getRERANKERModels(models: InfomaniakModels): InfomaniakModels {
  return getModelsByType(models, 'reranker')
}
