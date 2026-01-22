# API Specifications

This folder contains the versioned API specifications used to generate TypeScript types for the SDK.

## Structure

```
specs/
├── api/                    # OpenAPI specs for REST API
│   └── partner-openapi.json
asyncapi/                   # AsyncAPI specs for webhooks
│   └── webhooks.yaml
└── README.md
```

## Current Versions

| Spec | File | Version | Source |
|------|------|---------|--------|
| Partner API | `api/partner-openapi.json` | 1.3.0 | [docs.contio.ai](https://docs.contio.ai/partner-api/openapi/partner-openapi.json) |
| Webhooks | `asyncapi/webhooks.yaml` | 1.3.0 | [docs.contio.ai](https://docs.contio.ai/partner-api/asyncapi/webhooks.yaml) |

## Updating Specifications

### Option 1: Automatic Update (from published spec)

When the upstream spec is published and you want to pull the latest:

```bash
# Fetches latest spec and regenerates types
npm run update-spec:api
```

### Option 2: Manual Update (pre-release spec)

For pre-release specs not yet published:

1. Copy the new spec file to `specs/api/partner-openapi.json`
2. Update the version in this README
3. Regenerate types:
   ```bash
   npm run gen-types
   ```
4. Review the changes in `src/generated/api-types.ts`
5. Run tests to ensure compatibility:
   ```bash
   npm test
   ```

## Type Generation

Types are generated using [swagger-typescript-api](https://github.com/acacode/swagger-typescript-api):

```bash
npm run gen-types
```

This reads `specs/api/partner-openapi.json` and outputs to `src/generated/api-types.ts`.

### Generation Options

The current configuration:
- `--no-client` - Only generate types, not API client
- `--extract-request-params` - Extract request parameters
- `--extract-request-body` - Extract request body types
- `--extract-response-body` - Extract response body types
- `--extract-response-error` - Extract error response types
- `--generate-union-enums` - Use union types for enums
- `--sort-types` - Sort types alphabetically

## Version History

| SDK Version | API Spec Version | Date | Notes |
|-------------|------------------|------|-------|
| 1.3.0 | 1.3.0 | 2026-01-21 | First release from public repo |
| 1.2.1 | 1.2.1 | 2026-01-17 | Last release from monorepo |

## Webhooks (Future)

AsyncAPI specifications for webhook events will be added to `specs/webhooks/` when available.

The pattern will follow the same approach:
- Store versioned specs in `specs/webhooks/`
- Add `npm run gen-webhook-types` script
- Add `npm run update-spec:webhooks` for updates

