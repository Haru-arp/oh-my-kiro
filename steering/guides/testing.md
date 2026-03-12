# Testing Guide

Practical testing approach.

## Test Types

**Unit Tests** - Individual functions
```typescript
test('validates email', () => {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validateEmail('invalid')).toBe(false);
});
```

**Integration Tests** - Component interaction
```typescript
test('form submission', async () => {
  render(<LoginForm />);
  fireEvent.change(emailInput, { target: { value: 'test@example.com' }});
  fireEvent.click(submitButton);
  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
});
```

**E2E Tests** - Full user flows
```typescript
test('user can login', async () => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## AAA Pattern

```typescript
test('example', () => {
  // Arrange
  const input = 'test';
  
  // Act
  const result = myFunction(input);
  
  // Assert
  expect(result).toBe('expected');
});
```

## Quick Checks

✓ Tests are independent
✓ Tests are fast
✓ Clear test names
✓ One assertion per test (ideally)
✓ Tests are reliable

## Coverage Goals

- **80%+** overall coverage
- **100%** critical paths
- **All** edge cases
- **All** error handling
