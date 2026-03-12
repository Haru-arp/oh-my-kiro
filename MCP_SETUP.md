# MCP 메시지 서버 설정 가이드

Oh My Kiro v2.1의 워커 간 통신 기능 설정 방법.

## 자동 설치 (권장)

```bash
cd your-project
omk setup --local --force
```

이 명령어는 자동으로:
1. `.kiro/mcp/` 디렉토리에 MCP 서버 파일 복사
2. `.kiro/settings/mcp.json` 생성
3. 모든 에이전트에 `@omk-messages` 도구 추가

## 수동 빌드

MCP 서버는 TypeScript로 작성되어 있어 빌드가 필요합니다:

```bash
cd .kiro/mcp
npm install
npm run build
```

빌드 후 `.kiro/mcp/dist/message-server.js` 파일이 생성됩니다.

## 설정 확인

### 1. MCP 설정 확인

`.kiro/settings/mcp.json`:
```json
{
  "mcpServers": {
    "omk-messages": {
      "command": "node",
      "args": ["/path/to/.kiro/mcp/dist/message-server.js"],
      "env": {
        "OMK_WORK_DIR": "/path/to/project"
      }
    }
  }
}
```

### 2. 에이전트 설정 확인

모든 에이전트 JSON 파일에 다음이 포함되어야 합니다:

```json
{
  "tools": ["@omk-messages"],
  "allowedTools": ["@omk-messages"],
  "includeMcpJson": true
}
```

## 사용 방법

### Kiro CLI에서

```bash
kiro-cli chat

> 3개 모듈을 병렬로 리팩토링하되, 완료 시 서로 알림
```

### 에이전트가 자동으로 사용

```
default 에이전트:
  → use_subagent(executor-1, "모듈 A 리팩토링")
  → use_subagent(executor-2, "모듈 B 리팩토링")

executor-1:
  → 모듈 A 완료
  → send_message(to="executor-2", message="A done")

executor-2:
  → read_messages(worker="executor-2")
  → "A done" 확인
  → 모듈 B 작업 (A 반영)
```

## 도구 사용법

### send_message

```typescript
send_message({
  to: "tester",
  message: "API 구현 완료",
  metadata: {
    files: ["src/api.ts"],
    status: "done"
  }
})
```

### read_messages

```typescript
read_messages({
  worker: "tester",
  keep: false  // false면 읽은 후 삭제
})
```

### list_workers

```typescript
list_workers()
```

## 메시지 저장 위치

```
.kiro/messages/
├── tester/
│   └── 1234567890.json
├── executor-2/
│   └── 1234567891.json
└── reviewer/
    └── 1234567892.json
```

## 디버깅

### MCP 서버 로그 확인

```bash
# Kiro CLI 로그에서 MCP 서버 출력 확인
tail -f ~/.kiro/logs/chat.log
```

### 메시지 수동 확인

```bash
# 특정 워커의 메시지
cat .kiro/messages/tester/*.json

# 모든 메시지
find .kiro/messages -name "*.json" -exec cat {} \;
```

### 메시지 수동 삭제

```bash
rm -rf .kiro/messages/*
```

## 문제 해결

### MCP 서버가 시작되지 않음

1. 빌드 확인:
```bash
cd .kiro/mcp
npm run build
ls dist/message-server.js  # 파일 존재 확인
```

2. 경로 확인:
```bash
cat .kiro/settings/mcp.json
# args 경로가 올바른지 확인
```

### 도구를 찾을 수 없음

1. 에이전트 설정 확인:
```bash
cat .kiro/agents/executor.json | jq '.tools, .allowedTools'
# @omk-messages가 포함되어 있는지 확인
```

2. includeMcpJson 확인:
```bash
cat .kiro/agents/executor.json | jq '.includeMcpJson'
# true여야 함
```

### 메시지가 전달되지 않음

1. 메시지 디렉토리 확인:
```bash
ls -la .kiro/messages/
```

2. 권한 확인:
```bash
chmod -R 755 .kiro/messages/
```

## 고급 설정

### 커스텀 메시지 디렉토리

환경 변수로 메시지 저장 위치 변경:

```json
{
  "mcpServers": {
    "omk-messages": {
      "command": "node",
      "args": ["/path/to/message-server.js"],
      "env": {
        "OMK_WORK_DIR": "/custom/path"
      }
    }
  }
}
```

### 워커 ID 설정

서브에이전트에 고유 ID 부여:

```json
{
  "env": {
    "OMK_WORKER_ID": "executor-1"
  }
}
```

## 참고

- [워커 간 통신 가이드](steering/guides/worker-communication.md)
- [MCP 서버 소스](mcp/message-server.ts)
- [Kiro CLI MCP 문서](https://kiro.dev/docs/cli/mcp/)
