import type { OpenAICompatibleProviderSettings } from '@ai-sdk/openai-compatible'
import type { EmbeddingModelV2, ImageModelV2, LanguageModelV2, TranscriptionModelV2 } from '@ai-sdk/provider'
import type { InfomaniakCommonModelConfig } from './infomaniak-config'
import type { InfomaniakChatModelId, InfomaniakEmbeddingModelId, InfomaniakImageModelId, InfomaniakSTTModelId } from './infomaniak-models'
import {
  OpenAICompatibleChatLanguageModel,
  OpenAICompatibleEmbeddingModel,
  OpenAICompatibleImageModel,
} from '@ai-sdk/openai-compatible'
import { loadApiKey, loadSetting } from '@ai-sdk/provider-utils'
import { InfomaniakTranscriptionModel } from './transcription/infomaniak-transcription-model'

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
  /**
  Include usage information in streaming responses.
   */
  includeUsage?: OpenAICompatibleProviderSettings['includeUsage']
}

export interface InfomaniakProvider {
  (modelId: InfomaniakChatModelId): LanguageModelV2
  languageModel: (modelId: InfomaniakChatModelId) => LanguageModelV2
  chatModel: (modelId: InfomaniakChatModelId) => LanguageModelV2
  textEmbeddingModel: (modelId: InfomaniakEmbeddingModelId) => EmbeddingModelV2<string>
  imageModel: (modelId: InfomaniakImageModelId) => ImageModelV2
  /**
   * Creates a model for transcription.
   * @experimental
   */
  transcription: (modelId: InfomaniakSTTModelId) => TranscriptionModelV2
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

  const getCommonModelConfig = (modelType: string): InfomaniakCommonModelConfig => ({
    provider: `infomaniak.${modelType}`,
    url: ({ path }) => {
      const url = new URL(`${getApiUrl()}${path}`)
      return url.toString()
    },
    headers: getHeaders,
    fetch: options.fetch,
  })

  const createChatModel = (
    modelId: InfomaniakChatModelId,
  ) => {
    return new OpenAICompatibleChatLanguageModel(
      modelId,
      { ...getCommonModelConfig('chat'), includeUsage: options.includeUsage ?? false },
    )
  }

  const createTextEmbeddingModel = (
    modelId: InfomaniakEmbeddingModelId,
  ) => {
    return new OpenAICompatibleEmbeddingModel(
      modelId,
      {
        ...getCommonModelConfig('text_embedding'),
        url: ({ path }) => {
          const url = new URL(`${getApiUrl()}/v1${path}`) // additional versioning in url for embeddings https://developer.infomaniak.com/docs/api/post/1/ai/%7Bproduct_id%7D/openai/v1/embeddings
          return url.toString()
        },
      },
    )
  }

  const createImageModel = (modelId: InfomaniakImageModelId) =>
    new OpenAICompatibleImageModel(modelId, getCommonModelConfig('image'))

  const createTranscriptionModel = (modelId: InfomaniakSTTModelId) =>
    new InfomaniakTranscriptionModel(modelId, {
      ...getCommonModelConfig('transcription'),
    })

  const provider = (modelId: InfomaniakChatModelId) => createChatModel(modelId)
  provider.chatModel = createChatModel
  provider.languageModel = createChatModel
  provider.textEmbeddingModel = createTextEmbeddingModel
  provider.imageModel = createImageModel
  provider.transcription = createTranscriptionModel

  return provider
}

export const infomaniak = createInfomaniak()
