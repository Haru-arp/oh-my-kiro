# 구현 가이드

코드 구현을 위한 빠른 참조.

## 시작하기 전에

- [ ] 요구사항 이해
- [ ] 기존 코드 확인
- [ ] 프로젝트 표준 검토

## 구현

### 1. 접근 방식 계획
- 적절한 패턴 선택
- 엣지 케이스 고려
- 테스트 고려

### 2. 코드 작성
- 프로젝트 규칙 따르기
- 확립된 패턴 사용
- 오류 적절히 처리
- 복잡한 로직에 주석 추가

### 3. 테스트
- 수동 테스트
- 기존 테스트 실행
- 필요시 새 테스트 추가

### 4. 리뷰
- 코드 품질 확인
- 베스트 프랙티스 검증
- 유지보수성 보장

## 빠른 체크

✓ 기술 스택 준수 (`.kiro/steering/standards/tech-stack.md`)
✓ 코드 스타일 준수 (`.kiro/steering/standards/code-style.md`)
✓ 오류 처리
✓ 예상대로 작동
✓ 테스트 통과

## 일반 패턴

**React 컴포넌트:**
```typescript
export function MyComponent({ prop }: Props) {
  // 상태
  const [state, setState] = useState();
  
  // 효과
  useEffect(() => {}, []);
  
  // 핸들러
  const handleClick = () => {};
  
  // 렌더
  return <div>...</div>;
}
```

**API 엔드포인트:**
```typescript
app.post('/api/resource', async (req, res) => {
  try {
    // 검증
    // 처리
    // 응답
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});
```
