# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 0.5.x   | ✅ |
| < 0.5   | ❌ |

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Report vulnerabilities privately through GitHub's [private vulnerability reporting](https://github.com/tikankika/teaching-suite/security/advisories/new) (the **Security** tab → **Report a vulnerability**).

Please include:

- a description of the issue and its impact,
- steps to reproduce (a minimal example if possible),
- any suggested mitigation.

You can expect an acknowledgement within a week, and responsible disclosure is appreciated — please allow time for a fix before any public disclosure.

## Security considerations

Teaching Suite is an MCP server that operates on the local filesystem. Key security measures:

- **Workspace lockdown**: The `--workspace` flag restricts all file operations to a single directory tree. Without it, all operations are rejected.
- **Path validation**: All file operations validate paths against the workspace boundary. Path traversal attempts are blocked.
- **No network exposure**: Runs locally via stdio, not as a network service
- **Input validation**: All inputs validated with Zod schemas

### Educational data privacy

Teaching Suite handles educational content that may contain sensitive data:

- **Content scanner**: An advisory warner that flags a fixed list of Swedish sensitivity keywords before saving. It never blocks, and is not anonymisation or reliable PII detection — anonymise sensitive data before importing.
- **Local only**: No data leaves the machine — stdio transport, no HTTP endpoints
- **Workspace boundary**: Files can only be written within the configured workspace

## Dependencies

We use Dependabot to monitor dependencies for known vulnerabilities.

Current dependencies:
- `@modelcontextprotocol/sdk` - MCP protocol
- `zod` - Input validation
- `js-yaml` - YAML parsing (safe by default since v4)
