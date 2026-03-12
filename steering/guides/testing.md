# 테스트 가이드

실용적인 테스트 접근법.

## 테스트 유형

**단위 테스트** - 개별 함수
```typescript
test('이메일 검증', () => {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validateEmail('invalid')).toBe(false);
});
```

**통합 테스트** - 컴포넌트 상호작용
```typescript
test('폼 제출', async () => {
  render(<LoginForm />);
  fireEvent.change(emailInput, { target: { value: 'test@example.com' }});
  fireEvent.click(submitButton);
  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
});
```

**E2E 테스트** - 전체 사용자 플로우
```typescript
test('사용자 로그인', async () => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## AAA 패턴

```typescript
test('예시', () => {
  // 준비 (Arrange)
  const input = 'test';
  
  // 실행 (Act)
  const result = myFunction(input);
  
  // 검증 (Assert)
  expect(result).toBe('expected');
});
```

## 빠른 체크

✓ 테스트는 독립적
✓ 테스트는 빠름
✓ 명확한 테스트 이름
✓ 테스트당 하나의 검증 (이상적)
✓ 테스트는 신뢰할 수 있음

## 커버리지 목표

- **80%+** 전체 커버리지
- **100%** 중요 경로
- **모든** 엣지 케이스
- **모든** 오류 처리
