# Debugging Guide

Systematic bug fixing approach.

## Quick Process

1. **Reproduce** - Verify bug exists
2. **Isolate** - Find exact location
3. **Fix** - Implement solution
4. **Verify** - Test thoroughly
5. **Prevent** - Add tests

## Debugging Tools

**Logs:**
```typescript
console.log('Debug:', variable);
console.error('Error:', error);
```

**Debugger:**
- Set breakpoints
- Step through code
- Inspect variables

**Tests:**
- Write test that reproduces bug
- Fix until test passes
- Keep test for regression

## Common Issues

**Undefined/Null:**
- Check variable initialization
- Add null checks
- Use optional chaining `?.`

**Async Issues:**
- Check promise handling
- Verify await usage
- Check error handling

**State Issues:**
- Check state updates
- Verify dependencies
- Check timing

## Quick Fixes

**Type Error:**
```typescript
// Before
const value = data.field;

// After
const value = data?.field ?? defaultValue;
```

**Async Error:**
```typescript
// Before
const data = fetchData();

// After
const data = await fetchData();
```
