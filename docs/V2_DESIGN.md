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

1. **Kiro CLI 공식 패턴 준수** (use_subagent, steering, MCP)
2. **v1 핵심 기능 유지** (스킬, Ralph 루프, 다중 에이전트)
3. **Oh My 시리즈 호환** (서브 에이전트 오케스트레이션)
4. **Steering 기반 작업 가이드**
5. **최소한의 복잡도**

### 아키텍처

```
orchestrator (default)
├── use_subagent 도구 사용 (Kiro 공식)
├── AGENTS.md 자동 로드
├── steering 파일 자동 로드
│   ├── skills/ (워크플로우 스킬)
│   ├── guides/ (작업 가이드)
│   └── standards/ (코딩 표준)
├── Ralph 루프 실행
└── 서브에이전트 위임
    ├── executor (코드 구현)
    ├── debugger (버그 수정)
    ├── tester (테스트)
    ├── reviewer (코드 리뷰)
    ├── architect (아키텍처)
    ├── planner (계획)
    └── writer (문서)
```

### 핵심 기능

**1. Subagent Orchestration (Kiro 공식)**
- `use_subagent` 도구 사용
- 최대 4개 병렬 실행
- trustedAgents 설정으로 자동 승인

**2. Skills (v1 유지)**
- Steering 파일로 구현
- `.kiro/steering/skills/` 디렉토리
- 각 스킬은 markdown 파일
- 에이전트가 참조하여 실행

**3. Ralph Loop (v1 유지)**
- Steering 파일로 로직 정의
- `.kiro/steering/ralph-loop.md`
- 검증 → 수정 → 재검증 반복
- 완료까지 자동 실행

**4. Steering Structure**
```
.kiro/steering/
├── orchestration.md      # 오케스트레이션 규칙
├── ralph-loop.md         # Ralph 루프 로직
├── skills/               # 워크플로우 스킬
│   ├── team.md          # 팀 모드
│   ├── autopilot.md     # 자동 조종
│   ├── plan.md          # 계획 수립
│   └── tdd.md           # TDD 워크플로우
├── guides/               # 작업 가이드
│   ├── implementation.md # 구현 가이드
│   ├── debugging.md      # 디버깅 가이드
│   └── testing.md        # 테스트 가이드
└── standards/            # 코딩 표준
    ├── tech-stack.md     # 기술 스택
    ├── code-style.md     # 코드 스타일
    └── api-design.md     # API 설계
```

### 에이전트 구성

**1. orchestrator (default)**
```json
{
  "name": "default",
  "description": "Orchestrator with Ralph loop and skill execution",
  "prompt": "file://.kiro/prompts/orchestrator.md",
  "tools": ["fs_read", "fs_write", "code", "grep", "glob", "execute_bash", "use_subagent"],
  "allowedTools": ["fs_read", "code", "grep", "glob", "use_subagent"],
  "toolsSettings": {
    "subagent": {
      "availableAgents": ["executor", "debugger", "tester", "reviewer", "architect", "planner", "writer"],
      "trustedAgents": ["executor", "debugger", "tester", "reviewer", "architect", "planner", "writer"]
    },
    "execute_bash": {
      "autoAllowReadonly": true
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
  "description": "Code implementation specialist with MCP access",
  "prompt": "file://.kiro/prompts/executor.md",
  "tools": ["fs_read", "fs_write", "code", "grep", "glob", "execute_bash"],
  "allowedTools": ["fs_read", "fs_write", "code", "grep", "glob", "execute_bash", "@*"],
  "toolsSettings": {
    "execute_bash": {
      "autoAllowReadonly": true
    }
  },
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
  "description": "Bug fixing and error resolution specialist",
  "prompt": "file://.kiro/prompts/debugger.md",
  "tools": ["fs_read", "fs_write", "code", "grep", "glob", "execute_bash"],
  "allowedTools": ["fs_read", "fs_write", "code", "grep", "glob", "execute_bash"],
  "toolsSettings": {
    "execute_bash": {
      "autoAllowReadonly": true
    }
  },
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
  "toolsSettings": {
    "execute_bash": {
      "autoAllowReadonly": true
    }
  },
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
  "description": "Code review and quality assurance specialist",
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

**6. architect (서브에이전트)**
```json
{
  "name": "architect",
  "description": "System architecture and design specialist",
  "prompt": "file://.kiro/prompts/architect.md",
  "tools": ["fs_read", "code", "grep", "glob"],
  "allowedTools": ["fs_read", "code", "grep", "glob"],
  "resources": [
    "file://.kiro/steering/**/*.md"
  ],
  "includeMcpJson": true,
  "model": "claude-opus-4.6"
}
```

**7. planner (서브에이전트)**
```json
{
  "name": "planner",
  "description": "Task planning and breakdown specialist",
  "prompt": "file://.kiro/prompts/planner.md",
  "tools": ["fs_read", "code", "grep", "glob"],
  "allowedTools": ["fs_read", "code", "grep", "glob"],
  "resources": [
    "file://.kiro/steering/**/*.md"
  ],
  "includeMcpJson": true,
  "model": "claude-sonnet-4.5"
}
```

**8. writer (서브에이전트)**
```json
{
  "name": "writer",
  "description": "Documentation and technical writing specialist",
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

This project uses Oh My Kiro v2 orchestration system.

## Orchestrator (default)

The default agent orchestrates work using:
- **Subagent delegation** via use_subagent
- **Ralph loop** for verification and iteration
- **Skills** for complex workflows
- **Steering files** for guidance

## Available Subagents

- **executor**: Code implementation, refactoring
- **debugger**: Bug fixing, error resolution
- **tester**: Test design and execution
- **reviewer**: Code review, quality checks
- **architect**: System design, architecture
- **planner**: Task planning, breakdown
- **writer**: Documentation, README

## Skills

Skills are workflows defined in `.kiro/steering/skills/`:
- `$team`: Parallel team execution
- `$autopilot`: Autonomous feature implementation
- `$plan`: Detailed planning
- `$tdd`: Test-driven development

## Ralph Loop

All tasks run through Ralph loop:
1. Execute task
2. Verify results
3. If issues found, fix and repeat
4. Continue until complete

The orchestrator automatically applies Ralph loop to all delegated tasks.
```

**.kiro/steering/orchestration.md**
```markdown
# Orchestration Rules

## Core Principle

You are an orchestrator. Delegate tasks to specialized subagents using `use_subagent`.

## Delegation Pattern

1. **Analyze** user request
2. **Choose** appropriate subagent(s)
3. **Delegate** using use_subagent
4. **Apply Ralph loop** for verification
5. **Return** results

## Subagent Selection

- **executor**: File modifications, code implementation, refactoring
- **debugger**: Bug fixes, error resolution, debugging
- **tester**: Test creation, test execution, TDD
- **reviewer**: Code review, quality checks, best practices
- **architect**: System design, architecture decisions, tech stack
- **planner**: Task breakdown, planning, estimation
- **writer**: Documentation, README, comments

## Parallel Execution

For complex tasks, delegate to multiple subagents:

```json
{
  "command": "InvokeSubagents",
  "content": {
    "subagents": [
      {
        "query": "executor: Implement login form",
        "agent_name": "executor"
      },
      {
        "query": "tester: Create tests for login",
        "agent_name": "tester"
      }
    ]
  }
}
```

## Ralph Loop Integration

After subagent completes:
1. Verify results (run tests, check output)
2. If issues found, delegate fix to appropriate subagent
3. Repeat until all checks pass
4. Return final results

## Skill Execution

When user requests skill (e.g., `$team`, `$autopilot`):
1. Read skill definition from `.kiro/steering/skills/`
2. Follow skill workflow
3. Delegate to subagents as needed
4. Apply Ralph loop
5. Return results
```

**.kiro/steering/ralph-loop.md**
```markdown
# Ralph Loop

Ralph loop ensures task completion through verification and iteration.

## Process

```
1. Execute Task
   ↓
2. Verify Results
   ├─ Success → Done
   └─ Issues Found
      ↓
3. Analyze Issues
   ↓
4. Fix Issues
   ↓
5. Go to Step 2
```

## Verification Methods

**Code Changes:**
- Run tests
- Check syntax
- Verify functionality

**Bug Fixes:**
- Reproduce bug
- Verify fix
- Run regression tests

**New Features:**
- Test all paths
- Check edge cases
- Verify requirements

## Iteration Limit

- Maximum 5 iterations
- If not resolved, escalate to user

## Example

User: "Fix login bug"

1. **Execute**: debugger fixes bug
2. **Verify**: Run tests → 1 test fails
3. **Analyze**: Missing validation
4. **Fix**: debugger adds validation
5. **Verify**: Run tests → All pass ✓
6. **Done**: Return results
```

**.kiro/steering/skills/team.md**
```markdown
# Team Skill

Parallel execution with multiple subagents.

## Usage

`$team <count>:<role> <task>`

Example: `$team 3:executor Implement user dashboard`

## Workflow

1. **Parse** team specification
   - Count: Number of parallel workers
   - Role: Subagent type
   - Task: Work to distribute

2. **Plan** work distribution
   - Break task into parallel subtasks
   - Assign to workers

3. **Execute** in parallel
   - Spawn subagents (max 4)
   - Monitor progress
   - Collect results

4. **Integrate** results
   - Merge changes
   - Resolve conflicts
   - Verify integration

5. **Ralph loop** on integrated result
   - Test everything
   - Fix issues
   - Repeat until complete

## Example

`$team 3:executor Refactor components`

1. Plan:
   - Worker 1: Button, Input components
   - Worker 2: Modal, Dialog components
   - Worker 3: Form, Select components

2. Execute:
   - 3 executor subagents work in parallel
   - Each refactors assigned components

3. Integrate:
   - Merge all changes
   - Check for conflicts

4. Verify:
   - Run all tests
   - Fix any issues
   - Complete
```

**.kiro/steering/skills/autopilot.md**
```markdown
# Autopilot Skill

Autonomous feature implementation from description to deployment.

## Usage

`$autopilot <feature description>`

Example: `$autopilot User authentication with JWT`

## Workflow

1. **Plan** (planner subagent)
   - Analyze requirements
   - Break down tasks
   - Identify dependencies
   - Create implementation plan

2. **Design** (architect subagent)
   - System architecture
   - API design
   - Data models
   - Tech stack decisions

3. **Implement** (executor subagent)
   - Write code
   - Follow plan
   - Apply best practices

4. **Test** (tester subagent)
   - Unit tests
   - Integration tests
   - Edge cases

5. **Review** (reviewer subagent)
   - Code quality
   - Best practices
   - Security checks

6. **Document** (writer subagent)
   - README updates
   - API documentation
   - Code comments

7. **Ralph loop** on entire feature
   - Run all tests
   - Fix issues
   - Repeat until complete

## Example

`$autopilot Password reset flow`

1. planner: Break down into tasks
2. architect: Design email service, token system
3. executor: Implement endpoints, UI
4. tester: Create comprehensive tests
5. reviewer: Check security, best practices
6. writer: Document API, update README
7. Ralph loop: Verify everything works
```

**.kiro/steering/skills/plan.md**
```markdown
# Plan Skill

Detailed task planning and breakdown.

## Usage

`$plan <task description>`

Example: `$plan Implement shopping cart`

## Workflow

1. **Analyze** requirements
   - What needs to be built
   - User stories
   - Acceptance criteria

2. **Break down** into subtasks
   - Frontend components
   - Backend APIs
   - Database changes
   - Tests

3. **Identify** dependencies
   - What must be done first
   - What can be parallel
   - External dependencies

4. **Estimate** complexity
   - Simple, medium, complex
   - Time estimates
   - Risk assessment

5. **Create** execution plan
   - Step-by-step tasks
   - Recommended subagents
   - Verification steps

6. **Present** plan to user
   - Clear structure
   - Actionable tasks
   - Ready for execution

## Output Format

```markdown
# Implementation Plan: <Feature>

## Overview
- Description
- Goals
- Success criteria

## Tasks

### 1. <Task Name>
- **Subagent**: executor
- **Complexity**: Medium
- **Dependencies**: None
- **Steps**:
  1. Step 1
  2. Step 2

### 2. <Task Name>
...

## Execution Order
1. Task 1 (no dependencies)
2. Task 2, 3 (parallel)
3. Task 4 (depends on 2, 3)

## Verification
- Test 1
- Test 2
```
```

**.kiro/steering/skills/tdd.md**
```markdown
# TDD Skill

Test-driven development workflow.

## Usage

`$tdd <feature description>`

Example: `$tdd User registration form`

## Workflow

1. **Write test** (tester subagent)
   - Define expected behavior
   - Write failing test
   - Verify test fails

2. **Implement** (executor subagent)
   - Write minimal code to pass test
   - Follow test requirements
   - Keep it simple

3. **Verify** (Ralph loop)
   - Run test
   - Should pass now
   - If not, fix and repeat

4. **Refactor** (executor subagent)
   - Improve code quality
   - Keep tests passing
   - Apply best practices

5. **Repeat** for next feature
   - Add more tests
   - Implement
   - Refactor

## Red-Green-Refactor Cycle

```
Red (Test Fails)
  ↓
Green (Test Passes)
  ↓
Refactor (Improve Code)
  ↓
Repeat
```

## Example

`$tdd Email validation`

1. **Red**: tester writes test for email validation
   - Test fails (no implementation)

2. **Green**: executor implements validation
   - Test passes

3. **Refactor**: executor improves code
   - Extract validation logic
   - Add error messages
   - Tests still pass

4. **Next**: Add more test cases
   - Invalid formats
   - Edge cases
   - Repeat cycle
```

**.kiro/steering/guides/implementation.md**
```markdown
# Implementation Guide

Guidelines for code implementation.

## Process

1. **Understand** requirements
   - Read task description
   - Check acceptance criteria
   - Ask questions if unclear

2. **Plan** approach
   - Choose appropriate patterns
   - Consider edge cases
   - Think about testing

3. **Implement** solution
   - Write clean code
   - Follow project conventions
   - Add comments where needed

4. **Test** thoroughly
   - Unit tests
   - Integration tests
   - Manual testing

5. **Review** own code
   - Check for issues
   - Verify best practices
   - Ensure quality

## Best Practices

- Follow steering files
- Use project tech stack
- Write self-documenting code
- Handle errors properly
- Consider performance
- Think about security
```

**.kiro/steering/guides/debugging.md**
```markdown
# Debugging Guide

Systematic approach to bug fixing.

## Process

1. **Reproduce** bug
   - Understand steps
   - Verify it exists
   - Document behavior

2. **Isolate** cause
   - Check logs
   - Add debug output
   - Narrow down location

3. **Analyze** root cause
   - Why does it happen
   - What's the fix
   - Are there related issues

4. **Fix** issue
   - Implement solution
   - Test fix
   - Verify no regressions

5. **Prevent** recurrence
   - Add tests
   - Improve error handling
   - Document learnings

## Debugging Tools

- Console logs
- Debugger
- Error messages
- Stack traces
- Tests
```

**.kiro/steering/guides/testing.md**
```markdown
# Testing Guide

Comprehensive testing approach.

## Test Types

**Unit Tests**
- Test individual functions
- Mock dependencies
- Fast execution

**Integration Tests**
- Test component interaction
- Real dependencies
- More comprehensive

**E2E Tests**
- Test full user flows
- Real environment
- Catch integration issues

## Writing Good Tests

1. **Arrange**: Set up test data
2. **Act**: Execute code
3. **Assert**: Verify results

## Test Coverage

- Aim for 80%+ coverage
- Focus on critical paths
- Test edge cases
- Test error handling

## Best Practices

- One assertion per test
- Clear test names
- Independent tests
- Fast execution
- Reliable results
```

**.kiro/steering/standards/tech-stack.md**
```markdown
# Technology Stack

## Frontend
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components

## Backend
- Node.js
- Express
- PostgreSQL
- Prisma ORM

## Testing
- Jest
- React Testing Library
- Playwright (E2E)

## Tools
- Figma (design)
- GitHub (version control)
- GitHub Actions (CI/CD)

## Conventions

- Use TypeScript for all code
- Follow React best practices
- Use Tailwind for styling
- Prefer shadcn/ui components
```

**.kiro/steering/standards/code-style.md**
```markdown
# Code Style

## General

- Use TypeScript
- 2 spaces indentation
- Single quotes for strings
- Semicolons required
- Max line length: 100

## Naming

- camelCase for variables/functions
- PascalCase for components/classes
- UPPER_CASE for constants
- kebab-case for files

## File Organization

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   └── features/     # Feature components
├── lib/              # Utilities
├── hooks/            # Custom hooks
├── types/            # TypeScript types
└── app/              # Pages/routes
```

## Best Practices

- Keep functions small
- Single responsibility
- Descriptive names
- Add comments for complex logic
- Extract reusable code
```

**.kiro/steering/standards/api-design.md**
```markdown
# API Design

## REST Conventions

- GET: Retrieve data
- POST: Create resource
- PUT: Update resource
- DELETE: Remove resource

## Endpoints

```
GET    /api/users          # List users
GET    /api/users/:id      # Get user
POST   /api/users          # Create user
PUT    /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user
```

## Response Format

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

## Error Handling

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format"
  }
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 500: Server error
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
- ✅ 멀티 에이전트 (10개)
- ✅ 스킬 시스템 (16개)
- ✅ Ralph 루프
- ❌ 커스텀 오케스트레이션 (Kiro 비표준)
- ❌ 복잡한 상태 관리
- ❌ 이벤트 캡처 시스템
- ❌ MCP 설정 복잡

### v2 (새로운)
- ✅ 멀티 에이전트 (8개) - Kiro 공식 패턴
- ✅ 스킬 시스템 (Steering 파일로 구현)
- ✅ Ralph 루프 (Steering 파일로 정의)
- ✅ Kiro 네이티브 use_subagent
- ✅ Steering 기반 가이드
- ✅ 간단한 구조
- ✅ includeMcpJson + allowedTools

### 주요 개선사항

**1. Kiro 공식 패턴 사용**
- `use_subagent` 도구 (Kiro 네이티브)
- Steering 파일 (Kiro 공식)
- AGENTS.md (Kiro 표준)

**2. 스킬을 Steering으로**
- v1: 별도 스킬 파일 + 메타데이터
- v2: `.kiro/steering/skills/*.md`
- 에이전트가 자동으로 읽고 실행

**3. Ralph 루프 간소화**
- v1: 복잡한 상태 관리, 이벤트 시스템
- v2: Steering 파일로 로직 정의
- 에이전트가 자연스럽게 적용

**4. 구조 단순화**
- v1: 복잡한 디렉토리 구조
- v2: Steering 중심 구조
- 모든 가이드가 한 곳에

## 예상 동작

### 기본 사용

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
- 스타일링 적용 (Tailwind + shadcn/ui)
- 유효성 검사 추가

[orchestrator - Ralph loop]
"검증 중..."
- 테스트 실행 → 통과 ✓
- 타입 체크 → 통과 ✓

[orchestrator]
"구현이 완료되었습니다."
```

### 스킬 사용

```bash
> $team 3:executor 대시보드 컴포넌트 리팩토링

[orchestrator]
"Team 스킬을 실행합니다."

1. 작업 분배:
   - Worker 1: Header, Sidebar
   - Worker 2: Dashboard, Stats
   - Worker 3: Charts, Tables

2. 병렬 실행:
   [executor #1] Header, Sidebar 리팩토링
   [executor #2] Dashboard, Stats 리팩토링
   [executor #3] Charts, Tables 리팩토링

3. 통합:
   - 변경사항 병합
   - 충돌 해결

4. Ralph loop:
   - 모든 테스트 실행 → 통과 ✓
   - 타입 체크 → 통과 ✓

[orchestrator]
"리팩토링이 완료되었습니다."
```

### Autopilot 사용

```bash
> $autopilot 비밀번호 재설정 기능

[orchestrator]
"Autopilot 스킬을 실행합니다."

1. [planner] 계획 수립
   - 이메일 발송 시스템
   - 토큰 생성/검증
   - UI 구현
   - 테스트

2. [architect] 설계
   - API 엔드포인트 설계
   - 데이터베이스 스키마
   - 보안 고려사항

3. [executor] 구현
   - 백엔드 API
   - 프론트엔드 UI
   - 이메일 템플릿

4. [tester] 테스트
   - 단위 테스트
   - 통합 테스트
   - E2E 테스트

5. [reviewer] 리뷰
   - 코드 품질 체크
   - 보안 검토
   - 베스트 프랙티스

6. [writer] 문서화
   - API 문서
   - README 업데이트

7. Ralph loop:
   - 모든 검증 통과 ✓

[orchestrator]
"비밀번호 재설정 기능이 완료되었습니다."
```

### TDD 사용

```bash
> $tdd 이메일 유효성 검사

[orchestrator]
"TDD 스킬을 실행합니다."

1. Red: [tester] 테스트 작성
   - 유효한 이메일 테스트
   - 테스트 실행 → 실패 ✓

2. Green: [executor] 구현
   - 유효성 검사 로직
   - 테스트 실행 → 통과 ✓

3. Refactor: [executor] 개선
   - 코드 정리
   - 에러 메시지 개선
   - 테스트 실행 → 통과 ✓

4. 추가 케이스:
   - 잘못된 형식 테스트
   - 엣지 케이스 테스트
   - Red-Green-Refactor 반복

[orchestrator]
"TDD 완료. 모든 테스트 통과."
```

## 다음 단계

1. v2 에이전트 JSON 작성
2. 프롬프트 파일 작성
3. Steering 파일 작성
4. Setup 명령어 수정
5. 테스트 및 검증
