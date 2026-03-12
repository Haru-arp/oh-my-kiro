# Oh My Kiro v2 - Kiro CLI 공식 문서 기반 재설계

## 학습한 핵심 개념

### 1. Subagents (use_subagent 도구)

**공식 동작 방식:**
- 최대 4개 병렬 실행
- 독립된 컨텍스트
- 실시간 진행 상황 표시
- 결과 자동 반환

**사용 가능한 도구:**
- ✅ read, write, shell, code, MCP tools
- ❌ web_search, web_fetch, introspect, thinking, todo_list, use_aws, grep, glob

**설정:**
```json
{
  "toolsSettings": {
    "subagent": {
      "availableAgents": ["reviewer", "tester", "docs-*"],
      "trustedAgents": ["reviewer", "tester"]
    }
  }
}
```

### 2. Steering Files

**자동 로드:**
- `.kiro/steering/**/*.md` - 워크스페이스
- `~/.kiro/steering/**/*.md` - 글로벌
- `AGENTS.md` - 항상 로드 (워크스페이스 루트 또는 글로벌)

**커스텀 에이전트에서는:**
```json
{
  "resources": [
    "file://.kiro/steering/**/*.md"  // 명시적으로 추가 필요
  ]
}
```

**우선순위:**
- 워크스페이스 > 글로벌
- AGENTS.md는 항상 로드

### 3. MCP Integration

**includeMcpJson:**
```json
{
  "includeMcpJson": true  // ~/.kiro/settings/mcp.json 읽기
}
```

**allowedTools에 MCP 추가:**
```json
{
  "allowedTools": [
    "fs_read",
    "@Figma Desktop",  // 특정 MCP 서버
    "@*"               // 모든 MCP 서버
  ]
}
```

**중요:** `includeMcpJson: true`만으로는 부족! `allowedTools`에 명시 필요.

### 4. Agent Configuration

**필수 필드:**
- `name` - 에이전트 이름
- `description` - 설명
- `tools` - 사용 가능한 도구 목록
- `allowedTools` - 승인 없이 사용 가능한 도구
- `model` - 모델 ID

**선택 필드:**
- `prompt` - 시스템 프롬프트 (inline 또는 file://)
- `resources` - 자동 로드할 파일/스킬
- `mcpServers` - 에이전트 전용 MCP 서버
- `includeMcpJson` - 글로벌 MCP 설정 로드
- `toolsSettings` - 도구별 설정
- `hooks` - 이벤트 훅

**tools vs allowedTools:**
- `tools`: 에이전트가 요청할 수 있는 도구
- `allowedTools`: 실제로 사용 가능한 도구 (권한)
- `allowedTools: []` = 모든 도구 허용

### 5. Built-in Tools

**파일 작업:**
- `read` - 파일/폴더/이미지 읽기
- `write` - 파일 생성/수정
- `glob` - 파일 검색 (gitignore 존중)
- `grep` - 내용 검색 (gitignore 존중)

**실행:**
- `shell` - Bash 명령
- `aws` - AWS CLI

**코드:**
- `code` - LSP 기반 코드 인텔리전스

**웹:**
- `web_search` - 웹 검색
- `web_fetch` - URL 가져오기

**기타:**
- `introspect` - Kiro CLI 정보
- `use_subagent` - 서브에이전트 위임
- `knowledge` - 지식 베이스
- `thinking` - 추론 도구
- `todo` - 할 일 목록
- `session` - 세션 설정

## Oh My Kiro v2 설계

### 목표

1. **Kiro CLI 공식 패턴 준수**
2. **Subagent 기반 오케스트레이션**
3. **Steering 파일 활용**
4. **MCP 완벽 지원**
5. **최소한의 복잡도**

### 아키텍처

```
orchestrator (default)
├── use_subagent 도구 사용
├── AGENTS.md 자동 로드
├── steering 파일 자동 로드
└── 서브에이전트 위임
    ├── executor (코드 구현)
    ├── debugger (버그 수정)
    ├── tester (테스트)
    ├── reviewer (코드 리뷰)
    └── writer (문서)
```

### 에이전트 구성

**1. orchestrator (default)**
```json
{
  "name": "default",
  "description": "Orchestrator that delegates to specialized subagents",
  "prompt": "file://.kiro/prompts/orchestrator.md",
  "tools": ["fs_read", "code", "grep", "glob", "use_subagent"],
  "allowedTools": ["fs_read", "code", "grep", "glob", "use_subagent"],
  "toolsSettings": {
    "subagent": {
      "availableAgents": ["executor", "debugger", "tester", "reviewer", "writer"],
      "trustedAgents": ["executor", "debugger", "tester", "reviewer", "writer"]
    }
  },
  "resources": [
    "file://.kiro/steering/**/*.md"
  ],
  "includeMcpJson": true,
  "model": "claude-opus-4.6"
}
```

**2. executor (서브에이전트)**
```json
{
  "name": "executor",
  "description": "Code implementation specialist",
  "prompt": "file://.kiro/prompts/executor.md",
  "tools": ["fs_read", "fs_write", "code", "grep", "glob", "execute_bash"],
  "allowedTools": ["fs_read", "fs_write", "code", "grep", "glob", "execute_bash", "@*"],
  "resources": [
    "file://.kiro/steering/**/*.md"
  ],
  "includeMcpJson": true,
  "model": "claude-opus-4.6"
}
```

**3. debugger (서브에이전트)**
```json
{
  "name": "debugger",
  "description": "Bug fixing specialist",
  "prompt": "file://.kiro/prompts/debugger.md",
  "tools": ["fs_read", "fs_write", "code", "grep", "glob", "execute_bash"],
  "allowedTools": ["fs_read", "fs_write", "code", "grep", "glob", "execute_bash"],
  "resources": [
    "file://.kiro/steering/**/*.md"
  ],
  "includeMcpJson": true,
  "model": "claude-opus-4.6"
}
```

**4. tester (서브에이전트)**
```json
{
  "name": "tester",
  "description": "Test design and execution specialist",
  "prompt": "file://.kiro/prompts/tester.md",
  "tools": ["fs_read", "fs_write", "code", "grep", "glob", "execute_bash"],
  "allowedTools": ["fs_read", "fs_write", "code", "grep", "glob", "execute_bash"],
  "resources": [
    "file://.kiro/steering/**/*.md"
  ],
  "includeMcpJson": true,
  "model": "claude-sonnet-4.5"
}
```

**5. reviewer (서브에이전트)**
```json
{
  "name": "reviewer",
  "description": "Code review specialist",
  "prompt": "file://.kiro/prompts/reviewer.md",
  "tools": ["fs_read", "code", "grep", "glob"],
  "allowedTools": ["fs_read", "code", "grep", "glob"],
  "resources": [
    "file://.kiro/steering/**/*.md"
  ],
  "includeMcpJson": true,
  "model": "claude-sonnet-4.5"
}
```

**6. writer (서브에이전트)**
```json
{
  "name": "writer",
  "description": "Documentation specialist",
  "prompt": "file://.kiro/prompts/writer.md",
  "tools": ["fs_read", "fs_write", "grep", "glob"],
  "allowedTools": ["fs_read", "fs_write", "grep", "glob"],
  "resources": [
    "file://.kiro/steering/**/*.md"
  ],
  "includeMcpJson": true,
  "model": "claude-haiku-4.5"
}
```

### Steering 파일

**AGENTS.md (워크스페이스 루트)**
```markdown
# Project Agents

This project uses Oh My Kiro orchestration system.

## Orchestrator (default)

The default agent is an orchestrator that delegates tasks to specialized subagents.

**Never work directly. Always delegate to appropriate subagent:**
- Code implementation → executor
- Bug fixing → debugger
- Testing → tester
- Code review → reviewer
- Documentation → writer

## Subagents

All subagents have access to:
- Project steering files
- MCP tools (Figma, etc.)
- Code intelligence
- File operations
```

**.kiro/steering/orchestration.md**
```markdown
# Orchestration Rules

## Delegation Pattern

When user requests work:

1. Analyze task complexity
2. Choose appropriate subagent
3. Delegate using use_subagent tool
4. Monitor progress
5. Return results

## Subagent Selection

- **executor**: File modifications, code implementation
- **debugger**: Bug fixes, error resolution
- **tester**: Test creation, test execution
- **reviewer**: Code review, quality checks
- **writer**: Documentation, README updates

## Example

User: "Fix the login bug"

1. Identify: Bug fixing task
2. Choose: debugger subagent
3. Delegate: use_subagent with debugger
4. Monitor: Track progress
5. Return: Bug fix results
```

**.kiro/steering/tech.md**
```markdown
# Technology Stack

## Frontend
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend
- Node.js
- Express
- PostgreSQL

## Testing
- Jest
- React Testing Library

## Tools
- Figma (design)
- GitHub (version control)
```

### Prompts

**.kiro/prompts/orchestrator.md**
```markdown
You are an orchestrator. Your role is to delegate tasks to specialized subagents.

## Core Principle

**Never work directly. Always delegate.**

## Workflow

1. Analyze user request
2. Identify task type
3. Select appropriate subagent
4. Delegate using use_subagent
5. Return results

## Subagent Selection

- Code implementation → executor
- Bug fixing → debugger
- Testing → tester
- Code review → reviewer
- Documentation → writer

## Example

User: "Implement login form"

Response:
"I'll delegate this to the executor subagent for implementation."

[use_subagent with executor]
```

**.kiro/prompts/executor.md**
```markdown
You are a code implementation specialist.

## Responsibilities

- Implement new features
- Refactor existing code
- Follow project conventions
- Use appropriate libraries

## Process

1. Read relevant files
2. Understand requirements
3. Implement solution
4. Test changes
5. Return results

## Guidelines

- Follow steering files
- Use project tech stack
- Write clean, maintainable code
- Include comments where needed
```

### MCP 설정

**~/.kiro/settings/mcp.json**
```json
{
  "mcpServers": {
    "Figma Desktop": {
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

### 설치 구조

```
oh-my-kiro/
├── agents/
│   ├── default.json          # Orchestrator
│   ├── executor.json         # Code implementation
│   ├── debugger.json         # Bug fixing
│   ├── tester.json           # Testing
│   ├── reviewer.json         # Code review
│   └── writer.json           # Documentation
├── prompts/
│   ├── orchestrator.md
│   ├── executor.md
│   ├── debugger.md
│   ├── tester.md
│   ├── reviewer.md
│   └── writer.md
├── steering/
│   ├── orchestration.md
│   └── tech.md
├── AGENTS.md                 # 워크스페이스 루트용
└── src/cli/
    └── commands.ts           # Setup command
```

## 핵심 차이점 (v1 vs v2)

### v1 (이전)
- ❌ 복잡한 Ralph 루프
- ❌ 16개 스킬
- ❌ 10개 에이전트
- ❌ 7개 steering 파일
- ❌ 커스텀 오케스트레이션 로직
- ❌ MCP 설정 복잡

### v2 (새로운)
- ✅ Kiro 공식 use_subagent 사용
- ✅ 스킬 제거 (불필요)
- ✅ 6개 에이전트 (orchestrator + 5 specialists)
- ✅ 3개 steering 파일 (AGENTS.md, orchestration.md, tech.md)
- ✅ Kiro 네이티브 패턴
- ✅ includeMcpJson + allowedTools

## 구현 계획

1. **에이전트 재작성** (6개)
2. **프롬프트 작성** (6개)
3. **Steering 파일 작성** (3개)
4. **Setup 명령어 수정**
5. **테스트**

## 예상 동작

```bash
# 설치
omk setup

# 사용
kiro-cli chat
# [default] 오케스트레이터 활성화

> 로그인 폼 구현해줘

[orchestrator]
"executor 서브에이전트에게 위임합니다."

[use_subagent: executor]
"로그인 폼을 구현하겠습니다."
- LoginForm.tsx 생성
- 스타일링 적용
- 유효성 검사 추가

[orchestrator]
"구현이 완료되었습니다."
```

## 다음 단계

1. v2 에이전트 JSON 작성
2. 프롬프트 파일 작성
3. Steering 파일 작성
4. Setup 명령어 수정
5. 테스트 및 검증
