# Agent Model Configuration Guide

## Overview

Each agent in Oh My Kiro can use a different model based on task complexity and requirements.

## Configuration

Edit `.omk/config.json`:

```json
{
  "agents": {
    "architect": {
      "complexity": "high",
      "focus": "analysis",
      "model": "claude-opus-4-20250514"
    },
    "executor": {
      "complexity": "medium",
      "focus": "implementation",
      "model": "claude-sonnet-4-20250514"
    },
    "verifier": {
      "complexity": "low",
      "focus": "verification",
      "model": "claude-haiku-4-20250514"
    }
  }
}
```

## Model Selection Strategy

### High Complexity Agents
- **architect**, **security-reviewer**
- Recommended: `claude-opus-4-20250514` or `claude-sonnet-4-20250514`
- Use cases: Architecture decisions, security audits, complex analysis

### Medium Complexity Agents
- **executor**, **planner**, **debugger**, **test-engineer**
- Recommended: `claude-sonnet-4-20250514`
- Use cases: Implementation, planning, debugging, testing

### Low Complexity Agents
- **verifier**, **explore**, **writer**
- Recommended: `claude-haiku-4-20250514` or `claude-sonnet-4-20250514`
- Use cases: Verification, exploration, documentation

## CLI Usage

### Specify model for team workers

```bash
# Use specific model for all workers
omk team 3:executor "refactor auth" --model claude-sonnet-4-20250514

# Use opus for high-complexity work
omk team 2:architect "design system" --model claude-opus-4-20250514

# Use haiku for simple verification
omk team 2:verifier "check tests" --model claude-haiku-4-20250514
```

### Model priority

1. CLI `--model` flag (highest priority)
2. Agent config in `.omk/config.json`
3. Kiro default model (fallback)

## Examples

### Example 1: Cost-Optimized Setup

```json
{
  "agents": {
    "architect": { "model": "claude-sonnet-4-20250514" },
    "executor": { "model": "claude-sonnet-4-20250514" },
    "verifier": { "model": "claude-haiku-4-20250514" },
    "explore": { "model": "claude-haiku-4-20250514" },
    "writer": { "model": "claude-haiku-4-20250514" }
  }
}
```

### Example 2: Quality-Optimized Setup

```json
{
  "agents": {
    "architect": { "model": "claude-opus-4-20250514" },
    "security-reviewer": { "model": "claude-opus-4-20250514" },
    "executor": { "model": "claude-sonnet-4-20250514" },
    "verifier": { "model": "claude-sonnet-4-20250514" }
  }
}
```

### Example 3: Balanced Setup (Default)

```json
{
  "agents": {
    "architect": { "model": "claude-sonnet-4-20250514" },
    "planner": { "model": "claude-sonnet-4-20250514" },
    "executor": { "model": "claude-sonnet-4-20250514" },
    "debugger": { "model": "claude-sonnet-4-20250514" },
    "verifier": { "model": "claude-sonnet-4-20250514" },
    "test-engineer": { "model": "claude-sonnet-4-20250514" },
    "security-reviewer": { "model": "claude-sonnet-4-20250514" }
  }
}
```

## Kiro Session Usage

When using skills in Kiro session, the model is determined by:

1. Agent role configuration in `.omk/config.json`
2. Kiro's current model setting

Example:

```
# In Kiro session
$team 3:executor "implement feature"
# Uses model from config.json for executor role

$team 2:architect "design system"
# Uses model from config.json for architect role
```

## Model Availability

Supported models (check Kiro documentation for latest):
- `claude-opus-4-20250514` - Highest capability
- `claude-sonnet-4-20250514` - Balanced performance
- `claude-haiku-4-20250514` - Fast and efficient

## Best Practices

1. **Match complexity to model**
   - High complexity tasks → Opus or Sonnet
   - Medium complexity → Sonnet
   - Low complexity → Haiku or Sonnet

2. **Cost optimization**
   - Use Haiku for verification and exploration
   - Use Sonnet for most implementation work
   - Reserve Opus for critical architecture decisions

3. **Quality vs Speed**
   - Opus: Best quality, slower, more expensive
   - Sonnet: Good balance
   - Haiku: Fast, cost-effective, good for simple tasks

4. **Override when needed**
   - Use CLI `--model` flag for one-off tasks
   - Update config for permanent changes

## Troubleshooting

### Model not found
- Check model name spelling
- Verify model is available in your Kiro installation
- Check Kiro documentation for supported models

### Workers using wrong model
- Check `.omk/config.json` agent configuration
- Verify CLI `--model` flag if used
- Check team state: `omk team-status`

### Performance issues
- Consider using faster model (Haiku) for simple tasks
- Use Sonnet as default for most work
- Reserve Opus for complex analysis only
