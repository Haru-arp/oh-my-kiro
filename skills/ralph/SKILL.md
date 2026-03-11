---
name: ralph
description: "지속 실행 루프. 완료까지 계속. 트리거: $ralph, 랄프, 멈추지마, 계속해"
model: claude-sonnet-4-5
---

# Ralph 루프 - 완료까지 지속 실행

**사용자가 명시적으로 요청할 때만** 작업을 완료할 때까지 자동으로 계속 실행합니다.

## 트리거

- `$ralph "작업 설명"`
- "랄프 모드로 해줘"
- "완료까지 계속해"
- "멈추지 말고 끝까지"

## 사용법

```bash
$ralph "현재 작업을 완료할 때까지 계속"
```

**중요:** 사용자가 `$ralph`를 명시하지 않으면 Ralph 루프를 시작하지 마세요.

## 동작 방식

### 1. 목표 설정
사용자가 제시한 작업 목표를 명확히 파악합니다.

### 2. 반복 실행
```
🔄 [Ralph 반복 1/100]
   시도: {수행한 작업}
   검증: {검증 방법}
   결과: {검증 결과}
   다음: {다음 시도}
```

### 3. 완료 감지
```
✅ [Ralph 완료]
   총 반복: N회
   최종 상태: 모든 검증 통과
```

## 완료 조건

### 자동 감지
- 모든 테스트 통과
- 빌드 성공
- 에러 없음
- 목표 달성 확인

### 명시적 완료
```bash
echo "DONE" > .omk/state/ralph-done.txt
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

### ralph-active.json 구조
```json
{
  "goal": "사용자가 요청한 작업",
  "startTime": "ISO 8601 timestamp",
  "iteration": 1,
  "maxIterations": 100,
  "lastAction": "마지막 수행 작업",
  "lastResult": "마지막 결과",
  "verification": "검증 명령어"
}
```

## 검증 전략

### 자동 검증
프로젝트 타입에 따라 자동으로 적절한 검증 실행:

```bash
# Node.js 프로젝트
npm test
npm run build
npm run lint

# Python 프로젝트
pytest
python -m mypy .

# Rust 프로젝트
cargo test
cargo build
```

### 커스텀 검증
```bash
$ralph "작업 설명" --verify="custom-command"
```

## 실패 처리

### 재시도 전략
```
실패 1회: 즉시 재시도
실패 2회: 다른 접근 시도
실패 3회: 사용자에게 질문
```

### 에러 분석
각 실패 시 에러를 분석하고 다음 시도에 반영합니다.

## 진행 상황 표시

### 실시간 업데이트
```
🔄 [Ralph 진행 중] N/100
   ⏱️  경과: X분
   🎯 다음: {다음 작업}
```

### 완료 리포트
```
✅ [Ralph 완료 리포트]
   목표: {작업 목표}
   반복: N회
   소요: X분
   변경: N개 파일
```

## 통합

### Memory 스킬과 통합
- Ralph 상태를 세션 메모리에 저장
- 세션 재시작 시 Ralph 상태 복원 가능

### Verification 스킬과 통합
- 자동 검증 실행
- 검증 결과를 Ralph 상태에 반영

## 규칙

- **모든 응답은 한국어로 작성**
- **사용자가 `$ralph`를 명시하지 않으면 Ralph 루프를 시작하지 마세요**
- 검증 없이 완료 주장 금지
- 최대 반복 횟수 준수
- 각 반복마다 진행 상황 보고
- 완료 시 명확한 완료 메시지 출력


