# Contributing to EncStream

Thank you for your interest in contributing to EncStream! This document provides guidelines and instructions for contributing to the project.

## Development Process

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your fork
5. Submit a Pull Request

## Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/encstream.git

# Install dependencies
npm install

# Run tests
npm test

# Build package
npm run build
```

## Code Style

We use ESLint and Prettier to maintain code quality. Before submitting a PR:

```bash
# Run linter
npm run lint

# Format code
npm run format
```

## Testing

All new features should include tests:

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Check coverage
npm test -- --coverage
```

## Commit Messages

We follow the Conventional Commits specification:

- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks

## Pull Request Process

1. Update documentation
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Submit PR with clear description

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release tag
4. Build and publish to npm

## Questions?

Open an issue in the GitHub repository.
