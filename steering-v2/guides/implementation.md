# Implementation Guide

Quick reference for code implementation.

## Before You Start

- [ ] Understand requirements
- [ ] Check existing code
- [ ] Review project standards

## Implementation

### 1. Plan Approach
- Choose appropriate patterns
- Consider edge cases
- Think about testing

### 2. Write Code
- Follow project conventions
- Use established patterns
- Handle errors properly
- Add comments for complex logic

### 3. Test
- Manual testing
- Run existing tests
- Add new tests if needed

### 4. Review
- Check code quality
- Verify best practices
- Ensure maintainability

## Quick Checks

✓ Follows tech stack (`.kiro/steering/standards/tech-stack.md`)
✓ Follows code style (`.kiro/steering/standards/code-style.md`)
✓ Handles errors
✓ Works as expected
✓ Tests pass

## Common Patterns

**React Component:**
```typescript
export function MyComponent({ prop }: Props) {
  // State
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {}, []);
  
  // Handlers
  const handleClick = () => {};
  
  // Render
  return <div>...</div>;
}
```

**API Endpoint:**
```typescript
app.post('/api/resource', async (req, res) => {
  try {
    // Validate
    // Process
    // Respond
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});
```
