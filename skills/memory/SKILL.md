---
name: memory
description: "세션 메모리 관리. 컨텍스트 보존, 세션 요약, handoff. 트리거: $memory, /handoff, 세션 종료"
model: claude-sonnet-4.5
---

# Memory - 세션 메모리 관리

세션 간 컨텍스트 지속성을 제공합니다.

## 사용법

```bash
$memory save "인증 모듈 리팩토링 완료"
$memory load
/handoff
```

## 메모리 구조

```
.omk/memory/
├── session-latest.md      # 최신 세션 요약 (자동 로드)
├── project.md             # 프로젝트 안정 정보
├── decisions.md           # 주요 결정 사항
└── sessions/
    ├── 2026-03-11-1.md    # 세션 히스토리
    └── 2026-03-11-2.md

.omk/events/
└── events.jsonl           # 이벤트 로그 (자동 캡처)
```

## 이벤트 캡처

모든 중요한 작업이 자동으로 `events.jsonl`에 기록됩니다:

```jsonl
{"timestamp":"2026-03-11T18:00:00Z","type":"task_start","description":"버그 수정 시작"}
{"timestamp":"2026-03-11T18:05:00Z","type":"decision","description":"Radix UI 사용 결정"}
{"timestamp":"2026-03-11T18:10:00Z","type":"file_change","file":"src/Modal.tsx","description":"컴포넌트 리팩토링"}
{"timestamp":"2026-03-11T18:15:00Z","type":"task_complete","description":"버그 수정 완료"}
```

**이벤트 타입:**
- `task_start` - 작업 시작
- `task_complete` - 작업 완료
- `decision` - 주요 결정
- `file_change` - 파일 변경
- `context` - 컨텍스트 정보
- `next_task` - 다음 작업
- `error` - 에러 발생
- `ralph_iteration` - Ralph 루프 반복

## 동작

### 세션 시작
1. `.omk/memory/session-latest.md` 읽기
2. 이전 세션 컨텍스트 복원
3. 현재 작업 상태 파악

### 작업 중
- 중요 결정 시 자동 저장
- 컨텍스트 80% 도달 시 자동 요약

### 세션 종료 (/handoff)
1. 현재 세션 요약 생성
2. `.omk/memory/sessions/{timestamp}.md` 저장
3. `session-latest.md` 업데이트

## 세션 요약 형식

```markdown
# 세션 요약
세션: 2026-03-11 17:00-18:00
프로젝트: design-system

## 완료된 작업
- ModalDialog 컴포넌트 리팩토링
- Radix UI로 마이그레이션

## 주요 결정
- 애니메이션: framer-motion 사용
- 테스트: Vitest + Testing Library

## 다음 작업
- [ ] 접근성 테스트 추가
- [ ] 문서 업데이트

## 파일 변경
- src/components/ModalDialog.tsx (수정)
- src/components/ModalDialog.test.tsx (생성)

## 컨텍스트
- 기존 Modal 컴포넌트와 호환성 유지
- 애니메이션은 기존 디자인 시스템 따름
```

## 명령어

### $memory save
중요한 결정이나 상태를 즉시 저장:
```bash
$memory save "API 엔드포인트를 /api/v2로 변경하기로 결정"
```

### $memory load
최신 세션 컨텍스트 로드:
```bash
$memory load
```

### /handoff
세션 종료 및 요약 생성:
```bash
/handoff
```

## 자동 동작

### 컨텍스트 압축 시
- 중요 결정 사항 보존
- 파일 변경 이력 보존
- 다음 작업 목록 보존

### 세션 시작 시
- `session-latest.md` 자동 로드
- 이전 컨텍스트 복원
- 다음 작업 목록 표시

## 통합

default 에이전트가 자동으로 `session-latest.md`를 로드합니다:
```json
{
  "resources": [
    "file://.omk/memory/session-latest.md",
    "file://.kiro/steering/**/*.md"
  ]
}
```

## 구현

### 세션 요약 생성
```bash
# 현재 세션 분석
- 변경된 파일 목록
- 실행한 명령어
- 주요 결정 사항
- 미완료 작업

# 요약 저장
timestamp=$(date +%Y-%m-%d-%H%M)
cat > .omk/memory/sessions/$timestamp.md

# latest 업데이트
cp .omk/memory/sessions/$timestamp.md .omk/memory/session-latest.md
```

### 컨텍스트 복원
```bash
# session-latest.md 읽기
cat .omk/memory/session-latest.md

# 다음 작업 추출
grep "^- \[ \]" .omk/memory/session-latest.md
```
