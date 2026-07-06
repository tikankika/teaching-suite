# Contributing to Teaching Suite

Thank you for your interest in contributing to Teaching Suite!

## Critical rules — data protection

Teaching Suite works with your teaching — plans, ideas, reflections — not student
data, and it should stay that way. This is a public repository — never let real
personal data into the repo, in code, tests, comments, documentation, examples or
commit messages. Git history is permanent.

- **Never commit real personal data:** names (students, colleagues, teachers),
  school or institution names, identifying places, personal-identity numbers, file
  paths containing a username (`/Users/...`), secrets (API keys, tokens, `.env`),
  and any student work or reflections (these belong in your local workspace, never
  the repo).
- **Use fabricated or anonymised data in every example and test** — for example
  `School A`, `Colleague_A`, `/path/to/project`, a fake ID.
- **Watch quasi-identifiers:** a class plus a date plus a subject can identify a
  student even with no name attached.
- **Already committed something real?** Deleting the file is not enough — it stays
  in the git history forever. Stop, scrub the history, rotate any exposed secret,
  and escalate before the next push.

## Getting started

> **Prerequisites:** Node.js 20+ for development — the test toolchain (Vitest 4)
> requires Node 20 or later. The runtime itself supports Node 18+.

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

## Development workflow

### Building

```bash
npm run build
```

### Testing

```bash
npm test           # Run all tests
npm run dev        # Watch mode (TypeScript)
```

### Running the MCP server

```bash
npm start -- --workspace /path/to/courses
```

## Project structure

- `src/tools/core/` - Core file operation tools (4 tools)
- `src/tools/composite/` - Domain-specific composite tools (6 tools)
- `src/tools/mechanical/` - Mechanical tools: methodology loading, context search, parsing (7 tools)
- `src/tools/setup/` - Project initialisation (2 tools)
- `src/tools/sources/` - Source tracking tools (5 tools)
- `src/utils/` - Shared utilities (content scanner, schema conversion)
- `methodology/` - Pedagogical guides (for Claude Desktop)
- `tests/` - Test files
- `docs/` - Documentation, RFCs, ADRs

## Language policy

- **Code** (comments, variables, docs): English
- **UX strings** (priority enums, templates, GDPR patterns): Swedish
- **Methodology documents**: Swedish

This lets international contributors read the code while keeping the teacher-facing experience in Swedish.

## Contribution guidelines

### Code style

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

### Pull requests

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass
4. Submit a PR with a clear description

## Architecture decisions

Major changes should be discussed first. Check `docs/decisions/` for existing architecture decisions.

## Questions?

Open an issue for questions or discussions.

## Licence

By contributing, you agree that your contributions will be licensed under PolyForm Noncommercial 1.0.0 (see [LICENSE](LICENSE)).
