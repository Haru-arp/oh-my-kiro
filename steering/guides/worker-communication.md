# 워커 간 통신 가이드

서브에이전트 간 메시지 전달 패턴.

## 개요

여러 서브에이전트가 병렬로 작업할 때, 작업 완료 알림이나 정보 공유가 필요한 경우 메시지 시스템을 사용합니다.

## 도구

### send_message

다른 워커에게 메시지 전송:

```typescript
send_message({
  to: "tester",
  message: "API 구현 완료. src/api.ts 참고",
  metadata: {
    files: ["src/api.ts", "src/types.ts"],
    status: "done"
  }
})
```

### read_messages

자신에게 온 메시지 확인:

```typescript
read_messages({
  worker: "tester",
  keep: false  // false면 읽은 후 삭제
})
```

**응답:**
```json
{
  "messages": [
    {
      "message": "API 구현 완료. src/api.ts 참고",
      "metadata": { "files": ["src/api.ts"], "status": "done" },
      "timestamp": 1234567890,
      "from": "executor-1"
    }
  ],
  "count": 1
}
```

### list_workers

메시지 디렉토리가 있는 워커 목록:

```typescript
list_workers()
```

## 사용 패턴

### 패턴 1: 순차 의존성

```
default 에이전트:
  → executor에게 "API 구현" 위임
  
executor:
  → API 구현 완료
  → send_message(to="tester", message="API 완료, src/api.ts")
  
default 에이전트:
  → tester에게 "테스트 작성" 위임
  
tester:
  → read_messages(worker="tester")
  → "API 완료, src/api.ts" 확인
  → 해당 파일 테스트 작성
```

### 패턴 2: 병렬 작업 조율

```
default 에이전트:
  → 3개 executor에게 병렬 작업 위임
  
executor-1:
  → 모듈 A 완료
  → send_message(to="executor-2", message="Module A exports 변경됨")
  
executor-2:
  → read_messages(worker="executor-2")
  → Module A 변경사항 확인
  → 모듈 B 작업 (A 반영)
```

### 패턴 3: 상태 브로드캐스트

```
executor:
  → 작업 완료
  → send_message(to="reviewer", message="리뷰 준비됨")
  → send_message(to="tester", message="테스트 준비됨")
  → send_message(to="writer", message="문서 업데이트 필요")
```

## 메시지 저장 위치

```
.kiro/messages/
├── tester/
│   ├── 1234567890.json
│   └── 1234567891.json
├── executor-2/
│   └── 1234567892.json
└── reviewer/
    └── 1234567893.json
```

## 주의사항

**자동 삭제:**
- `read_messages(keep=false)` 시 메시지 자동 삭제
- 중요한 메시지는 `keep=true` 사용

**워커 이름:**
- 명확한 이름 사용 (예: "tester", "executor-1")
- default 에이전트가 워커 이름 관리

**메타데이터 활용:**
- 파일 경로, 상태, 우선순위 등 구조화된 정보 전달
- JSON 형식으로 파싱 가능

## 예시: 전체 워크플로우

```
사용자: "3개 모듈 병렬 리팩토링, 완료 시 서로 알림"

default:
  → use_subagent(executor-1, "모듈 A 리팩토링")
  → use_subagent(executor-2, "모듈 B 리팩토링")
  → use_subagent(executor-3, "모듈 C 리팩토링")

executor-1:
  → 모듈 A 완료
  → send_message(to="executor-2", message="A done, exports changed")
  → send_message(to="executor-3", message="A done, exports changed")

executor-2:
  → read_messages(worker="executor-2")
  → "A done" 확인
  → 모듈 B 작업 (A 반영)
  → send_message(to="executor-3", message="B done")

executor-3:
  → read_messages(worker="executor-3")
  → "A done", "B done" 확인
  → 모듈 C 작업 (A, B 반영)
  → 완료

default:
  → 모든 워커 완료 확인
  → 사용자에게 결과 보고
```

## 디버깅

**메시지 확인:**
```bash
# 특정 워커의 메시지 확인
cat .kiro/messages/tester/*.json

# 모든 메시지 확인
find .kiro/messages -name "*.json" -exec cat {} \;
```

**메시지 수동 삭제:**
```bash
rm -rf .kiro/messages/tester/*
```
