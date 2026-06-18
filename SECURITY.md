# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.5.x   | :white_check_mark: |
| < 0.5   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in Teaching Suite, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email the maintainer or use GitHub's private vulnerability reporting feature
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact

We will respond within 7 days and work with you to understand and address the issue.

## Security Considerations

Teaching Suite is an MCP server that operates on the local filesystem. Key security measures:

- **Workspace lockdown**: The `--workspace` flag restricts all file operations to a single directory tree. Without it, all operations are rejected.
- **Path validation**: All file operations validate paths against the workspace boundary. Path traversal attempts are blocked.
- **No network exposure**: Runs locally via stdio, not as a network service
- **Input validation**: All inputs validated with Zod schemas

### Educational Data Privacy

Teaching Suite handles educational content that may contain sensitive data:

- **Content scanner**: An advisory warner that flags a fixed list of Swedish sensitivity keywords before saving. It never blocks, and is not anonymisation or reliable PII detection — anonymise sensitive data before importing.
- **Local only**: No data leaves the machine — stdio transport, no HTTP endpoints
- **Workspace boundary**: Files can only be written within the configured workspace

## Dependencies

We use Dependabot to monitor dependencies for known vulnerabilities.

Current dependencies:
- `@modelcontextprotocol/sdk` - MCP protocol
- `zod` - Input validation
- `js-yaml` - YAML parsing (v4.x with safe defaults)
