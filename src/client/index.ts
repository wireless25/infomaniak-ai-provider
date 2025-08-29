import type { InfomaniakModel as InfomaniakApiModel } from '../infomaniak-models'
import { getChatModels, getEmbeddingModels, getImageModels, getSTTModels } from '../infomaniak-models'
import modelData from '../infomaniak-models-data.json'

interface InfomaniakModel {
  name: string
  type: string
  id: string
  version: string
  maxTokenInput: number | null
  lastUpdatedAt: string
  status: string
}

const _models = modelData as InfomaniakApiModel[]

export function useInfomaniakModels() {
  function toClientModel(model: InfomaniakApiModel): InfomaniakModel {
    return {
      name: model.description,
      type: model.type,
      id: model.name,
      version: model.version,
      maxTokenInput: model.max_token_input,
      lastUpdatedAt: model.last_updated_at,
      status: model.info_status,
    }
  }

  return {
    chatModels: getChatModels(_models).map(toClientModel),
    embeddingModels: getEmbeddingModels(_models).map(toClientModel),
    imageModels: getImageModels(_models).map(toClientModel),
    transcriptionModels: getSTTModels(_models).map(toClientModel),
    models: _models.map(toClientModel),
  }
}

export type { InfomaniakModel }
