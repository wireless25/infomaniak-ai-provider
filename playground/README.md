# [Hono + AI SDK Example](https://github.com/vercel/ai/tree/883056de2c1db58dbde38baca00cafaec109ebe9/examples/hono)

You can use the AI SDK in an [Hono](https://hono.dev/) server to generate and stream text and objects.

## Usage

1. Copy the `.env.template` file and fill the variables:

```sh
cp .env.template .env
```

2. From the **project root**, install dependencies:

```sh
pnpm install
```

3. Start a server:

```sh
# Hono server (port 8080)
pnpm --filter playground dev

# Streaming server (port 3001)
pnpm --filter playground dev:streaming
```

4. Test the endpoints:

```sh
# Hono server
curl -i -X POST http://localhost:8080/

# Streaming server
curl -i -X POST http://localhost:3001/chat
```
