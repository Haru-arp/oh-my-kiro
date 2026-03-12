# Ralph Loop

Automatic verification and iteration until task completion.

## Process

```
Execute → Verify → Issues? → Fix → Verify → Done
```

## Verification Methods

**Code Changes:**
- Run tests: `npm test` or equivalent
- Check syntax: TypeScript/ESLint
- Manual verification if needed

**Bug Fixes:**
- Reproduce bug → Verify fixed
- Run regression tests
- Check related functionality

**New Features:**
- Test all paths
- Check edge cases
- Verify requirements met

## Iteration

- **Max 5 iterations** - If not resolved, report to user
- **Auto-fix** - Delegate to appropriate subagent
- **Fast feedback** - Quick verification cycles

## Example

```
1. executor implements feature
2. Run tests → 2 failures
3. debugger fixes issues
4. Run tests → All pass ✓
5. Done
```

## Important

- **Fast iterations** - Quick verify-fix cycles
- **Clear feedback** - Show what failed and why
- **Auto-resolve** - Fix issues without user intervention
- **Know when to stop** - Max 5 iterations, then escalate
