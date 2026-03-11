# Oh My Kiro - 스킬 관리 가이드

## 스킬 위치

### 글로벌 스킬 (모든 프로젝트)
```
~/.kiro/skills/
├── team/
├── autopilot/
├── ralph/
└── ...
```

**용도:**
- 모든 프로젝트에서 사용하는 범용 스킬
- Oh My Kiro 기본 제공 스킬 (16개)
- 자주 사용하는 커스텀 스킬

**설치:**
```bash
omk setup              # 기본 스킬 설치
omk add-skill <url>    # 글로벌 설치 (기본)
```

### 로컬 스킬 (현재 프로젝트만)
```
.omk/skills/
├── project-specific/
└── custom-workflow/
```

**용도:**
- 프로젝트 특화 스킬
- 실험적 스킬
- 팀 공유 스킬 (Git으로 관리)

**설치:**
```bash
omk add-skill <url> --local    # 로컬 설치
```

## 우선순위

Kiro는 다음 순서로 스킬을 찾습니다:

1. **로컬 스킬** (`.omk/skills/`)
2. **글로벌 스킬** (`~/.kiro/skills/`)

같은 이름의 스킬이 있으면 로컬이 우선!

## 스킬 목록 확인

```bash
omk list-skills
```

**출력 예시:**
```
📦 글로벌 스킬 (~/.kiro/skills/):
  - team (멀티 에이전트 팀 조정)
  - autopilot (자율 파이프라인)
  - ralph (지속 실행 루프)
  - memory (세션 메모리 관리)
  ... (총 16개)

📁 로컬 스킬 (.omk/skills/):
  - custom-deploy (배포 자동화)
  - project-test (프로젝트 테스트)
  ... (총 2개)
```

## 사용 예시

### 시나리오 1: 기본 스킬 사용
```bash
# 프로젝트 시작
cd my-project
omk setup

# 기본 스킬 사용
kiro-cli chat
> $team 3:executor "버그 수정"
> $ralph "테스트 통과까지"
```

### 시나리오 2: 프로젝트 특화 스킬
```bash
# 프로젝트 특화 스킬 추가
omk add-skill https://github.com/team/deploy-skill --local

# Git으로 팀과 공유
git add .omk/skills/
git commit -m "Add deploy skill"
git push

# 팀원이 클론 후
git clone <repo>
cd <repo>
omk setup    # 로컬 스킬 자동 인식
```

### 시나리오 3: 글로벌 스킬 추가
```bash
# 자주 사용하는 스킬을 글로벌로
omk add-skill https://github.com/community/awesome-skill

# 모든 프로젝트에서 사용 가능
cd any-project
kiro-cli chat
> $awesome-skill
```

## 스킬 관리 명령어

### 설치
```bash
omk add-skill <url>              # 글로벌 설치
omk add-skill <url> --local      # 로컬 설치
omk add-skill <url> --skill=name # 특정 스킬만
```

### 목록
```bash
omk list-skills                  # 모든 스킬
omk list-skills --global         # 글로벌만
omk list-skills --local          # 로컬만
```

### 삭제
```bash
rm -rf ~/.kiro/skills/skill-name      # 글로벌 삭제
rm -rf .omk/skills/skill-name         # 로컬 삭제
```

## 권장 사항

### 글로벌로 설치해야 할 것
- ✅ Oh My Kiro 기본 스킬 (team, ralph, autopilot 등)
- ✅ 범용 워크플로우 스킬
- ✅ 자주 사용하는 커뮤니티 스킬

### 로컬로 설치해야 할 것
- ✅ 프로젝트 특화 스킬
- ✅ 실험적 스킬
- ✅ 팀 공유 스킬 (Git 관리)
- ✅ 프로젝트별 커스텀 워크플로우

## 팀 협업

### 로컬 스킬을 Git으로 공유
```bash
# .gitignore 확인
cat .gitignore
# .omk/skills/는 포함되어야 함 (제외하지 말 것)

# 스킬 추가 및 커밋
omk add-skill <url> --local
git add .omk/skills/
git commit -m "Add team workflow skill"
git push

# 팀원이 사용
git pull
omk setup    # 자동 인식
```

### 글로벌 스킬 공유
```bash
# 팀 문서에 기록
echo "omk add-skill https://github.com/team/skill" >> SETUP.md

# 팀원이 수동 설치
omk add-skill https://github.com/team/skill
```

## 스킬 개발

### 로컬에서 개발
```bash
# 로컬 스킬 생성
mkdir -p .omk/skills/my-skill
cat > .omk/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: "내 커스텀 스킬"
model: claude-sonnet-4-5
---

# My Skill

...
EOF

# 즉시 사용 가능
kiro-cli chat
> $my-skill
```

### 글로벌로 배포
```bash
# 완성되면 글로벌로 이동
cp -r .omk/skills/my-skill ~/.kiro/skills/

# 또는 GitHub에 올리고 설치
omk add-skill https://github.com/me/my-skill
```

## 문제 해결

### 스킬이 안 보여요
```bash
# 스킬 목록 확인
omk list-skills

# 스킬 디렉토리 확인
ls ~/.kiro/skills/
ls .omk/skills/

# 재설치
omk setup --force
```

### 같은 이름의 스킬이 충돌해요
```bash
# 로컬이 우선순위가 높음
# 글로벌 스킬을 사용하려면 로컬 스킬 삭제
rm -rf .omk/skills/skill-name
```

### 스킬을 업데이트하고 싶어요
```bash
# 글로벌 스킬
omk add-skill <url> --force

# 로컬 스킬
omk add-skill <url> --local --force
```
