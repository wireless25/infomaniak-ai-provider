import type { InfomaniakModels } from './infomaniak-models'
import { describe, expect, it } from 'vitest'
import {
  getChatModels,
  getEmbeddingModels,
  getImageModels,
  getModelsByType,
  getReadyModels,
  getSTTModels,
  MODEL_NAMES,
} from './infomaniak-models'

const mockModels: InfomaniakModels = [
  {
    description: 'Whisper STT',
    documentation_link: 'https://docs/whisper',
    id: 1,
    info_status: 'ready',
    last_updated_at: '2025-08-15',
    logo_url: 'https://logo/whisper.png',
    max_token_input: null,
    name: MODEL_NAMES.WHISPER,
    type: 'stt',
    version: '1.0',
  },
  {
    description: 'Llama3 LLM',
    documentation_link: 'https://docs/llama3',
    id: 2,
    info_status: 'coming_soon',
    last_updated_at: '2025-08-15',
    logo_url: 'https://logo/llama3.png',
    max_token_input: 4096,
    name: MODEL_NAMES.LLAMA3,
    type: 'llm',
    version: '3.0',
  },
  {
    description: 'Photomaker Image',
    documentation_link: 'https://docs/photomaker',
    id: 3,
    info_status: 'ready',
    last_updated_at: '2025-08-15',
    logo_url: 'https://logo/photomaker.png',
    max_token_input: null,
    name: MODEL_NAMES.PHOTOMAKER,
    type: 'image',
    version: '2.1',
  },
  {
    description: 'BGE Multilingual Embedding',
    documentation_link: 'https://docs/bge',
    id: 4,
    info_status: 'ready',
    last_updated_at: '2025-08-15',
    logo_url: 'https://logo/bge.png',
    max_token_input: 512,
    name: MODEL_NAMES.BGE_MULTILINGUAL_GEMMA2,
    type: 'embedding',
    version: '2.0',
  },
]

describe('infomaniak-models helpers', () => {
  it('getModelsByType returns correct models for type', () => {
    expect(getModelsByType(mockModels, 'stt')).toHaveLength(1)
    expect(getModelsByType(mockModels, 'llm')).toHaveLength(1)
    expect(getModelsByType(mockModels, 'image')).toHaveLength(1)
    expect(getModelsByType(mockModels, 'embedding')).toHaveLength(1)
  })

  it('getReadyModels returns only ready models', () => {
    const ready = getReadyModels(mockModels)
    expect(ready).toHaveLength(3)
    expect(ready.every(m => m.info_status === 'ready')).toBe(true)
  })

  it('getTranscriptionModels returns only stt models', () => {
    const stt = getSTTModels(mockModels)
    expect(stt).toHaveLength(1)
    expect(stt[0].type).toBe('stt')
  })

  it('getChatModels returns only llm models', () => {
    const llm = getChatModels(mockModels)
    expect(llm).toHaveLength(1)
    expect(llm[0].type).toBe('llm')
  })

  it('getImageModels returns only image models', () => {
    const image = getImageModels(mockModels)
    expect(image).toHaveLength(1)
    expect(image[0].type).toBe('image')
  })

  it('getEmbeddingModels returns only embedding models', () => {
    const embedding = getEmbeddingModels(mockModels)
    expect(embedding).toHaveLength(1)
    expect(embedding[0].type).toBe('embedding')
  })

  it('the const MODEL_NAMES contains expected keys', () => {
    expect(MODEL_NAMES.WHISPER).toBe('whisper')
    expect(MODEL_NAMES.LLAMA3).toBe('llama3')
    expect(MODEL_NAMES.PHOTOMAKER).toBe('photomaker')
    expect(MODEL_NAMES.FLUX).toBe('flux')
    expect(MODEL_NAMES.GRANITE).toBe('granite')
    expect(MODEL_NAMES.BGE_MULTILINGUAL_GEMMA2).toBe('bge_multilingual_gemma2')
    expect(MODEL_NAMES.MINI_LM_L12_V2).toBe('mini_lm_l12_v2')
    expect(MODEL_NAMES.MISTRAL3).toBe('mistral3')
    expect(MODEL_NAMES.QWEN3).toBe('qwen3')
    expect(MODEL_NAMES.GEMMA3N).toBe('gemma3n')
  })

  it('getModelsByType returns empty array for unknown type', () => {
    // @ts-expect-error: testing invalid type
    expect(getModelsByType(mockModels, 'unknown')).toHaveLength(0)
  })

  it('getReadyModels returns empty array if no ready models', () => {
    const allComingSoon = mockModels.map(m => ({ ...m, info_status: 'coming_soon' }))
    expect(getReadyModels(allComingSoon)).toHaveLength(0)
  })
})
