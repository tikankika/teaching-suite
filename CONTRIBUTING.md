# Contributing to Teaching Suite

Thank you for your interest in contributing to Teaching Suite!

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/teaching-suite.git
   cd teaching-suite
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run tests to verify setup:
   ```bash
   npm test
   ```

## Development Workflow

### Building

```bash
npm run build
```

### Testing

```bash
npm test           # Run all tests
npm run dev        # Watch mode (TypeScript)
```

### Running the MCP Server

```bash
npm start -- --workspace /path/to/courses
```

## Project Structure

- `src/tools/core/` - Core file operation tools (4 tools)
- `src/tools/composite/` - Domain-specific composite tools (6 tools)
- `src/tools/mechanical/` - Mechanical tools: methodology loading, context search, parsing (7 tools)
- `src/tools/setup/` - Project initialisation (2 tools)
- `src/tools/sources/` - Source tracking tools (5 tools)
- `src/utils/` - Shared utilities (content scanner, schema conversion)
- `methodology/` - Pedagogical guides (for Claude Desktop)
- `tests/` - Test files
- `docs/` - Documentation, RFCs, ADRs

## Language Policy

- **Code** (comments, variables, docs): English
- **UX strings** (priority enums, templates, GDPR patterns): Swedish
- **Methodology documents**: Swedish

This lets international contributors read the code while keeping the teacher-facing experience in Swedish.

## Contribution Guidelines

### Code Style

- TypeScript with strict mode
- Use Zod for input validation
- Follow existing patterns in the codebase

### Commits

We follow conventional commits:

```
feat: Add new feature
fix: Fix a bug
docs: Documentation changes
test: Add or update tests
refactor: Code refactoring
```

### Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass
4. Submit a PR with a clear description

## Architecture Decisions

Major changes should be discussed first. Check `docs/decisions/` for existing architecture decisions.

## Questions?

Open an issue for questions or discussions.

## License

By contributing, you agree that your contributions will be licensed under the PolyForm Noncommercial 1.0.0 licence.
