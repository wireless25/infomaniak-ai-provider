# AI SDK - Infomaniak Provider

> the project is under active development, for now only text and embedding models are supported.

The Infomaniak provider for the [AI SDK](https://ai-sdk.dev/docs) contains language model support for the [Infomaniak AI Tools API](https://www.infomaniak.com/en/hosting/ai-tools/open-source-models).

## Setup

The Infomaniak provider is available in the `infomaniak-ai-provider` module. You can install it with

```bash
npm i infomaniak-ai-provider
```

## Provider Instance

You can import the default provider instance `infomaniak` from `infomaniak-ai-provider`:

```ts
import { infomaniak } from 'infomaniak-ai-provider'
```

## Example

```ts
import { generateText } from 'ai'
import { infomaniak } from 'infomaniak-ai-provider'

const { text } = await generateText({
  model: infomaniak('qwen3'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
})
```
For this to work you need the `INFOMANIAK_API_KEY` and `INFOMANIAK_PRODUCT_ID` environment variables set with your Infomaniak API key.

Alternatively create a instance of the provider:

```ts
import { generateText } from 'ai'
import { createInfomaniak } from 'infomaniak-ai-provider'

const infomaniak = createInfomaniak({
  apiKey: '<API_KEY>', // Infomaniak API token
  productId: '<PRODUCT_ID>', // Infomaniak product ID, https://developer.infomaniak.com/docs/api/get/1/ai
})

const { text } = await generateText({
  model: infomaniak('qwen3'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
})
```

## Documentation

Please check out the **[ai-sdk documentation](https://ai-sdk.dev/docs/ai-sdk-core/overview)** for more information.
