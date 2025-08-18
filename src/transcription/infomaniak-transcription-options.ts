import { z } from 'zod/v4'

// https://developer.infomaniak.com/docs/api/post/1/ai/%7Bproduct_id%7D/openai/audio/transcriptions
export const infomaniakTranscriptionProviderOptions = z.object({
  /**
   * Only if timestamp_granularities[]:word is True, merge these punctuation symbols with the previous word
   */
  appendPunctuations: z.array(z.string()).optional(),

  /**
   * Defines the maximum duration for an active segment in sec. For subtitle tasks, it's recommended to set this to a short duration (5-10 seconds) to avoid long sentences.
   */
  chunkLength: z.number().min(2).max(30).optional(),

  /**
   * Subtitle task. Underline each word as it is spoken in srt and vtt output formats (requires timestamp_granularities[]:word)
   */
  highlightWords: z.boolean().optional(),

  /**
   * The language of the input audio in ISO-639-1 format.
   */
  language: z.string().optional(),

  /**
   * Subtitle task. The maximum number of lines in a segment in srt and vtt output formats (requires timestamp_granularities[]:word)
   */
  maxLineCount: z.number().min(1).max(1000).optional(),

  /**
   * Subtitle task. The maximum number of characters in a line before breaking the line in srt and vtt output formats (requires timestamp_granularities[]:word)
   */
  maxLineWidth: z.number().min(1).max(1000).optional(),

  /**
   * Subtitle task. The maximum number of words in a segment (requires timestamp_granularities[]:word)
   */
  maxWordsPerLine: z.number().min(1).max(1000).optional(),

  /**
   * If the no_speech probability is higher than this value AND the average log probability over sampled tokens is below log_prob_threshold, consider the segment as silent.
   */
  noSpeechThreshold: z.number().optional(),

  /**
   * Only if timestamp_granularities[]:word is True, merge these punctuation symbols with the next word
   */
  prependPunctuations: z.array(z.string()).optional(),
  /**
   * An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language.
   */
  prompt: z.string().optional(),

  /**
   * The format of the transcript output
   * @default 'json'
   */
  responseFormat: z
    .enum(['text', 'json', 'srt', 'verbose_json', 'vtt'])
    .default('json')
    .optional(),

  /**
   * The timestamp granularities to populate for this transcription.
   * @default ['segment']
   */
  timestampGranularities: z
    .array(z.enum(['word', 'segment']))
    .default(['segment'])
    .optional(),
})

export type InfomaniakTranscriptionProviderOptions = z.infer<
    typeof infomaniakTranscriptionProviderOptions
>
