# Oh My Kiro - 설치 및 사용 가이드

## 설치

### 1. 저장소 클론

```bash
git clone <your-repo-url>
cd oh-my-kiro
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 빌드

```bash
npm run build
```

### 4. 전역 링크 (로컬 개발용)

```bash
npm link
```

### 5. 설정

```bash
omk setup
```

이 명령어는 다음을 생성합니다:
- `~/.kiro/skills/` - 워크플로우 스킬들
- `.omk/` - 상태 및 설정 디렉토리
- `.omk/config.json` - 설정 파일
- `AGENTS.md` - 프로젝트 오케스트레이션 계약

### 6. 설치 확인

```bash
omk doctor
```

## 기본 사용법

### Kiro 세션에서 사용

```bash
# Kiro 시작
kiro-cli chat

# 스킬 사용
$team 3:executor "인증 모듈 리팩토링"
$autopilot "테스트가 포함된 REST API 구축"
$ralph "모든 TypeScript 에러 수정"
$ultrawork "기능 A, B, C를 병렬로 구현"
```

### CLI에서 직접 사용

```bash
# 팀 시작
omk team 3:executor "인증 모듈 리팩토링"

# 상태 확인
omk team-status

# 종료
omk team-shutdown
```

## 스킬 설명

### $team - 멀티 에이전트 조정

여러 에이전트를 단계별로 조정합니다.

```
$team 3:executor "인증 리팩토링"
$team 2:verifier "테스트 커버리지 검증"
```

**단계**: plan → prd → exec → verify → fix (반복)

### $autopilot - 자율 파이프라인

처음부터 끝까지 자율적으로 실행합니다.

```
$autopilot "인증이 포함된 REST API 구축"
$autopilot "차트가 있는 대시보드 생성"
```

### $ralph - 지속 실행

작업이 완전히 완료될 때까지 계속 작업합니다.

```
$ralph "모든 TypeScript 에러 수정"
$ralph "완전한 테스트 커버리지 구현"
```

### $ultrawork - 병렬 실행

독립적인 작업을 병렬로 실행합니다.

```
$ultrawork "모듈 A, B, C의 버그 수정"
$ultrawork "기능 1, 2, 3 구현"
```

### $plan - 구조화된 계획

작업과 의존성이 포함된 실행 계획을 생성합니다.

```
$plan "OAuth 인증 구현"
```

### $analyze - 심층 분석

코드베이스, 아키텍처 또는 이슈를 조사합니다.

```
$analyze "성능 병목 현상 조사"
```

### $tdd - 테스트 주도 개발

테스트를 먼저 작성한 다음 구현합니다.

```
$tdd "사용자 인증 구현"
```

### $ecomode - 토큰 효율 모드

저복잡도 에이전트를 사용한 비용 효율적 실행입니다.

```
$ecomode "문서 오타 수정"
```

### $cancel - 활성 모드 취소

활성 실행 모드를 중지합니다.

```
$cancel
$cancel team
```

## 커스터마이징

### 설정 파일 편집

`.omk/config.json` 파일을 편집하여 커스터마이징:

```json
{
  "version": "0.1.0",
  "scope": "project",
  "team": {
    "max_workers": 6,
    "default_role": "executor",
    "phases": ["team-plan", "team-prd", "team-exec", "team-verify", "team-fix"],
    "max_fix_attempts": 3
  },
  "agents": {
    "architect": { "complexity": "high", "focus": "analysis" },
    "planner": { "complexity": "medium", "focus": "planning" },
    "executor": { "complexity": "medium", "focus": "implementation" }
  },
  "modes": {
    "ralph": {
      "max_iterations": 10,
      "verification_required": true
    },
    "autopilot": {
      "auto_verify": true,
      "auto_fix": true
    }
  }
}
```

### 커스텀 에이전트 추가

```json
{
  "agents": {
    "api-specialist": {
      "complexity": "medium",
      "focus": "API 설계 및 구현",
      "description": "RESTful API 설계, GraphQL, API 보안 전문가"
    },
    "performance-optimizer": {
      "complexity": "medium",
      "focus": "성능",
      "description": "속도와 효율성을 위한 코드 최적화"
    }
  }
}
```

### 커스텀 워크플로우 단계

```json
{
  "team": {
    "phases": [
      "research",
      "prototype",
      "implement",
      "review",
      "optimize"
    ]
  }
}
```

## 실전 예제

### 예제 1: 기능 개발

```bash
# 기능 계획
$plan "OAuth 2.0 인증 구현"

# 팀으로 실행
$team 3:executor "계획에 따라 OAuth 구현"

# 검증
$team 2:verifier "OAuth 구현 검증"
```

### 예제 2: 버그 수정

```bash
# 이슈 분석
$analyze "로그인 타임아웃 버그 조사"

# 지속적으로 수정
$ralph "로그인 타임아웃 버그 수정"
```

### 예제 3: 병렬 리팩토링

```bash
# 병렬 작업으로 분할
$ultrawork "모듈 리팩토링: auth, api, database"
```

### 예제 4: TDD 워크플로우

```bash
# 테스트 주도 개발
$tdd "Stripe를 사용한 결제 처리 구현"
```

## CLI 명령어 전체 목록

```bash
# 설정 및 진단
omk setup [--force] [--scope user|project]
omk doctor
omk agents

# 팀 오케스트레이션
omk team <count>:<role> <task> [--phase <phase>]
omk team-status
omk team-shutdown [--reason <reason>]

# 상태 및 제어
omk status
omk cancel [mode]
```

## 상태 관리

OMK는 `.omk/`에 상태를 저장합니다:

- `.omk/state/team.json` - 팀 조정 상태
- `.omk/state/ralph.json` - Ralph 지속 상태
- `.omk/state/autopilot.json` - Autopilot 상태
- `.omk/config.json` - 설정
- `.omk/notepad.md` - 세션 노트
- `.omk/plans/` - 실행 계획
- `.omk/logs/` - 분석 로그

## 문제 해결

### 스킬이 인식되지 않음

```bash
# 스킬 재설치
omk setup --force

# 설치 확인
omk doctor
```

### 팀 상태가 멈춤

```bash
# 상태 확인
omk team-status

# 강제 종료
omk team-shutdown --reason "stuck"
```

### 설정 초기화

```bash
# 설정 재생성
omk setup --force
```

## 개발

```bash
# Watch 모드
npm run dev

# 빌드
npm run build

# 로컬 테스트
npm link
omk setup
omk doctor
```

## 라이선스

MIT

## 감사의 말

[oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex) by Yeachan Heo에서 영감을 받았습니다.
