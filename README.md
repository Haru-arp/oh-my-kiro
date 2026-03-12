# Oh My Kiro v2.1

Kiro CLI를 위한 멀티 에이전트 오케스트레이션 시스템. [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)에서 영감을 받아 Kiro에 최적화.

## 빠른 시작

```bash
# 1. 설치
git clone <repo-url> oh-my-kiro
cd oh-my-kiro
npm install && npm run build && npm link

# 2. 전역 설치 (모든 프로젝트에서 사용)
omk setup

# 3. Kiro 시작
kiro-cli chat

# 4. OMK 사용
> @omk $team 3 컴포넌트 리팩토링
> @omk $autopilot 로그인 기능 구현
```

## 핵심 개념

### @mention 방식

Oh My Kiro는 **명시적 호출** 방식입니다:

```
# 평소 (일반 Kiro)
> 파일 읽어줘
> 코드 설명해줘

# OMK 필요할 때만
> @omk $team 3 모듈 리팩토링
> @omk $autopilot 결제 시스템 구현
```

**장점:**
- ✅ 평소엔 빠른 일반 Kiro
- ✅ 복잡한 작업만 오케스트레이션
- ✅ 불필요한 오버헤드 없음
- ✅ 명확한 제어

### 전역 vs 로컬 설치

**전역 설치 (기본, 권장):**
```bash
omk setup
```
→ `~/.kiro/agents/omk.json` 설치
→ **모든 프로젝트**에서 `@omk` 사용 가능

**로컬 설치 (프로젝트별 커스터마이징):**
```bash
cd ~/special-project
omk setup --local
```
→ `.kiro/agents/omk.json` 설치
→ **해당 프로젝트**에서만 사용

## 특징

- 🤖 **멀티 에이전트** - 7개 전문 서브에이전트
- 🔄 **Ralph 루프** - 자동 검증 및 반복
- 🎯 **스킬 시스템** - $team, $autopilot, $plan, $tdd
- 💬 **워커 통신** - MCP 메시지 서버
- 🇰🇷 **한국어 우선** - 모든 응답 한국어
- ⚡ **선택적 사용** - @mention으로 필요할 때만

## 에이전트

### 오케스트레이터

- **omk** - 작업 분석 및 서브에이전트 위임

### 서브에이전트 (8개)

**계획 & 스펙:**
- **planner** - 작업 분해 (sonnet-4.5)
- **specifier** - 상세 스펙 작성 (opus-4.6)

**설계:**
- **architect** - 시스템 설계, 아키텍처 (opus-4.6)

**구현:**
- **executor** - 코드 구현, 리팩토링 (opus-4.6)
- **debugger** - 버그 수정, 에러 해결 (opus-4.6)

**검증:**
- **tester** - 테스트 작성, 실행 (sonnet-4.5)
- **reviewer** - 코드 리뷰, 품질 검사 (sonnet-4.5)

**문서:**
- **documenter** - 모든 문서 작성 (haiku-4.5)

## 스킬

### $team - 병렬 실행

**패턴 1: 같은 역할 N개**
```
@omk $team 3 8개 컴포넌트 리팩토링
```
→ executor 3개가 컴포넌트 나눠서 처리

**패턴 2: 역할 혼합 (자동 분담)**
```
@omk $team 결제 시스템 구현
```
→ executor(백엔드) + executor(프론트) + tester + writer

### $autopilot - 완전 자동화

```
@omk $autopilot 비밀번호 재설정 플로우
```

워크플로우:
1. planner: 작업 분해
2. architect: 시스템 설계
3. executor: 구현
4. tester: 테스트
5. reviewer: 리뷰
6. writer: 문서
7. Ralph 루프: 검증

### $plan - 작업 계획

```
@omk $plan 장바구니 기능
```

### $tdd - 테스트 주도 개발

```
@omk $tdd 이메일 유효성 검사
```

Red → Green → Refactor 사이클

## Ralph 루프

모든 작업에 자동 적용:

```
실행 → 테스트 → 리뷰 → 문제? → 수정 → 반복 → 완료
```

**서브에이전트 워크플로우:**
1. executor: 구현
2. tester: 테스트 실행
3. reviewer: 코드 리뷰
4. debugger: 버그 수정 (필요시)
5. 반복 (최대 5회)

## 워커 통신

병렬 작업 시 서브에이전트 간 메시지 전달:

```typescript
// executor-1
send_message({
  to: "executor-2",
  message: "모듈 A 완료, exports 변경됨"
})

// executor-2
read_messages({ worker: "executor-2" })
// → "모듈 A 완료" 확인 후 작업
```

**MCP 메시지 서버:**
- 파일 기반 메시징 (`.kiro/messages/`)
- 자동 삭제 (읽은 후)
- setup 시 자동 빌드

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

# 전역 설치 (모든 프로젝트)
omk setup

# 또는 로컬 설치 (현재 프로젝트만)
cd /your/project
omk setup --local

# 진단
omk doctor
```

## 업데이트

```bash
# Oh My Kiro 업데이트
cd oh-my-kiro
git pull
npm install
npm run build

# 재설치
omk setup --force
```

## 사용 예시

### 예시 1: 단순 작업 (일반 Kiro)

```
> 이 파일 읽어줘
> 버그 수정해줘
> 테스트 실행해줘
```

### 예시 2: 병렬 리팩토링

```
> @omk $team 3 모든 컴포넌트 TypeScript 마이그레이션
```

### 예시 3: 완전 자동화

```
> @omk $autopilot OAuth 인증 시스템 구현
```

### 예시 4: 복잡한 기능

```
> @omk $team 결제 시스템 구현
```
→ 백엔드 + 프론트 + 테스트 + 문서 (자동 역할 분담)

## CLI 명령어

```bash
omk setup [--local] [--force]  # 설치
omk uninstall                  # 제거
omk doctor                     # 진단
omk version                    # 버전
omk help                       # 도움말
```

## 구조

```
~/.kiro/                       # 전역 (모든 프로젝트)
├── agents/
│   ├── omk.json              # 오케스트레이터
│   ├── executor.json
│   └── ...
├── prompts/
│   └── omk.md                # 오케스트레이터 프롬프트
├── steering/
│   ├── orchestration.md      # 오케스트레이션 규칙
│   ├── ralph-loop.md         # Ralph 루프
│   ├── skills/               # 스킬 정의
│   │   ├── team.md
│   │   ├── autopilot.md
│   │   ├── plan.md
│   │   └── tdd.md
│   └── guides/               # 가이드
│       ├── implementation.md
│       ├── testing.md
│       ├── debugging.md
│       └── worker-communication.md
└── mcp/
    └── dist/
        └── message-server.js # 워커 통신 서버

.kiro/                         # 프로젝트별 (로컬 설치 시)
├── agents/                    # (omk setup --local)
├── prompts/
├── steering/
├── mcp/
├── messages/                  # 워커 메시지
│   ├── tester/
│   ├── executor-1/
│   └── ...
└── settings/
    ├── cli.json              # CLI 설정
    └── mcp.json              # MCP 설정
```

## oh-my-codex vs oh-my-kiro

| 항목 | oh-my-codex | oh-my-kiro v2.1 |
|------|-------------|-----------------|
| 기본 동작 | 오케스트레이션 | 일반 에이전트 |
| 호출 방식 | 항상 활성 | @omk (명시) |
| 워커 | tmux | use_subagent |
| 통신 | - | MCP 메시지 |
| 오버헤드 | 항상 있음 | 선택적 |
| 사용성 | 자동 위임 | 필요할 때만 |

## 개발

```bash
npm run dev      # Watch 모드
npm run build    # 빌드
npm link         # 로컬 테스트
```

## 문서

- `README.md` - 이 파일
- `MCP_SETUP.md` - MCP 메시지 서버 설정
- `steering/guides/` - 구현/테스트/디버깅 가이드
- `steering/skills/` - 스킬 정의

## 라이선스

MIT

## 감사

[oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex) by Yeachan Heo에서 영감을 받았습니다.
