import type { OpenAICompatibleChatConfig } from '@ai-sdk/openai-compatible/internal'
import type { LanguageModelV2 } from '@ai-sdk/provider'
import type { InfomaniakChatModelId } from './infomaniak-chat-settings'
import {
  OpenAICompatibleChatLanguageModel,
} from '@ai-sdk/openai-compatible'
import {
  loadApiKey,
  loadSetting,
  withoutTrailingSlash,
} from '@ai-sdk/provider-utils'

export interface InfomaniakProviderSettings {
  /**
  Infomaniak API key.
   */
  apiKey?: string
  /**
  Base URL for the API calls.
   */
  baseURL?: string
  /**
  Custom headers to include in the requests.
   */
  headers?: Record<string, string>
  /**
   * Infomaniak API version.
   */
  apiVersion?: string
  /**
   * Infomaniak product ID.
   */
  productId?: string
}

export interface InfomaniakProvider {
  /**
  Creates a model for text generation.
   */
  (
    modelId: InfomaniakChatModelId,
  ): LanguageModelV2
}

export function createInfomaniak(
  options: InfomaniakProviderSettings = {},
): InfomaniakProvider {
  const productId = loadSetting({
    environmentVariableName: 'INFOMANIAK_PRODUCT_ID',
    settingName: 'productId',
    description: 'Infomaniak product ID',
    settingValue: options.productId,
  })
  const baseURL = withoutTrailingSlash(
    options.baseURL ?? `https://api.infomaniak.com/1/ai/${productId}/openai`,
  )
  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: 'INFOMANIAK_API_KEY',
      description: 'Infomaniak API key',
    })}`,
    ...options.headers,
  })

  const getCommonModelConfig = (modelType: string): OpenAICompatibleChatConfig => ({
    provider: `infomaniak.${modelType}`,
    url: ({ path }) => {
      const url = new URL(`${baseURL}${path}`)
      return url.toString()
    },
    headers: getHeaders,
  })

  const createChatModel = (
    modelId: InfomaniakChatModelId,
  ) => {
    return new OpenAICompatibleChatLanguageModel(
      modelId,
      getCommonModelConfig('chat'),
    )
  }

  const provider = (modelId: InfomaniakChatModelId) => createChatModel(modelId)

  return provider
}

export const infomaniak = createInfomaniak()
