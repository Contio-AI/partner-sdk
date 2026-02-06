# Partner SDK Repository Setup

This document describes the setup and configuration for the `@contio/partner-sdk` public repository.

> **Note**: This document contains both partner-facing information (development workflow, release branches) and internal maintainer notes (release process, CI/CD configuration). Sections marked "for SDK Maintainers" or "Internal Notes" are intended for the Contio team.

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

## Release Branch Workflow

### When to Use Release Branches

Use a **release branch** when developing a new SDK version that needs to be tested with your application **before** the version is published to npm. This allows you to validate SDK changes in your environment before the official release.

Use a **feature branch** for regular development work that doesn't require pre-release coordination.

### Branch Naming Convention

**Pattern**: `sdk-release/{version}` (without `v` prefix)

**Examples**:
- `sdk-release/1.4.0`
- `sdk-release/1.5.0`
- `sdk-release/2.0.0`

### Purpose

Release branches allow partners and developers to access and test upcoming SDK versions before they're published to npm:

- **Early Access**: Test new features and changes before official release
- **Integration Testing**: Validate the SDK works with your application
- **Feedback Loop**: Report issues or provide feedback during the pre-release phase
- **Build from Source**: Clone the SDK repo and build from the release branch locally

This enables coordinated development and testing, ensuring new SDK versions work seamlessly with your integration before they're published.

### Using a Pre-Release Version

If you need to test an unreleased SDK version, you can build from a release branch:

1. **Clone the SDK repository**:
   ```bash
   git clone https://github.com/Contio-AI/partner-sdk.git
   cd partner-sdk
   ```

2. **Check out the release branch**:
   ```bash
   git checkout sdk-release/1.4.0
   ```

3. **Install dependencies and build**:
   ```bash
   npm install
   npm run build
   ```

4. **Link locally in your project**:
   ```bash
   # In the SDK directory
   npm link

   # In your project directory
   npm link @contio/partner-sdk
   ```

5. **Or install directly from the branch**:
   ```bash
   npm install Contio-AI/partner-sdk#sdk-release/1.4.0
   ```

### Release Branch Lifecycle (for SDK Maintainers)

1. **Create the release branch** when starting work on a new version:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b sdk-release/1.4.0
   git push origin -u sdk-release/1.4.0
   ```

2. **Develop and test** on the release branch:
   - Make SDK changes
   - Update version in `package.json` to match the branch (e.g., `1.4.0`)
   - Update specs if needed (`specs/api/partner-openapi.json`, `specs/asyncapi/webhooks.yaml`)
   - Run `npm run gen-all-types` if specs changed
   - Commit and push changes

3. **Coordinate with partners and sample applications**:
   - Partners can test the release branch using the instructions above
   - Gather feedback and make adjustments as needed
   - Verify all tests pass

4. **Merge to main** when ready for release:
   ```bash
   git checkout main
   git pull origin main
   git merge sdk-release/1.4.0
   git push origin main
   ```

5. **Publish to npm** (see Release Process below)

6. **Delete the release branch** after successful npm publish:
   ```bash
   git push origin --delete sdk-release/1.4.0
   git branch -d sdk-release/1.4.0
   ```

### Renaming a Branch to Follow Convention

If you have an existing branch that needs to be renamed:

```bash
# If you have the branch checked out locally:
git branch -m old-branch-name sdk-release/1.4.0
git push origin -u sdk-release/1.4.0
git push origin --delete old-branch-name

# Or if working from a different branch:
git push origin origin/old-branch-name:refs/heads/sdk-release/1.4.0
git push origin --delete old-branch-name
```

## Release Process (Internal Notes for SDK Maintainers)

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

## CI/CD Workflows (Internal Notes for SDK Maintainers)

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

## Integration with Documentation (Internal Notes for SDK Maintainers)

The TypeDoc archive generated during releases is automatically integrated with the documentation site:

- The `typedoc.tar.gz` artifact is attached to each GitHub release
- The documentation build process fetches this artifact
- API reference is published at https://docs.contio.ai/partner-api/reference/

**Note**: Ensure TypeDoc generation completes successfully during releases to keep API documentation up to date.

## Troubleshooting (Internal Notes for SDK Maintainers)

### Release workflow fails at npm publish

- Verify npm authentication is configured correctly in GitHub Actions
- Check that the publishing token has not expired
- Ensure the token has appropriate permissions for publishing

### TypeDoc generation fails

- Check `typedoc` is in devDependencies
- Verify `src/index.ts` exports all public APIs
- Review TypeDoc configuration in the release workflow

### Tests fail in CI but pass locally

- Check Node.js version matches (22.x)
- Ensure all dependencies are in `package.json`
- Review environment differences (environment variables, file paths, etc.)

### Build artifacts missing

- Verify both CommonJS and ESM builds complete successfully
- Check that `dist/` directory contains all expected files
- Ensure TypeScript compilation has no errors

