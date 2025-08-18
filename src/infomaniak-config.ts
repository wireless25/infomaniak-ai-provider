import type { FetchFunction } from '@ai-sdk/provider-utils'

export interface InfomaniakCommonModelConfig {
  provider: string
  url: ({ path }: { path: string }) => string
  headers: () => Record<string, string>
  fetch?: FetchFunction
}
