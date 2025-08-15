import { serve } from '@hono/node-server'
import { streamText } from 'ai'
import { config } from 'dotenv'
import { Hono } from 'hono'
import { infomaniak } from 'infomaniak-ai-provider'

config()

async function main() {
  // eslint-disable-next-line no-console
  console.log('=== Hono Streaming Example ===')

  const app = new Hono()

  // Basic UI Message Stream endpoint
  app.post('/chat', async () => {
    const result = streamText({
      model: infomaniak('mistral24b'),
      prompt: 'Invent a new holiday and describe its traditions.',
    })

    return result.toUIMessageStreamResponse()
  })

  // Text stream endpoint
  app.post('/text', async (c) => {
    const result = streamText({
      model: infomaniak('mistral24b'),
      prompt: 'Write a short poem about coding.',
    })

    c.header('Content-Type', 'text/plain; charset=utf-8')

    return new Response(result.textStream, {
      headers: c.res.headers,
    })
  })

  app.get('/health', c => c.text('Hono streaming server is running!'))

  const port = 3001
  // eslint-disable-next-line no-console
  console.log(`Server starting on http://localhost:${port}`)
  // eslint-disable-next-line no-console
  console.log('Test with: curl -X POST http://localhost:3001/chat')

  serve({
    fetch: app.fetch,
    port,
  })
}

main().catch(console.error)
