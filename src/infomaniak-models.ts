// Generated types for Infomaniak AI Models
// Last updated: 2025-08-29T20:33:48.932Z
// Do not change this file, it will be regenerated automatically

export type ModelType = 'stt' | 'llm' | 'image' | 'embedding'

export type InfoStatus = 'ready' | 'coming_soon' | (string & {})

// Model ID unions by type
export type InfomaniakSTTModelId
  = | 'whisper'
    | 'whisperV2'
    | (string & {})

export type InfomaniakChatModelId
  = | 'llama3'
    | 'granite'
    | 'reasoning'
    | 'mistral24b'
    | 'mistral3'
    | 'qwen3'
    | 'gemma3n'
    | (string & {})

export type InfomaniakImageModelId
  = | 'photomaker'
    | 'flux'
    | (string & {})

export type InfomaniakEmbeddingModelId
  = | 'bge_multilingual_gemma2'
    | 'mini_lm_l12_v2'
    | (string & {})

// All model IDs union
export type InfomaniakModelId
  = | InfomaniakSTTModelId
    | InfomaniakChatModelId
    | InfomaniakImageModelId
    | InfomaniakEmbeddingModelId

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
  WHISPER: 'whisper' as const,
  LLAMA3: 'llama3' as const,
  PHOTOMAKER: 'photomaker' as const,
  WHISPERV2: 'whisperV2' as const,
  FLUX: 'flux' as const,
  GRANITE: 'granite' as const,
  BGE_MULTILINGUAL_GEMMA2: 'bge_multilingual_gemma2' as const,
  MINI_LM_L12_V2: 'mini_lm_l12_v2' as const,
  REASONING: 'reasoning' as const,
  MISTRAL24B: 'mistral24b' as const,
  MISTRAL3: 'mistral3' as const,
  QWEN3: 'qwen3' as const,
  GEMMA3N: 'gemma3n' as const,
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
