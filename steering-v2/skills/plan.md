# Plan Skill

Detailed task planning and breakdown.

## Usage

`$plan <task description>`

**Example:** `$plan Implement shopping cart feature`

## Workflow

1. **Analyze** requirements
2. **Break down** into subtasks
3. **Identify** dependencies
4. **Estimate** complexity
5. **Create** execution plan

## Output

```markdown
# Plan: Shopping Cart

## Tasks

### 1. Cart State Management
- Subagent: executor
- Complexity: Medium
- Dependencies: None
- Estimate: 2-3 hours

### 2. Cart UI Components
- Subagent: executor
- Complexity: Medium
- Dependencies: Task 1
- Estimate: 2-3 hours

### 3. Cart API Endpoints
- Subagent: executor
- Complexity: High
- Dependencies: None
- Estimate: 3-4 hours

### 4. Tests
- Subagent: tester
- Complexity: Medium
- Dependencies: Tasks 1, 2, 3
- Estimate: 2 hours

## Execution Order

1. Tasks 1, 3 (parallel)
2. Task 2 (after 1)
3. Task 4 (after all)

## Total Estimate: 9-12 hours
```

## Tips

- **Use before complex work** for clarity
- **Share with team** for alignment
- **Update as needed** during execution
