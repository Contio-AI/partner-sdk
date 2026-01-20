# Contributing to Contio Partner SDK

Thank you for your interest in contributing to the Contio Partner SDK! This document provides guidelines for contributions.

## Reporting Issues

If you encounter a bug or have a feature request:

1. **Search existing issues** first to avoid duplicates
2. **Create a new issue** at [GitHub Issues](https://github.com/Contio-AI/partner-sdk/issues)
3. **Include details**:
   - SDK version (`npm list @contio/partner-sdk`)
   - Node.js version (`node --version`)
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages and stack traces

## Development Setup

### Prerequisites

- Node.js 22.0.0 or higher
- npm 10.0.0 or higher

### Getting Started

```bash
# Clone the repository
git clone https://github.com/Contio-AI/partner-sdk.git
cd partner-sdk

# Install dependencies
npm install

# Run tests
npm test

# Build the SDK
npm run build

# Generate API types (requires OpenAPI spec)
npm run gen-types
```

### Project Structure

```
src/
├── auth/           # OAuth and API key authentication
├── client/         # API client implementations
├── generated/      # Auto-generated types from OpenAPI
├── models/         # TypeScript interfaces and types
├── webhooks/       # Webhook verification and handling
├── sso.ts          # SSO helper utilities
└── index.ts        # Main entry point and exports
```

## Pull Request Process

### Branch Workflow

The `main` branch is protected and requires pull requests for all changes. Follow this workflow:

1. **Create a feature branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit regularly:
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

3. **Keep your branch up to date** with main:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

4. **Push your branch** to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub:
   - Go to https://github.com/Contio-AI/partner-sdk/pulls
   - Click "New pull request"
   - Select your feature branch
   - Fill out the PR template with details

### PR Requirements

Before your PR can be merged, it must:

- ✅ **Pass all CI checks** (linting, tests, build)
- ✅ **Receive at least 1 approval** from a team member
- ✅ **Have all conversations resolved**
- ✅ **Be up to date** with the main branch

### What to Include

1. **Write tests** for any new functionality
2. **Ensure all tests pass**: `npm test`
3. **Run linting**: `npm run lint`
4. **Verify build works**: `npm run build`
5. **Follow existing code style** (ESLint will help)
6. **Update documentation** if needed (README, JSDoc comments)
7. **Update CHANGELOG.md** for notable changes
8. **Submit a pull request** with a clear description

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new calendar endpoint support
fix: correct token refresh error handling
docs: update README with examples
test: add webhook verification tests
refactor: simplify OAuth token parsing
```

### Code Style

- Use TypeScript for all source files
- Add JSDoc comments to public methods
- Keep functions focused and small
- Use meaningful variable names

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- oauth.test.ts
```

## Documentation

- Update JSDoc comments for any public API changes
- Update README.md for user-facing changes
- Update CHANGELOG.md for notable changes

## Security

If you discover a security vulnerability, please email [security@contio.ai](mailto:security@contio.ai) instead of opening a public issue.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

For questions about the SDK or API, contact [partner-support@contio.ai](mailto:partner-support@contio.ai).
