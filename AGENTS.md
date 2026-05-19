# AGENTS.md

## Build & verification

CI order matters — `typecheck` and `test` both require built output:

```
pnpm lint
pnpm build          # cleans dist/ then runs tsup
pnpm typecheck
pnpm test           # vitest --run
```

Single test file: `pnpm vitest --run src/infomaniak-provider.test.ts`

Watch mode: `pnpm test:watch`

## Generated files — do not edit

`src/infomaniak-models.ts` and `src/infomaniak-models-data.json` are **auto-generated** by `scripts/generate-types.ts`, which fetches live model data from the Infomaniak API. Regenerate with:

```
pnpm generate-types
```

Requires `INFOMANIAK_TOKEN` env var (see `.env.template`). Without it, the script fails.

## Package structure

- Two separate tsup bundles → two export paths:
  - `"."` — main provider (`src/index.ts`) → `dist/`
  - `"./client"` — React hook (`src/client/index.ts`) → `dist/client/`
- `client.d.ts` at repo root re-exports from `./dist/client` for TypeScript module resolution

## Workspace

Root **is** the publishable package (`infomaniak-ai-provider`). `playground/` is a private workspace that depends on it via `workspace:*`. Run `pnpm install` from root to link both.

## Code style

Uses `@antfu/eslint-config` defaults: no semicolons, single quotes, no parens on single-param arrow functions. Fix with `pnpm lint:fix`.

## Version compatibility

| Provider version | AI SDK | Infomaniak API |
|---|---|---|
| `0.2.x` | `ai@^5` | `v2` |
| `0.3.x` | `ai@^6` | `v2` |

Peer dep: `zod ^3.25.76 || ^4`

## Release

Triggered by pushing `v*` tags. Uses `sxzz/workflows` reusable release workflow.
