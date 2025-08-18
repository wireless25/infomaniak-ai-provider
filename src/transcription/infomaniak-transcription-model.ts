import type {
  TranscriptionModelV2,
  TranscriptionModelV2CallOptions,
  TranscriptionModelV2CallWarning,
} from '@ai-sdk/provider'
import type { InfomaniakCommonModelConfig } from '../infomaniak-config'
import type { InfomaniakSTTModelId } from '../infomaniak-models'
import type { InfomaniakTranscriptionProviderOptions } from './infomaniak-transcription-options'
import {
  combineHeaders,
  convertBase64ToUint8Array,
  createJsonResponseHandler,
  getFromApi,
  parseProviderOptions,
  postFormDataToApi,
} from '@ai-sdk/provider-utils'
import { z } from 'zod/v4'
import { infomaniakFailedResponseHandler } from '../infomaniak-error'
import { infomaniakTranscriptionProviderOptions } from './infomaniak-transcription-options'

export type InfomaniakTranscriptionCallOptions = Omit<
    TranscriptionModelV2CallOptions,
    'providerOptions'
> & {
  providerOptions?: {
    infomaniak?: InfomaniakTranscriptionProviderOptions
  }
}

interface InfomaniakTranscriptionModelConfig extends InfomaniakCommonModelConfig {
  _internal?: {
    currentDate?: () => Date
  }
}

const languageMap = {
  afrikaans: 'af',
  arabic: 'ar',
  armenian: 'hy',
  azerbaijani: 'az',
  belarusian: 'be',
  bosnian: 'bs',
  bulgarian: 'bg',
  catalan: 'ca',
  chinese: 'zh',
  croatian: 'hr',
  czech: 'cs',
  danish: 'da',
  dutch: 'nl',
  english: 'en',
  estonian: 'et',
  finnish: 'fi',
  french: 'fr',
  galician: 'gl',
  german: 'de',
  greek: 'el',
  hebrew: 'he',
  hindi: 'hi',
  hungarian: 'hu',
  icelandic: 'is',
  indonesian: 'id',
  italian: 'it',
  japanese: 'ja',
  kannada: 'kn',
  kazakh: 'kk',
  korean: 'ko',
  latvian: 'lv',
  lithuanian: 'lt',
  macedonian: 'mk',
  malay: 'ms',
  marathi: 'mr',
  maori: 'mi',
  nepali: 'ne',
  norwegian: 'no',
  persian: 'fa',
  polish: 'pl',
  portuguese: 'pt',
  romanian: 'ro',
  russian: 'ru',
  serbian: 'sr',
  slovak: 'sk',
  slovenian: 'sl',
  spanish: 'es',
  swahili: 'sw',
  swedish: 'sv',
  tagalog: 'tl',
  tamil: 'ta',
  thai: 'th',
  turkish: 'tr',
  ukrainian: 'uk',
  urdu: 'ur',
  vietnamese: 'vi',
  welsh: 'cy',
}

const infomaniakTranscriptionResponseSchema = z.object({
  batch_id: z.uuid(),
})

const infomaniakBatchResponseSchema = z.object({
  status: z.enum(['pending', 'success', 'error']),
  url: z.url().nullable(),
  file_name: z.string().nullable(),
  file_size: z.number().nullable(),
  data: z.json().nullable(),
})

const infomaniakTranscriptionDataSchema = z.object({
  duration: z.number().nullish(),
  language: z.string().nullish(),
  segments: z.array(z.object({
    avg_logprob: z.number(),
    compression_ratio: z.number(),
    end: z.number(),
    id: z.number(),
    no_speech_prob: z.number().min(0).max(1),
    seek: z.number(),
    start: z.number(),
    temperature: z.number().min(0).max(1),
    text: z.string(),
    tokens: z.array(z.number()),
  })).nullish(),
  task: z.string().nullish(),
  text: z.string(),
  words: z.array(z.object({
    end: z.number(),
    start: z.number(),
    word: z.string(),
  })).nullish(),
})

export class InfomaniakTranscriptionModel implements TranscriptionModelV2 {
  readonly specificationVersion = 'v2'

  get provider(): string {
    return this.config.provider
  }

  constructor(
    readonly modelId: InfomaniakSTTModelId,
    private readonly config: InfomaniakTranscriptionModelConfig,
  ) { }

  private async getArgs({
    audio,
    mediaType,
    providerOptions,
  }: InfomaniakTranscriptionCallOptions) {
    const warnings: TranscriptionModelV2CallWarning[] = []

    // Parse provider options
    const infomaniakOptions = await parseProviderOptions({
      provider: 'infomaniak',
      providerOptions,
      schema: infomaniakTranscriptionProviderOptions,
    })

    // Create form data with base fields
    const formData = new FormData()
    const blob
            = audio instanceof Uint8Array
              ? new Blob([audio as Uint8Array<ArrayBuffer>])
              : new Blob([convertBase64ToUint8Array(audio)])

    formData.append('model', this.modelId)
    formData.append('file', new File([blob], 'audio', { type: mediaType }))

    // Add provider-specific options
    if (infomaniakOptions) {
      const transcriptionModelOptions = {
        append_punctuations: infomaniakOptions.appendPunctuations,
        chunk_length: infomaniakOptions.chunkLength,
        highlight_words: infomaniakOptions.highlightWords,
        language: infomaniakOptions.language,
        max_line_count: infomaniakOptions.maxLineCount,
        max_line_width: infomaniakOptions.maxLineWidth,
        max_words_per_line: infomaniakOptions.maxWordsPerLine,
        no_speech_threshold: infomaniakOptions.noSpeechThreshold,
        prepend_punctuations: infomaniakOptions.prependPunctuations,
        prompt: infomaniakOptions.prompt,
        response_format: 'verbose_json', // always use verbose_json to get correct data shape
        timestamp_granularities: infomaniakOptions.timestampGranularities || ['segment'],
      }

      for (const [key, value] of Object.entries(transcriptionModelOptions)) {
        if (value != null) {
          if (Array.isArray(value)) {
            value.forEach(item => formData.append(`${key}[]`, String(item)))
          }
          else {
            formData.append(key, String(value))
          }
        }
      }
    }

    return {
      formData,
      warnings,
    }
  }

  private async pollForResults(
    batchId: string,
    options: InfomaniakTranscriptionCallOptions,
    maxRetries: number = 60,
    delayMs: number = 2000,
  ) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const url = this.config.url({
        path: `/results/${batchId}`,
      })
      const { value: response, responseHeaders } = await getFromApi({
        url: url.replace('/openai', ''), // remove the /openai part, maybe remove it from the base anyway
        headers: combineHeaders(this.config.headers(), options.headers),
        failedResponseHandler: infomaniakFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          infomaniakBatchResponseSchema,
        ),
        abortSignal: options.abortSignal,
        fetch: this.config.fetch,
      })

      // Check if transcription is complete
      if (response.status === 'success' && response.data) {
        // Parse the JSON data
        const parsedData = infomaniakTranscriptionDataSchema.parse(
          JSON.parse(response.data as string),
        )

        return {
          result: parsedData,
          responseHeaders,
          rawResponse: JSON.stringify(response),
        }
      }

      // Wait before next attempt (unless it's the last attempt)
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }

    throw new Error(`Transcription timed out after ${maxRetries} attempts`)
  }

  async doGenerate(
    options: InfomaniakTranscriptionCallOptions,
  ): Promise<Awaited<ReturnType<TranscriptionModelV2['doGenerate']>>> {
    const currentDate = this.config._internal?.currentDate?.() ?? new Date()
    const { formData, warnings } = await this.getArgs(options)

    const { value: batchResponse } = await postFormDataToApi({
      url: this.config.url({
        path: '/audio/transcriptions',
      }),
      headers: combineHeaders(this.config.headers(), options.headers),
      formData,
      failedResponseHandler: infomaniakFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        infomaniakTranscriptionResponseSchema,
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch,
    })

    const { result, responseHeaders, rawResponse } = await this.pollForResults(
      batchResponse.batch_id,
      options,
    )

    const language
      = result.language != null && result.language in languageMap
        ? languageMap[result.language as keyof typeof languageMap]
        : undefined

    return {
      text: result.text,
      segments:
        result.segments?.map(segment => ({
          text: segment.text,
          startSecond: segment.start,
          endSecond: segment.end,
        }))
        ?? result.words?.map(word => ({
          text: word.word,
          startSecond: word.start,
          endSecond: word.end,
        }))
        ?? [],
      language,
      durationInSeconds: result.duration ?? undefined,
      warnings,
      response: {
        timestamp: currentDate,
        modelId: this.modelId,
        headers: responseHeaders,
        body: rawResponse,
      },
      providerMetadata: {
        infomaniak: {
          batchId: batchResponse.batch_id,
        },
      },
    }
  }
}
