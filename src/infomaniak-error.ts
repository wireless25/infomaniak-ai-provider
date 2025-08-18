import { createJsonErrorResponseHandler } from '@ai-sdk/provider-utils'
import { z } from 'zod/v4'

export const infomaniakErrorDataSchema = z.object({
  result: z.string(),
  error: z.object({
    code: z.string(),
    description: z.string(),
    errors: z.array(z.any()),
  }).optional(),
})

export type InfomaniakErrorData = z.infer<typeof infomaniakErrorDataSchema>

export const infomaniakFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: infomaniakErrorDataSchema,
  errorToMessage: data => data.error?.description || data.result,
})
