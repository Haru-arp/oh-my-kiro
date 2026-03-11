---
name: ralph
description: "지속 실행 루프. 완료까지 계속. 트리거: $ralph, 랄프, 멈추지마, 계속해"
model: claude-sonnet-4-5
---

# Ralph 루프 - 완료까지 지속 실행

작업을 완료할 때까지 자동으로 계속 실행합니다.

## 사용법

```bash
$ralph "REST API 인증 구현"
$ralph "모든 ESLint 경고 수정" --max-iterations=50
```

## 동작 방식

### 1. 목표 설정
```
목표: REST API 인증 구현
검증: npm test && curl localhost:3000/api/auth
```

### 2. 반복 실행
```
🔄 [Ralph 반복 1/100]
   시도: JWT 토큰 생성 로직 구현
   검증: npm test
   결과: 3개 테스트 실패
   다음: 토큰 검증 로직 수정

🔄 [Ralph 반복 2/100]
   시도: 토큰 검증 로직 수정
   검증: npm test
   결과: 모든 테스트 통과
   다음: 완료 확인
```

### 3. 완료 감지
```
✅ [Ralph 완료]
   총 반복: 2회
   최종 상태: 모든 검증 통과
   소요 시간: 5분
```

## 완료 조건

### 자동 감지
- 모든 테스트 통과
- 빌드 성공
- 에러 없음
- 목표 달성 확인

### 명시적 완료
```bash
# 작업 완료 선언
echo "DONE: 인증 구현 완료" > .omk/state/ralph-done.txt
```

### 중단 조건
- 최대 반복 도달 (기본 100회)
- `/cancel-ralph` 명령
- 같은 에러 3회 반복
- 사용자 개입 필요

## 상태 관리

### 상태 파일
```
.omk/state/
├── ralph-active.json      # 현재 Ralph 상태
├── ralph-history.jsonl    # 반복 이력
└── ralph-done.txt         # 완료 플래그
```

### ralph-active.json
```json
{
  "goal": "REST API 인증 구현",
  "startTime": "2026-03-11T18:00:00Z",
  "iteration": 2,
  "maxIterations": 100,
  "lastAction": "토큰 검증 로직 수정",
  "lastResult": "모든 테스트 통과",
  "verification": "npm test && curl localhost:3000/api/auth"
}
```

## 검증 전략

### 자동 검증
```bash
# 테스트 실행
npm test

# 빌드 확인
npm run build

# 린트 확인
npm run lint

# 타입 체크
npm run type-check
```

### 커스텀 검증
```bash
$ralph "API 구현" --verify="npm test && curl -f localhost:3000/health"
```

## 실패 처리

### 재시도 전략
```
실패 1회: 즉시 재시도
실패 2회: 다른 접근 시도
실패 3회: 사용자에게 질문
```

### 에러 분석
```
🔍 [Ralph 분석]
   에러: TypeError: Cannot read property 'id' of undefined
   위치: src/auth/token.ts:42
   원인: user 객체가 null
   해결: null 체크 추가
```

## 진행 상황 표시

### 실시간 업데이트
```
🔄 [Ralph 진행 중] 2/100
   ⏱️  경과: 5분
   📊 진행률: 60%
   🎯 다음: 토큰 만료 처리
```

### 완료 리포트
```
✅ [Ralph 완료 리포트]
   목표: REST API 인증 구현
   반복: 2회
   소요: 5분
   변경: 3개 파일
   테스트: 15개 통과
```

## 통합

### Memory 스킬과 통합
- Ralph 상태를 세션 메모리에 저장
- 세션 재시작 시 Ralph 상태 복원

### Verification 스킬과 통합
- 자동 검증 실행
- 검증 결과를 Ralph 상태에 반영

## 규칙

- **모든 응답은 한국어로 작성**
- 검증 없이 완료 주장 금지
- 최대 반복 횟수 준수
- 각 반복마다 진행 상황 보고

