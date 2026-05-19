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
    name: MODEL_NAMES['QWEN/QWEN3.5-122B-A10B-FP8'],
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
    expect(MODEL_NAMES.PHOTOMAKER).toBe('photomaker')
    expect(MODEL_NAMES.FLUX).toBe('flux')
    expect(MODEL_NAMES.BGE_MULTILINGUAL_GEMMA2).toBe('bge_multilingual_gemma2')
    expect(MODEL_NAMES.MINI_LM_L12_V2).toBe('mini_lm_l12_v2')
    expect(MODEL_NAMES['SWISS-AI/APERTUS-70B-INSTRUCT-2509']).toBe('swiss-ai/Apertus-70B-Instruct-2509')
    expect(MODEL_NAMES['QWEN/QWEN3-EMBEDDING-8B']).toBe('Qwen/Qwen3-Embedding-8B')
    expect(MODEL_NAMES['BAAI/BGE-RERANKER-V2-M3']).toBe('BAAI/bge-reranker-v2-m3')
    expect(MODEL_NAMES['QWEN/QWEN3-RERANKER-0.6B']).toBe('Qwen/Qwen3-Reranker-0.6B')
    expect(MODEL_NAMES['MISTRALAI/MINISTRAL-3-14B-INSTRUCT-2512']).toBe('mistralai/Ministral-3-14B-Instruct-2512')
    expect(MODEL_NAMES['QWEN/QWEN3.5-122B-A10B-FP8']).toBe('Qwen/Qwen3.5-122B-A10B-FP8')
    expect(MODEL_NAMES['GOOGLE/GEMMA-4-31B-IT']).toBe('google/gemma-4-31B-it')
    expect(MODEL_NAMES['MOONSHOTAI/KIMI-K2.6']).toBe('moonshotai/Kimi-K2.6')
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
