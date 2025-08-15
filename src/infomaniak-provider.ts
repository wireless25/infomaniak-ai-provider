import type { OpenAICompatibleProviderSettings } from '@ai-sdk/openai-compatible'
import type { OpenAICompatibleChatConfig } from '@ai-sdk/openai-compatible/internal'
import type { EmbeddingModelV1, LanguageModelV1 } from '@ai-sdk/provider'
import type { InfomaniakChatModelId, InfomaniakEmbeddingModelId } from './infomaniak-models'
import {
  OpenAICompatibleChatLanguageModel,
  OpenAICompatibleEmbeddingModel,
} from '@ai-sdk/openai-compatible'
import {
  loadApiKey,
  loadSetting,
} from '@ai-sdk/provider-utils'

export interface InfomaniakProviderSettings {
  /**
  API key for authenticating requests. If specified, adds an `Authorization`
  header to request headers with the value `Bearer <apiKey>`. This will be added
  before any headers potentially specified in the `headers` option. Defaults to
  `INFOMANIAK_API_KEY` env variable
   */
  apiKey?: OpenAICompatibleProviderSettings['apiKey']
  /**
  Custom headers to include in the requests.
   */
  headers?: OpenAICompatibleProviderSettings['headers']
  /**
  Infomaniak product ID.
   */
  productId?: string
  /**
  Custom fetch implementation. You can use it as a middleware to intercept requests,
  or to provide a custom fetch implementation for e.g. testing.
   */
  fetch?: OpenAICompatibleProviderSettings['fetch']
}

export interface InfomaniakProvider {
  (modelId: InfomaniakChatModelId): LanguageModelV1
  languageModel: (modelId: InfomaniakChatModelId) => LanguageModelV1
  chatModel: (modelId: InfomaniakChatModelId) => LanguageModelV1
  textEmbeddingModel: (modelId: InfomaniakEmbeddingModelId) => EmbeddingModelV1<string>
  // imageModel: (modelId: InfomaniakImageModelId) => ImageModelV1
}

export function createInfomaniak(
  options: InfomaniakProviderSettings = {},
): InfomaniakProvider {
  const getProductId = () => loadSetting({
    environmentVariableName: 'INFOMANIAK_PRODUCT_ID',
    settingName: 'productId',
    description: 'Infomaniak product ID',
    settingValue: options.productId,
  })
  const getApiUrl = () => `https://api.infomaniak.com/1/ai/${getProductId()}/openai`
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
      const url = new URL(`${getApiUrl()}${path}`)
      return url.toString()
    },
    headers: getHeaders,
  })

  const createChatModel = (
    modelId: InfomaniakChatModelId,
  ) => {
    return new OpenAICompatibleChatLanguageModel(
      modelId,
      {},
      { ...getCommonModelConfig('chat') },
    )
  }

  const createTextEmbeddingModel = (
    modelId: InfomaniakEmbeddingModelId,
  ) => {
    return new OpenAICompatibleEmbeddingModel(
      modelId,
      {},
      { ...getCommonModelConfig('text_embedding') },
    )
  }

  const provider = (modelId: InfomaniakChatModelId) => createChatModel(modelId)
  provider.chatModel = createChatModel
  provider.languageModel = createChatModel
  provider.textEmbeddingModel = createTextEmbeddingModel

  return provider
}

export const infomaniak = createInfomaniak()
