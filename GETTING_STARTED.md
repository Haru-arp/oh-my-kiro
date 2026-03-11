# Oh My Kiro - 시작하기

## 설치 (한 번만)

```bash
# 1. 저장소 클론
cd ~/Desktop/dev  # 또는 원하는 위치
git clone <your-repo-url> oh-my-kiro
cd oh-my-kiro

# 2. 의존성 설치
npm install

# 3. 빌드
npm run build

# 4. 전역 설치
npm link

# 5. 확인
omk --version
```

## 프로젝트에서 사용하기

### 1. 프로젝트 디렉토리로 이동

```bash
cd ~/my-project
```

### 2. Oh My Kiro 설치

```bash
omk setup
```

이 명령어는 다음을 수행합니다:
- `~/.kiro/skills/` - 스킬 설치
- `~/.kiro/agents/` - 에이전트 설치
- `~/.kiro/steering/` - Steering 문서 설치
- `.omk/` - 프로젝트 상태 디렉토리 생성
- `.omk/config.json` - 설정 파일 생성

### 3. 설치 확인

```bash
omk doctor
```

출력 예시:
```
🔍 Oh My Kiro 설치 확인 중...

✓ Kiro CLI
✓ Skills 디렉토리
✓ Agents 디렉토리
✓ Steering 디렉토리
✓ State 디렉토리
✓ 설정 파일

설치된 스킬:
  • team
  • autopilot
  • ralph
  • ultrawork
  • plan
  • analyze
  • tdd
  • ecomode
  • cancel
  • ralplan
  • visual-verdict

설치된 에이전트:
  • architect
  • executor
  • planner
  • verifier
  • debugger

Steering 문서:
  • PROJECT.md

✅ 모든 확인 통과!
```

### 4. Kiro 시작

```bash
kiro-cli chat
```

### 5. 스킬 사용

```
# 팀 모드로 작업
$team 3:executor "인증 모듈 리팩토링"

# 자동 파이프라인
$autopilot "REST API 구축"

# 지속 실행
$ralph "모든 TypeScript 에러 수정"

# 계획 수립
$plan "OAuth 인증 구현"
```

## CLI에서 직접 사용

Kiro 세션 없이 CLI에서 직접:

```bash
# 팀 시작
omk team 3:executor "인증 모듈 리팩토링"

# 상태 확인
omk team-status

# 팀 종료
omk team-shutdown

# 전체 상태
omk status

# 에이전트 목록
omk agents
```

## 모델 지정

```bash
# 특정 모델 사용
omk team 3:executor "작업" --model claude-sonnet-4

# 고성능 모델
omk team 2:architect "설계" --model claude-opus-4

# 저비용 모델
omk team 2:verifier "검증" --model claude-haiku-4
```

## 다른 프로젝트에서 사용

```bash
# 다른 프로젝트로 이동
cd ~/another-project

# 설치 (스킬/에이전트는 이미 ~/.kiro/에 있음)
omk setup

# 바로 사용
kiro-cli chat
$team 2:executor "작업"
```

## 설정 커스터마이징

### 에이전트 모델 변경

`.omk/config.json`:
```json
{
  "agents": {
    "executor": {
      "model": "claude-opus-4"
    }
  }
}
```

### 팀 설정 변경

```json
{
  "team": {
    "max_workers": 8,
    "max_fix_attempts": 5
  }
}
```

### Steering 규칙 수정

`~/.kiro/steering/PROJECT.md` 편집

## 문제 해결

### "Kiro CLI가 설치되지 않았습니다"

```bash
# Kiro CLI 설치 확인
which kiro-cli

# 없으면 Kiro CLI 먼저 설치
```

### "omk: command not found"

```bash
# oh-my-kiro 디렉토리에서
npm link

# 또는 직접 실행
node bin/omk.js setup
```

### 스킬이 인식되지 않음

```bash
# 재설치
omk setup --force

# 확인
omk doctor
```

### 팀 상태가 멈춤

```bash
# 상태 확인
omk team-status

# 강제 종료
omk team-shutdown

# 또는 취소
omk cancel team
```

## 일반적인 워크플로우

### 1. 새 기능 개발

```bash
# 1. 계획
$plan "사용자 인증 기능 구현"

# 2. 팀으로 실행
$team 3:executor "계획에 따라 인증 기능 구현"

# 3. 검증
$team 2:verifier "인증 기능 테스트 및 검증"
```

### 2. 버그 수정

```bash
# 1. 분석
$analyze "로그인 타임아웃 버그 조사"

# 2. 수정
$ralph "로그인 타임아웃 버그 수정"
```

### 3. 코드 리팩토링

```bash
# 병렬 리팩토링
$ultrawork "모듈 A, B, C 리팩토링"
```

### 4. TDD 개발

```bash
$tdd "결제 처리 기능 구현"
```

## 팁

### 1. 작업 전 항상 doctor 실행

```bash
omk doctor
```

### 2. 상태 확인 습관화

```bash
omk status
```

### 3. 모델 선택 전략

- 복잡한 분석: `claude-opus-4`
- 일반 구현: `claude-sonnet-4`
- 간단한 검증: `claude-haiku-4`

### 4. Steering 문서 활용

프로젝트 규칙을 `~/.kiro/steering/PROJECT.md`에 작성하면
모든 에이전트가 자동으로 따릅니다.

## 다음 단계

- `docs/CUSTOMIZATION.md` - 스킬/에이전트 추가
- `docs/QUICK_REFERENCE.md` - 빠른 참조
- `docs/MODEL_CONFIG.md` - 모델 설정 상세
