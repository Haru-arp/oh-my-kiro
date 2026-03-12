---
model: claude-opus-4.6
---

# 팀 스킬

여러 워커로 병렬 실행.

## 사용법

`$team <개수>[:<역할>] <작업>`

**예시:** 
- `$team 3 모든 컴포넌트 리팩토링` (기본: executor)
- `$team 3:executor 모든 컴포넌트 리팩토링` (명시)
- `$team 4:tester 모든 테스트 작성` (다른 역할)

## 워크플로우

1. **파싱**: 
   - `3` = 3개의 executor 워커 (기본)
   - `3:tester` = 3개의 tester 워커 (명시)
2. **계획**: 작업을 N개의 병렬 하위 작업으로 분해
3. **실행**: N개의 서브에이전트 생성 (병렬)
4. **통합**: 결과 병합
5. **검증**: 통합된 결과에 Ralph 루프 적용

## 예시

```
사용자: $team 3 대시보드 페이지 구현

1. 계획:
   - 워커 1: Home, Profile 페이지
   - 워커 2: Settings, Analytics 페이지
   - 워커 3: Reports, Admin 페이지

2. 실행 (병렬):
   [executor #1] Home, Profile
   [executor #2] Settings, Analytics
   [executor #3] Reports, Admin

3. 통합:
   - 모든 변경사항 병합
   - 충돌 해결

4. 검증:
   - 모든 테스트 실행
   - 문제 수정
   - 완료 ✓
```

## 역할 선택

- **executor** (기본): 코드 구현, 리팩토링
- **tester**: 테스트 작성, 실행
- **reviewer**: 코드 리뷰
- **writer**: 문서 작성

## 팁

- **최대 4개 워커** (Kiro 제한)
- **독립적인 작업**이 가장 효과적
- **명확한 경계**로 충돌 감소
- **통합 후 테스트** 필수
