import type { InfomaniakProvider } from 'infomaniak-ai-provider'
import { serve } from '@hono/node-server'
import { embed, experimental_generateImage, experimental_transcribe, JsonToSseTransformStream, streamText } from 'ai'
import { config } from 'dotenv'
import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { stream } from 'hono/streaming'
import { createInfomaniak } from 'infomaniak-ai-provider'

config()

// eslint-disable-next-line ts/consistent-type-definitions
type Env = {
  INFOMANIAK_API_KEY: string
  INFOMANIAK_PRODUCT_ID: string
}

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
  const { INFOMANIAK_API_KEY, INFOMANIAK_PRODUCT_ID } = env<Env>(c)
  const infomaniak = createInfomaniakProvider({
    apiKey: INFOMANIAK_API_KEY,
    productId: INFOMANIAK_PRODUCT_ID,
  })
  const result = streamText({
    model: infomaniak('mistral24b'),
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  c.header('Content-Type', 'text/plain; charset=utf-8')

  return stream(c, stream => stream.pipe(result.toUIMessageStream()))
})

app.post('/stream-data', async (c) => {
  const { INFOMANIAK_API_KEY, INFOMANIAK_PRODUCT_ID } = env<Env>(c)
  const infomaniak = createInfomaniakProvider({
    apiKey: INFOMANIAK_API_KEY,
    productId: INFOMANIAK_PRODUCT_ID,
  })
  // immediately start streaming the response
  const result = streamText({
    model: infomaniak('mistral24b'),
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  const dataStream = result.toUIMessageStream({
    onError: (error) => {
      // Error messages are masked by default for security reasons.
      // If you want to expose the error message to the client, you can do so here:
      return error instanceof Error ? error.message : String(error)
    },
  })

  c.header('content-type', 'text/event-stream')
  c.header('cache-control', 'no-cache')
  c.header('connection', 'keep-alive')
  c.header('x-accel-buffering', 'no') // disable nginx buffering

  return stream(c, stream =>
    stream.pipe(
      dataStream
        .pipeThrough(new JsonToSseTransformStream())
        .pipeThrough(new TextEncoderStream()),
    ))
})

app.post('/embed', async (c) => {
  const { INFOMANIAK_API_KEY, INFOMANIAK_PRODUCT_ID } = env<Env>(c)
  const infomaniak = createInfomaniakProvider({
    apiKey: INFOMANIAK_API_KEY,
    productId: INFOMANIAK_PRODUCT_ID,
  })
  const result = await embed({
    model: infomaniak.textEmbeddingModel('bge_multilingual_gemma2'),
    value: 'Invent a new holiday and describe its traditions.',
  })

  c.header('Content-Type', 'text/plain; charset=utf-8')

  return new Response(JSON.stringify(result.embedding), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

app.post('/image', async (c) => {
  const { INFOMANIAK_API_KEY, INFOMANIAK_PRODUCT_ID } = env<Env>(c)
  const infomaniak = createInfomaniakProvider({
    apiKey: INFOMANIAK_API_KEY,
    productId: INFOMANIAK_PRODUCT_ID,
  })
  const result = await experimental_generateImage({
    model: infomaniak.imageModel('flux'),
    prompt: 'A VW camping bus parked in a scenic location, surrounded by mountains and trees. Comic style illustration.',
  })

  c.header('Content-Type', 'text/plain; charset=utf-8')

  return new Response(JSON.stringify(result.image.base64))
})

app.post('/stt', async (c) => {
  const { INFOMANIAK_API_KEY, INFOMANIAK_PRODUCT_ID } = env<Env>(c)
  const infomaniak = createInfomaniakProvider({
    apiKey: INFOMANIAK_API_KEY,
    productId: INFOMANIAK_PRODUCT_ID,
  })
  const result = await experimental_transcribe({
    model: infomaniak.transcription('whisper'),
    audio: await c.req.arrayBuffer(),
    providerOptions: {
      infomaniak: {
        timestampGranularities: ['segment', 'word'],
      },
    },
  })

  c.header('Content-Type', 'application/json')

  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

serve({ fetch: app.fetch, port: 8080 })
