import { beforeEach, describe, expect, it, vi } from 'vitest'
import { infomaniak } from './infomaniak-provider'

// Mock the imported modules using a partial mock to preserve original exports
vi.mock('@ai-sdk/provider-utils', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@ai-sdk/provider-utils')>()
  return {
    ...mod,
    loadApiKey: vi.fn().mockImplementation(({ apiKey }) => apiKey),
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
})
