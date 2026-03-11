# Oh My Kiro - 커스터마이징 가이드

## 스킬 추가하기

### 방법 1: 직접 생성

`~/.kiro/skills/my-skill/SKILL.md`:

```markdown
---
name: my-skill
description: "내 커스텀 스킬 설명. 트리거: $my-skill, 트리거1, 트리거2"
---

# 내 스킬 이름

스킬 설명

## 사용법

\`\`\`
$my-skill "작업 설명"
\`\`\`

## 워크플로우

1. 단계 1
2. 단계 2
3. 단계 3

## 규칙

- **모든 응답은 한국어로 작성**
- 추가 규칙들
```

### 방법 2: 외부 스킬 설치 (skills.sh 등)

#### omk add-skill 명령어 사용 (권장)

**전역 설치 (모든 프로젝트에서 사용):**

```bash
# 특정 스킬 설치
omk add-skill https://github.com/vercel-labs/skills --skill find-skills

# 저장소의 모든 스킬 설치
omk add-skill https://github.com/user/awesome-skills

# 바로 사용 (재시작 불필요!)
$find-skills "검색"
```

**로컬 설치 (현재 프로젝트만):**

```bash
# 프로젝트 전용 스킬 설치
omk add-skill https://github.com/user/experimental-skill --skill custom --local

# 바로 사용 (재시작 불필요!)
$custom "작업"
```

**장점:**
- ✅ 자동으로 올바른 위치에 설치
- ✅ 중복 확인
- ✅ 설치 후 바로 사용 가능
- ✅ 전역/로컬 선택 가능

**스킬 우선순위:**
1. `.omk/skills/` (로컬 - 프로젝트 전용)
2. `~/.kiro/skills/` (전역 - 모든 프로젝트)

**스킬 목록 확인:**

```bash
omk list-skills
```

#### 수동 설치

```bash
# 다운로드한 스킬 디렉토리를 ~/.kiro/skills/로 복사
cp -r downloaded-skill ~/.kiro/skills/

# 또는 심볼릭 링크 생성
ln -s /path/to/downloaded-skill ~/.kiro/skills/downloaded-skill

# 바로 사용 가능 (재시작 불필요!)
$downloaded-skill "작업"
```

#### Git에서 직접 클론

```bash
# 스킬 저장소 클론
cd ~/.kiro/skills/
git clone https://github.com/user/awesome-skill.git

# 바로 사용 (재시작 불필요!)
$awesome-skill "작업"
```

### 방법 3: Oh My Kiro 프로젝트에 포함

프로젝트에 영구적으로 포함하려면:

```bash
# 1. oh-my-kiro/skills/에 추가
cp -r downloaded-skill oh-my-kiro/skills/

# 2. 빌드 및 재설치
cd oh-my-kiro
npm run build
omk setup

# 3. 사용
kiro-cli chat
```

```
$downloaded-skill "작업"
```

## 에이전트 추가하기

### 1. 에이전트 파일 생성

`~/.kiro/agents/my-agent.md`:

```markdown
# My Agent 에이전트

당신은 [역할 설명] 에이전트입니다.

## 역할

- 역할 1
- 역할 2

## 접근 방식

1. 단계 1
2. 단계 2

## 출력

- 출력 형식

## 제약

- 제약사항

## 도구 (allowedTools)

- `fs_read` - 파일 읽기
- `fs_write` - 파일 쓰기
- `execute_bash` - 명령 실행
- `code` - 코드 분석
- `grep` - 검색
- `use_subagent` - 하위 작업 위임

## 리소스 (resources)

- `.omk/steering/PROJECT.md`
- `.omk/config.json`
- `.omk/state/`

## 규칙

- **모든 응답은 한국어로 작성**
- 추가 규칙들
```

### 2. 설정 파일에 등록

`.omk/config.json`:

```json
{
  "agents": {
    "my-agent": {
      "complexity": "medium",
      "focus": "내 작업",
      "model": "claude-sonnet-4",
      "allowedTools": [
        "fs_read",
        "fs_write",
        "execute_bash",
        "code"
      ],
      "resources": [
        ".omk/steering/PROJECT.md",
        ".omk/config.json"
      ]
    }
  }
}
```

### 3. 사용하기

```bash
# 팀 모드에서
omk team 2:my-agent "작업"

# Kiro 세션에서 use_subagent로
{
  "command": "InvokeSubagents",
  "content": {
    "subagents": [
      {
        "query": "my-agent로서 작업 수행",
        "agent_name": "default"
      }
    ]
  }
}
```

## 모델 지정

### 지원되는 모델 형식

```json
{
  "agents": {
    "my-agent": {
      "model": "claude-sonnet-4"
    }
  }
}
```

**지원 형식:**
- `"claude-sonnet-4"` ✅
- `"claude-opus-4"` ✅
- `"claude-haiku-4"` ✅
- `"claude-sonnet-4-20250514"` ✅ (전체 버전)
- `"gpt-4"` ✅ (Kiro가 지원하는 경우)

### CLI에서 모델 지정

```bash
# 팀 시작 시
omk team 3:executor "작업" --model claude-sonnet-4

# 또는 전체 버전
omk team 3:executor "작업" --model claude-sonnet-4-20250514
```

### 복잡도별 권장 모델

```json
{
  "agents": {
    "architect": {
      "complexity": "high",
      "model": "claude-opus-4"
    },
    "executor": {
      "complexity": "medium",
      "model": "claude-sonnet-4"
    },
    "verifier": {
      "complexity": "low",
      "model": "claude-haiku-4"
    }
  }
}
```

## allowedTools 설정

### 사용 가능한 도구

```json
{
  "allowedTools": [
    "fs_read",           // 파일 읽기
    "fs_write",          // 파일 쓰기
    "execute_bash",      // 명령 실행
    "code",              // 코드 분석 (LSP)
    "grep",              // 텍스트 검색
    "glob",              // 파일 패턴 검색
    "use_subagent",      // 하위 에이전트 생성
    "web_fetch",         // 웹 페이지 가져오기
    "web_search"         // 웹 검색
  ]
}
```

### 역할별 권장 도구

**Architect (분석가)**
```json
{
  "allowedTools": ["fs_read", "code", "grep", "use_subagent"]
}
```

**Executor (구현자)**
```json
{
  "allowedTools": ["fs_read", "fs_write", "execute_bash", "code", "use_subagent"]
}
```

**Verifier (검증자)**
```json
{
  "allowedTools": ["fs_read", "execute_bash", "code"]
}
```

**Debugger (디버거)**
```json
{
  "allowedTools": ["fs_read", "execute_bash", "code", "grep"]
}
```

## resources 설정

### 접근 가능한 리소스 지정

```json
{
  "resources": [
    ".omk/steering/PROJECT.md",    // Steering 문서
    ".omk/config.json",            // 설정 파일
    ".omk/state/",                 // 상태 디렉토리
    ".omk/plans/",                 // 계획 디렉토리
    ".omk/logs/",                  // 로그 디렉토리
    ".omk/notepad.md",             // 노트패드
    "src/",                        // 소스 코드
    "docs/"                        // 문서
  ]
}
```

### 역할별 권장 리소스

**Architect**
```json
{
  "resources": [
    ".omk/steering/PROJECT.md",
    ".omk/config.json",
    "docs/",
    "README.md"
  ]
}
```

**Executor**
```json
{
  "resources": [
    ".omk/steering/PROJECT.md",
    ".omk/state/",
    "src/",
    "tests/"
  ]
}
```

**Planner**
```json
{
  "resources": [
    ".omk/steering/PROJECT.md",
    ".omk/plans/",
    "docs/"
  ]
}
```

## 전체 예시

### 커스텀 에이전트: API 전문가

**1. 에이전트 파일** (`~/.kiro/agents/api-specialist.md`):

```markdown
# API Specialist 에이전트

당신은 API 설계 및 구현 전문가입니다.

## 역할

- RESTful API 설계
- GraphQL 스키마 설계
- API 문서 작성
- API 보안 검토

## 도구 (allowedTools)

- `fs_read`
- `fs_write`
- `execute_bash`
- `code`
- `use_subagent`

## 리소스 (resources)

- `.omk/steering/PROJECT.md`
- `src/api/`
- `docs/api/`

## 규칙

- **모든 응답은 한국어로 작성**
- OpenAPI 3.0 표준 준수
- 보안 best practices 적용
```

**2. 설정 파일** (`.omk/config.json`):

```json
{
  "agents": {
    "api-specialist": {
      "complexity": "medium",
      "focus": "API 설계 및 구현",
      "model": "claude-sonnet-4",
      "allowedTools": [
        "fs_read",
        "fs_write",
        "execute_bash",
        "code",
        "use_subagent"
      ],
      "resources": [
        ".omk/steering/PROJECT.md",
        "src/api/",
        "docs/api/"
      ]
    }
  }
}
```

**3. 사용**:

```bash
omk team 2:api-specialist "REST API 엔드포인트 설계 및 구현"
```

## 커스텀 스킬: 코드 리뷰

**1. 스킬 파일** (`~/.kiro/skills/code-review/SKILL.md`):

```markdown
---
name: code-review
description: "코드 리뷰 수행. 품질, 보안, 성능 검토. 트리거: $code-review, 코드 리뷰, 리뷰"
---

# 코드 리뷰

코드 품질, 보안, 성능을 검토하는 종합 리뷰

## 사용법

\`\`\`
$code-review "PR #123 리뷰"
$code-review "src/auth/ 디렉토리 리뷰"
\`\`\`

## 워크플로우

1. `architect`로 아키텍처 검토
2. `security-reviewer`로 보안 검토
3. `executor`로 코드 품질 검토
4. 종합 리포트 생성

## 규칙

- **모든 응답은 한국어로 작성**
- 우선순위별로 이슈 분류 (P0, P1, P2)
- 구체적인 개선 제안 포함
```

**2. 사용**:

```bash
kiro-cli chat
```

```
$code-review "src/api/ 디렉토리 전체 리뷰"
```

## 팁

### 1. 스킬 테스트

```bash
# 스킬 파일 생성 후
kiro-cli chat

# 바로 테스트
$my-skill "테스트 작업"
```

### 2. 에이전트 테스트

```bash
# 설정 파일 수정 후
omk team 1:my-agent "간단한 테스트 작업"
```

### 3. 모델 변경

```bash
# 일회성 변경
omk team 2:executor "작업" --model claude-opus-4

# 영구 변경: .omk/config.json 수정
```

### 4. 도구 권한 확인

에이전트가 특정 도구를 사용하지 못하면:
1. `.omk/config.json`에서 `allowedTools` 확인
2. 필요한 도구 추가
3. `omk setup` 재실행 (선택사항)

### 5. 리소스 접근 확인

에이전트가 특정 파일/디렉토리에 접근하지 못하면:
1. `.omk/config.json`에서 `resources` 확인
2. 필요한 경로 추가
3. 상대 경로 또는 절대 경로 사용 가능
