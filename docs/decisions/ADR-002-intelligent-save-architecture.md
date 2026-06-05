# ADR-002: intelligent_save Architecture and Integration

**Status:** Accepted  
**Date:** 2026-01-11  
**Deciders:** Niklas Karlsson + Claude  
**Related:** RFC-005, RFC-006  

## Context

RFC-005 proposes `intelligent_save` as a core capability for saving content with metadata. Three architectural options were considered:

1. Integrate as tool in existing teaching-suite server
2. Deploy as separate standalone MCP server
3. Create as library that other MCP servers import

## Decision

**We will integrate intelligent_save as a tool within the existing teaching-suite server** (Option 1).

## Rationale

### Why Option 1 (Integration):

✅ **Compositional Capability**  
RFC-005 explicitly describes intelligent_save as a "compositional capability", not a standalone service. It's a foundational capability that multiple processes use.

✅ **Simplicity for Users**  
One MCP server with multiple tools is easier to configure and manage than multiple separate servers.

✅ **Direct Dependency**  
RFC-006 refactors teaching-suite to use intelligent_save directly. Having them in the same server eliminates inter-server communication complexity.

✅ **Guided Process Framework**  
According to GPF version 0.1, intelligent_save is "Layer 1: CORE" - a fundamental capability alongside file_manager and metadata_tracker. Core capabilities should be tightly integrated.

✅ **Future Guided Processes**  
RFC-001 through RFC-004 (track_goal, course_design, analyze_assessment, critical_review) will all need intelligent_save. Integration makes this trivial.

### Why NOT Option 2 (Standalone):

❌ **Unnecessary Complexity**  
Requires users to configure multiple MCP servers in Claude Desktop config.

❌ **Inter-Server Communication**  
teaching-suite would need to call another MCP server, adding latency and failure points.

❌ **Against "Compositional Capability" Concept**  
Standalone services are not compositional - they're isolated.

### Why NOT Option 3 (Library):

❌ **Not a Library Use Case**  
This is MCP tool logic, not reusable library code. MCP tools are defined by their server registration, not import statements.

❌ **Duplication**  
Each MCP server would need to register the tool separately anyway.

## Consequences

### Positive:

- Single source of truth for intelligent_save implementation
- Simplified user configuration (one MCP server)
- Easier testing (no inter-server mocking needed)
- Faster development (no server-to-server protocol)

### Negative:

- teaching-suite server becomes slightly larger (acceptable trade-off)
- Cannot use intelligent_save from other non-teaching-suite contexts (not a requirement)

### Neutral:

- Future refactoring to separate server is possible if requirements change

## Implementation Notes

- Add intelligent_save to `src/index.ts` in ListToolsRequestSchema
- Implement alongside existing capture_session tool
- Share helper functions (generateMetadata, sanitizeFilename, etc.)
- Maintain clear module separation for testability

## Security Decision (Bundled)

During RFC-005 Phase 1 review, we also decided:

**Path Traversal Protection:** YES - Validate that resolved paths stay within workspace when workspace is specified. Return INVALID_PATH error if validation fails.

**Rationale:** Prevents malicious or accidental writes outside project boundaries.

## Related Decisions

- ADR-001: MVP Scope and Architecture (teaching-suite as single server)
- RFC-005: intelligent_save specification
- RFC-006: teaching-suite refactoring (depends on this ADR)
