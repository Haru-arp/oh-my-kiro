# TDD Skill

Test-driven development workflow.

## Usage

`$tdd <feature description>`

**Example:** `$tdd Email validation function`

## Workflow (Red-Green-Refactor)

### 1. Red (Test Fails)
- [tester] Write failing test
- Verify test fails ✓

### 2. Green (Test Passes)
- [executor] Implement minimal code
- Run test → passes ✓

### 3. Refactor (Improve Code)
- [executor] Clean up code
- Run test → still passes ✓

### 4. Repeat
- Add more test cases
- Red-Green-Refactor cycle

## Example

```
User: $tdd Email validation

1. Red:
   [tester] Test: valid email passes
   Run → fails ✓

2. Green:
   [executor] Basic regex validation
   Run → passes ✓

3. Refactor:
   [executor] Extract to utility
   Run → passes ✓

4. Repeat:
   [tester] Test: invalid formats fail
   [executor] Improve validation
   Run → passes ✓
```

## Benefits

- **Tests first** = clear requirements
- **Minimal code** = no over-engineering
- **Refactor safely** = tests protect you
- **High coverage** = automatic
