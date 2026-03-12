# 디버깅 가이드

체계적인 버그 수정 접근법.

## 빠른 프로세스

1. **재현** - 버그 존재 확인
2. **격리** - 정확한 위치 찾기
3. **수정** - 솔루션 구현
4. **검증** - 철저히 테스트
5. **예방** - 테스트 추가

## 디버깅 도구

**로그:**
```typescript
console.log('디버그:', variable);
console.error('오류:', error);
```

**디버거:**
- 중단점 설정
- 코드 단계별 실행
- 변수 검사

**테스트:**
- 버그를 재현하는 테스트 작성
- 테스트 통과할 때까지 수정
- 회귀 방지를 위해 테스트 유지

## 일반적인 문제

**Undefined/Null:**
- 변수 초기화 확인
- null 체크 추가
- 옵셔널 체이닝 사용 `?.`

**비동기 문제:**
- Promise 처리 확인
- await 사용 검증
- 오류 처리 확인

**상태 문제:**
- 상태 업데이트 확인
- 의존성 검증
- 타이밍 확인

## 빠른 수정

**타입 오류:**
```typescript
// 이전
const value = data.field;

// 이후
const value = data?.field ?? defaultValue;
```

**비동기 오류:**
```typescript
// 이전
const data = fetchData();

// 이후
const data = await fetchData();
```
