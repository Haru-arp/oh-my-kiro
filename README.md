# Oh My Kiro (OMK)

Kiro CLI를 위한 멀티 에이전트 오케스트레이션 레이어. [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)에서 영감을 받아 Kiro에 최적화.

## 빠른 시작

```bash
# 1. 설치 (한 번만)
git clone <repo-url> oh-my-kiro
cd oh-my-kiro
npm install && npm run build && npm link

# 2. 프로젝트에서 사용
cd ~/my-project
omk setup
omk doctor

# 3. Kiro 시작
kiro-cli chat
# → Oh My Kiro의 default 에이전트가 자동 활성화됨
# → 왼쪽 상단에 [default] 표시 확인

# 4. 스킬 사용
$team 3:executor "작업"
$autopilot "기능 구현"
```

**중요:** `omk setup`은 `.kiro/settings.json`을 생성하여 Oh My Kiro의 `default` 에이전트를 자동으로 활성화합니다. Built-in `kiro_default`가 아닌 Oh My Kiro의 오케스트레이터가 사용됩니다.

자세한 내용: [GETTING_STARTED.md](GETTING_STARTED.md)

## 특징

- 🤖 **멀티 에이전트 조정** - 10개 전문 에이전트 (default, architect, executor 등)
- 🎯 **Steering 시스템** - 7개 분리된 steering 파일로 구조화
- 🔧 **도구 및 리소스 관리** - 에이전트별 allowedTools 및 resources 설정
- 🔄 **워크플로우 스킬** - 15개 스킬 (team, autopilot, ralph 등)
- 📊 **상태 관리** - 파일 기반 영속화
- ⚙️ **완전 커스터마이징** - 모든 설정 수정 가능
- 🇰🇷 **한국어 우선** - 모든 문서 및 응답 한국어

## 에이전트

**10개 전문 에이전트 (JSON 형식):**

- `default` - 오케스트레이터 (자동 위임 및 조정, steering 규칙 유지)
- `architect` - 시스템 아키텍처 분석 및 설계
- `planner` - 작업 분해 및 계획 수립
- `executor` - 코드 구현 및 리팩토링
- `debugger` - 버그 수정 및 디버깅
- `verifier` - 테스트 실행 및 검증
- `test-engineer` - 테스트 설계 및 구현
- `security-reviewer` - 보안 감사 및 취약점 분석
- `explore` - 코드베이스 탐색
- `writer` - 문서 작성

**사용법:**
```bash
kiro-cli --agent executor  # 특정 에이전트로 시작
# 또는 Kiro 안에서
> /agent swap              # 에이전트 전환
```

## Steering 파일

**7개 분리된 steering 문서:**

- `PROJECT.md` - 전체 구조 및 인덱스
- `PRINCIPLES.md` - 기본 원칙 및 작업 규칙
- `AGENTS.md` - 에이전트 역할 및 모델 설정
- `ORCHESTRATION.md` - 오케스트레이션 및 위임 규칙
- `RALPH.md` - Ralph 루프 규칙
- `SKILLS.md` - 워크플로우 스킬
- `VERIFICATION.md` - 검증 및 상태 관리

**장점:**
- `/clear` 후에도 규칙 유지 (default 에이전트가 자동 로드)
- 역할별로 분리되어 관리 용이
- 프로젝트별 커스터마이징 가능

## Kiro 구조

```
~/.kiro/
├── steering/          # Steering 문서 (프로젝트 규칙)
│   └── PROJECT.md
├── agents/            # 에이전트 정의 (JSON 형식)
│   ├── executor.json
│   ├── architect.json
│   └── ...
├── skills/            # 워크플로우 스킬
│   ├── team/
│   ├── autopilot/
│   └── ...
└── settings/          # Kiro 설정
    └── cli.json

.omk/                  # 프로젝트별 상태
├── state/             # 모드 상태
├── plans/             # 실행 계획
├── logs/              # 로그
└── skills/            # 로컬 스킬
```

## 설치

```bash
# 저장소 클론
git clone <your-repo-url>
cd oh-my-kiro

# 의존성 설치 및 빌드
npm install
npm run build

# 전역 링크
npm link

# 프로젝트 설정
cd /your/project
omk setup
omk doctor
```

## 업데이트

```bash
# 최신 버전으로 업데이트
omk update

# 강제 업데이트 (이미 최신이어도)
omk update --force

# 변경사항 적용
omk setup --force
```

**자동 업데이트 과정:**
1. Git 저장소에서 최신 버전 확인
2. 변경사항 다운로드
3. 의존성 설치 및 빌드
4. 재설정 권장

## 사용법

### Kiro 세션에서

```bash
kiro-cli chat
```

```
$team 3:executor "인증 모듈 리팩토링"
$autopilot "REST API 구축"
$ralph "모든 에러 수정"
```

### CLI에서

```bash
# 팀 시작
omk team 3:executor "작업" --model claude-sonnet-4-20250514

# 상태 확인
omk team-status
omk status

# 에이전트 목록
omk agents
```

## Steering 시스템

Kiro의 **steering**은 에이전트에게 방향을 제시하는 메커니즘입니다.

### Steering 우선순위

1. **`~/.kiro/steering/PROJECT.md`** - 프로젝트 최상위 규칙
2. **`~/.kiro/agents/*.md`** - 에이전트별 역할 정의
3. **`~/.kiro/skills/*/SKILL.md`** - 워크플로우 실행 방법
4. **`.omk/config.json`** - 기술적 설정

### Steering 문서 구조

```markdown
# PROJECT.md

## 언어 규칙
- 모든 응답은 한국어로 작성

## 핵심 원칙
- 직접 해결 우선
- 필요시 위임

## 에이전트 역할
- architect: 아키텍처 분석
- executor: 구현
...

## 워크플로우 스킬
- $team: 팀 조정
- $autopilot: 자율 실행
...
```

## 에이전트 설정

각 에이전트는 다음을 정의합니다:

### allowedTools (허용된 도구)

```json
{
  "executor": {
    "allowedTools": [
      "fs_read",
      "fs_write",
      "execute_bash",
      "code",
      "use_subagent"
    ]
  }
}
```

### resources (접근 가능한 리소스)

```json
{
  "executor": {
    "resources": [
      ".omk/steering/PROJECT.md",
      ".omk/state/",
      ".omk/config.json"
    ]
  }
}
```

### 에이전트 예시

```markdown
# Executor 에이전트

## 역할
- 코드 구현
- 리팩토링

## 도구 (allowedTools)
- fs_read, fs_write
- execute_bash
- code

## 리소스 (resources)
- .omk/steering/PROJECT.md
- .omk/state/
```

## 설정

`.omk/config.json`:

```json
{
  "agents": {
    "executor": {
      "complexity": "medium",
      "model": "claude-sonnet-4-20250514",
      "allowedTools": ["fs_read", "fs_write", "execute_bash"],
      "resources": [".omk/steering/PROJECT.md"]
    }
  },
  "team": {
    "max_workers": 6,
    "phases": ["team-plan", "team-prd", "team-exec", "team-verify", "team-fix"]
  }
}
```

## 스킬

### 기본 스킬 (11개)

### $team - 팀 오케스트레이션

```
$team 3:executor "작업"
```

페이즈: plan → prd → exec → verify → fix

### $autopilot - 자율 파이프라인

```
$autopilot "기능 구현"
```

### $ralph - 지속 실행

```
$ralph "에러 수정"
```

### 기타 스킬

- `$ultrawork` - 병렬 실행
- `$plan` - 계획 수립
- `$analyze` - 심층 분석
- `$tdd` - 테스트 주도 개발
- `$ecomode` - 토큰 효율 모드
- `$cancel` - 취소
- `$ralplan` - 합의 계획
- `$visual-verdict` - 시각적 검증

### 외부 스킬 설치

**전역 설치 (모든 프로젝트):**
```bash
omk add-skill https://github.com/vercel-labs/skills --skill find-skills
$find-skills "검색"
```

**로컬 설치 (현재 프로젝트만):**
```bash
omk add-skill https://github.com/user/skill --skill custom --local
$custom "작업"
```

**수동 설치:**
```bash
# 전역
cp -r downloaded-skill ~/.kiro/skills/

# 로컬
cp -r downloaded-skill .omk/skills/

# Git 클론
cd ~/.kiro/skills/
git clone https://github.com/user/skill.git
```

**스킬 목록:**
```bash
omk list-skills
```

**중요:** Kiro는 스킬을 실시간으로 읽습니다.
- ✅ 재시작 불필요
- ✅ 스킬 추가 후 즉시 사용 가능
- ✅ 우선순위: 로컬 (`.omk/skills/`) > 전역 (`~/.kiro/skills/`)

자세한 내용: `docs/CUSTOMIZATION.md`

## CLI 명령어

```bash
omk setup                    # 설치
omk doctor                   # 진단
omk agents                   # 에이전트 목록
omk team <spec> <task>       # 팀 시작
omk team-status              # 팀 상태
omk team-shutdown            # 팀 종료
omk status                   # 전체 상태
omk cancel [mode]            # 취소
omk version                  # 버전
omk help                     # 도움말
```

## oh-my-codex vs oh-my-kiro

| 항목 | oh-my-codex | oh-my-kiro |
|------|-------------|------------|
| CLI | Codex | Kiro |
| 워커 | tmux | use_subagent |
| 상태 | MCP | 파일 |
| Steering | AGENTS.md | ~/.kiro/steering/ |
| 에이전트 | ~/.codex/prompts/ | ~/.kiro/agents/ |
| 도구 관리 | ❌ | allowedTools |
| 리소스 관리 | ❌ | resources |

## 개발

```bash
npm run dev      # Watch 모드
npm run build    # 빌드
npm link         # 로컬 테스트
```

## 문서

- `README.md` - 이 파일
- `docs/CUSTOMIZATION.md` - 커스터마이징 가이드 (스킬/에이전트 추가)
- `docs/MODEL_CONFIG.md` - 모델 설정 가이드
- `USAGE_KR.md` - 한글 사용 가이드

## 라이선스

MIT

## 감사

[oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex) by Yeachan Heo에서 영감을 받았습니다.
