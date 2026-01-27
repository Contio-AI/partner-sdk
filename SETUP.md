# Partner SDK Repository Setup

This document describes the setup and configuration for the `@contio/partner-sdk` public repository.

## Development Workflow

### Local Development

1. Clone the repository:
   ```bash
   git clone git@github.com:Contio-AI/partner-sdk.git
   cd partner-sdk
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Run linting:
   ```bash
   npm run lint
   ```

### Making Changes

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting locally
4. Commit and push your branch
5. Create a pull request
6. Wait for CI checks to pass
7. Get approval and merge

## Release Process

### Automated Release Workflow

The repository uses GitHub Actions for automated releases. The process is triggered by pushing a version tag.

### Steps to Release

1. **Update version in `package.json`**:
   ```bash
   npm version patch  # or minor, or major
   ```
   This updates `package.json` and creates a git commit.

2. **Update `CHANGELOG.md`**:
   - Add a new section for the version
   - Follow the format: `## [X.Y.Z] - YYYY-MM-DD`
   - List changes under: Added, Changed, Fixed, Security, etc.
   - Commit the changelog

3. **Create and push the version tag**:
   ```bash
   git tag v1.3.1  # Match the version in package.json
   git push origin main --tags
   ```

4. **Automated workflow will**:
   - Run linting and tests
   - Build TypeScript (CommonJS and ESM)
   - Generate TypeDoc documentation
   - Publish to npm as `@contio/partner-sdk`
   - Create a GitHub release with:
     - Release notes extracted from CHANGELOG.md
     - TypeDoc archive (`typedoc.tar.gz`) as an asset

### Manual Verification

After the release workflow completes:

1. Check npm: `npm view @contio/partner-sdk`
2. Check GitHub releases: https://github.com/Contio-AI/partner-sdk/releases
3. Verify TypeDoc artifact is attached to the release

## CI/CD Workflows

### CI Workflow (`.github/workflows/ci.yml`)

- **Triggers**: Push to `main`, pull requests to `main`
- **Actions**:
  - Install dependencies
  - Run linting
  - Run tests
  - Build TypeScript
  - Verify build artifacts

### Release Workflow (`.github/workflows/release.yml`)

- **Triggers**: Push of tags matching `v*`
- **Actions**:
  - All CI checks
  - Generate TypeDoc
  - Publish to npm
  - Create GitHub release with changelog and TypeDoc archive

## Package Configuration

### Exports

The package provides multiple entry points:

- Main: `@contio/partner-sdk`
- Webhooks: `@contio/partner-sdk/webhooks`
- Auth: `@contio/partner-sdk/auth`
- Models: `@contio/partner-sdk/models`

### Build Outputs

- **CommonJS**: `dist/*.js` (for Node.js require)
- **ESM**: `dist/esm/*.js` (for ES modules import)
- **Types**: `dist/*.d.ts` (TypeScript definitions)

## Integration with Documentation

The TypeDoc archive generated during releases is consumed by the documentation site:

- Documentation repo fetches `typedoc.tar.gz` from the latest SDK release
- Extracts it during the docs build process
- Publishes API reference at https://docs.contio.ai/partner-api/reference/

## Troubleshooting

### Release workflow fails at npm publish

- Verify `NPM_TOKEN` secret is set correctly
- Check token has not expired
- Ensure token has "Automation" permissions

### TypeDoc generation fails

- Check `typedoc` is in devDependencies
- Verify `src/index.ts` exports all public APIs
- Review TypeDoc configuration in workflow

### Tests fail in CI but pass locally

- Check Node.js version matches (22.x)
- Ensure all dependencies are in `package.json`
- Review environment differences

