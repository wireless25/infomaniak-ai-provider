# [Hono + AI SDK Example](https://github.com/vercel/ai/tree/883056de2c1db58dbde38baca00cafaec109ebe9/examples/hono)

You can use the AI SDK in an [Hono](https://hono.dev/) server to generate and stream text and objects.

## Usage

1. Copy the .env.template file and fill the variables:

```sh
cp .env.template .env
```

2. Run the following commands from the root directory:

```sh
pnpm install
```

3. Run the following command:

```sh
# server
pnpm dev

# streaming
pnpm dev:streaming
```

4. Test the endpoint with Curl:

```sh
curl -i -X POST http://localhost:8080/
curl -i -X POST http://localhost:3001/chat
```
