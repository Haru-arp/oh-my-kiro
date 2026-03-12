# Team Skill

Parallel execution with multiple workers.

## Usage

`$team <count>:<role> <task>`

**Example:** `$team 3:executor Refactor all components`

## Workflow

1. **Parse**: `3:executor` = 3 executor workers
2. **Plan**: Break task into 3 parallel subtasks
3. **Execute**: Spawn 3 subagents (parallel)
4. **Integrate**: Merge results
5. **Verify**: Ralph loop on integrated result

## Example

```
User: $team 3:executor Implement dashboard pages

1. Plan:
   - Worker 1: Home, Profile pages
   - Worker 2: Settings, Analytics pages
   - Worker 3: Reports, Admin pages

2. Execute (parallel):
   [executor #1] Home, Profile
   [executor #2] Settings, Analytics
   [executor #3] Reports, Admin

3. Integrate:
   - Merge all changes
   - Resolve conflicts

4. Verify:
   - Run all tests
   - Fix issues
   - Done ✓
```

## Tips

- **Max 4 workers** (Kiro limit)
- **Independent tasks** work best
- **Clear boundaries** reduce conflicts
- **Test after integration** always
