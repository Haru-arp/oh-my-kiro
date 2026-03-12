---
model: claude-opus-4.6
---

# 팀 스킬

여러 워커로 병렬 실행.

## 사용법

### 패턴 1: 같은 역할 N개 (단순 병렬)

`$team <개수>[:<역할>] <작업>`

**예시:** 
- `$team 3 모든 컴포넌트 리팩토링` (3개 executor)
- `$team 4:tester 모든 테스트 작성` (4개 tester)

**워크플로우:**
1. 작업을 N개로 분해
2. N개 서브에이전트 병렬 실행 (같은 역할)
3. 결과 통합

### 패턴 2: 다른 역할 혼합 (역할 분담)

`$team <작업 설명>`

**예시:**
```
$team 로그인 기능 완전 구현
```

**워크플로우:**
1. 작업 분석 → 필요한 역할 파악
2. 자동으로 역할 분담:
   - executor: 백엔드 API
   - executor: 프론트엔드 UI
   - tester: 테스트 작성
   - writer: 문서 작성
3. 4개 병렬 실행
4. 결과 통합 + Ralph 루프

## 예시

### 예시 1: 같은 역할 (단순 병렬)

```
사용자: $team 3 대시보드 8개 페이지 구현

1. 계획:
   - executor #1: Home, Profile, Settings
   - executor #2: Analytics, Reports, Admin
   - executor #3: Notifications, Help

2. 실행 (병렬):
   [executor #1] 3개 페이지
   [executor #2] 3개 페이지
   [executor #3] 2개 페이지

3. 통합 → 완료 ✓
```

### 예시 2: 역할 혼합 (자동 분담)

```
사용자: $team 결제 시스템 구현

1. 분석:
   - 백엔드 API 필요
   - 프론트엔드 UI 필요
   - 테스트 필요
   - 문서 필요

2. 역할 분담:
   - executor: Stripe API 통합
   - executor: 결제 UI 컴포넌트
   - tester: 결제 플로우 테스트
   - writer: 결제 API 문서

3. 실행 (병렬):
   [executor #1] Stripe API
   [executor #2] 결제 UI
   [tester] 테스트
   [writer] 문서

4. 통합 + Ralph 루프 → 완료 ✓
```

## 역할 선택

- **executor**: 코드 구현, 리팩토링
- **tester**: 테스트 작성, 실행
- **reviewer**: 코드 리뷰
- **architect**: 아키텍처 설계
- **writer**: 문서 작성

## 팁

- **최대 4개 워커** (Kiro 제한)
- **같은 작업 반복** → `$team N:역할`
- **복잡한 기능** → `$team 작업` (자동 역할 분담)
- **독립적인 작업**이 가장 효과적
