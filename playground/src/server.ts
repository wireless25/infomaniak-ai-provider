import type { InfomaniakProvider } from 'infomaniak-ai-provider'
import { serve } from '@hono/node-server'
import { createDataStream, embed, streamText } from 'ai'
import { config } from 'dotenv'
import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { stream } from 'hono/streaming'
import { createInfomaniak } from 'infomaniak-ai-provider'

config()

const app = new Hono()
let infomaniak: InfomaniakProvider

function createInfomaniakProvider({ apiKey, productId }: { apiKey: string, productId: string }) {
  if (!infomaniak) {
    infomaniak = createInfomaniak({
      apiKey,
      productId,
    })
  }
  return infomaniak
}

app.post('/', async (c) => {
  const { INFOMANIAK_API_KEY, INFOMANIAK_PRODUCT_ID } = env<{ INFOMANIAK_API_KEY: string, INFOMANIAK_PRODUCT_ID: string }>(c)
  const infomaniak = createInfomaniakProvider({
    apiKey: INFOMANIAK_API_KEY,
    productId: INFOMANIAK_PRODUCT_ID,
  })
  const result = streamText({
    model: infomaniak('mistral24b'),
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  // Mark the response as a v1 data stream:
  c.header('X-Vercel-AI-Data-Stream', 'v1')
  c.header('Content-Type', 'text/plain; charset=utf-8')

  return stream(c, stream => stream.pipe(result.toDataStream()))
})

app.post('/embed', async (c) => {
  const { INFOMANIAK_API_KEY, INFOMANIAK_PRODUCT_ID } = env<{ INFOMANIAK_API_KEY: string, INFOMANIAK_PRODUCT_ID: string }>(c)
  const infomaniak = createInfomaniakProvider({
    apiKey: INFOMANIAK_API_KEY,
    productId: INFOMANIAK_PRODUCT_ID,
  })
  const result = await embed({
    model: infomaniak.textEmbeddingModel('bge_multilingual_gemma2'),
    value: 'Invent a new holiday and describe its traditions.',
  })

  // Mark the response as a v1 data stream:
  c.header('X-Vercel-AI-Data-Stream', 'v1')
  c.header('Content-Type', 'text/plain; charset=utf-8')

  return new Response(JSON.stringify(result.embedding), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

app.post('/stream-data', async (c) => {
  const { INFOMANIAK_API_KEY, INFOMANIAK_PRODUCT_ID } = env<{ INFOMANIAK_API_KEY: string, INFOMANIAK_PRODUCT_ID: string }>(c)
  const infomaniak = createInfomaniakProvider({
    apiKey: INFOMANIAK_API_KEY,
    productId: INFOMANIAK_PRODUCT_ID,
  })
  // immediately start streaming the response
  const dataStream = createDataStream({
    execute: async (dataStreamWriter) => {
      dataStreamWriter.writeData('initialized call')

      const result = streamText({
        model: infomaniak('mistral24b'),
        prompt: 'Invent a new holiday and describe its traditions.',
      })

      result.mergeIntoDataStream(dataStreamWriter)
    },
    onError: (error) => {
      // Error messages are masked by default for security reasons.
      // If you want to expose the error message to the client, you can do so here:
      return error instanceof Error ? error.message : String(error)
    },
  })

  // Mark the response as a v1 data stream:
  c.header('X-Vercel-AI-Data-Stream', 'v1')
  c.header('Content-Type', 'text/plain; charset=utf-8')

  return stream(c, stream =>
    stream.pipe(dataStream.pipeThrough(new TextEncoderStream())))
})

serve({ fetch: app.fetch, port: 8080 })
