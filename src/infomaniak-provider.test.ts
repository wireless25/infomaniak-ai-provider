import { beforeEach, describe, expect, it, vi } from 'vitest'
import { infomaniak } from './infomaniak-provider'

// Mock the imported modules using a partial mock to preserve original exports
vi.mock('@ai-sdk/provider-utils', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@ai-sdk/provider-utils')>()
  return {
    ...mod,
    loadApiKey: vi.fn().mockImplementation(({ apiKey }) => apiKey),
    loadSetting: vi.fn().mockImplementation(({ settingValue }) => settingValue),
    generateId: vi.fn().mockReturnValue('mock-id'),
    withoutTrailingSlash: vi.fn().mockImplementation(url => url),
  }
})

describe('infomaniak-provider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create an instance of Infomaniak with env vars only', () => {
    const model = infomaniak('qwen3')
    expect(model).toBeDefined()
    expect(model.modelId).toBe('qwen3')
    expect(model.provider).toBe('infomaniak.chat')
  })

  it('should create an explicit chat model instance', () => {
    const model = infomaniak.chatModel('qwen3')
    expect(model).toBeDefined()
    expect(model.modelId).toBe('qwen3')
    expect(model.provider).toBe('infomaniak.chat')
  })

  it('should create an embedding model instance', () => {
    const model = infomaniak.textEmbeddingModel('bge_multilingual_gemma2')
    expect(model).toBeDefined()
    expect(model.modelId).toBe('bge_multilingual_gemma2')
    expect(model.provider).toBe('infomaniak.text_embedding')
  })

  it('should create an image model instance', () => {
    const model = infomaniak.imageModel('flux')
    expect(model).toBeDefined()
    expect(model.modelId).toBe('flux')
    expect(model.provider).toBe('infomaniak.image')
  })
})
