# 빠른 참조 가이드

## 스킬 추가 (3단계)

### omk add-skill 사용 (권장)
```bash
# 전역 설치 (모든 프로젝트)
omk add-skill https://github.com/vercel-labs/skills --skill find-skills

# 로컬 설치 (현재 프로젝트만)
omk add-skill https://github.com/user/skill --skill custom --local

# 스킬 목록
omk list-skills

# 바로 사용 (재시작 불필요!)
$find-skills "검색"
```

### 직접 생성
```bash
# 전역 스킬
cat > ~/.kiro/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: "설명. 트리거: $my-skill"
---

# 내 스킬

## 사용법
\`\`\`
$my-skill "작업"
\`\`\`

## 규칙
- **모든 응답은 한국어로 작성**
EOF

# 로컬 스킬 (프로젝트 전용)
cat > .omk/skills/project-skill/SKILL.md << 'EOF'
...
EOF

# 바로 사용
$my-skill "테스트"
```

### 수동 설치
```bash
# 전역
cp -r downloaded-skill ~/.kiro/skills/

# 로컬
cp -r downloaded-skill .omk/skills/

# Git 클론
cd ~/.kiro/skills/
git clone https://github.com/user/skill.git
```

**중요:** 
- ✅ 재시작 불필요
- ✅ 우선순위: 로컬 > 전역
- ✅ 즉시 사용 가능

## 에이전트 추가 (3단계)

```bash
# 1. 에이전트 파일 생성
cat > ~/.kiro/agents/my-agent.md << 'EOF'
# My Agent

## 역할
- 역할 설명

## 도구 (allowedTools)
- `fs_read`
- `fs_write`

## 리소스 (resources)
- `.omk/steering/PROJECT.md`

## 규칙
- **모든 응답은 한국어로 작성**
EOF

# 2. 설정 추가
cat >> .omk/config.json << 'EOF'
{
  "agents": {
    "my-agent": {
      "complexity": "medium",
      "model": "claude-sonnet-4",
      "allowedTools": ["fs_read", "fs_write"],
      "resources": [".omk/steering/PROJECT.md"]
    }
  }
}
EOF

# 3. 사용
omk team 2:my-agent "작업"
```

## 모델 지정

### 설정 파일
```json
{
  "agents": {
    "executor": {
      "model": "claude-sonnet-4"
    }
  }
}
```

### CLI
```bash
omk team 3:executor "작업" --model claude-sonnet-4
```

### 지원 모델
- `claude-sonnet-4` ✅
- `claude-opus-4` ✅
- `claude-haiku-4` ✅
- `claude-sonnet-4-20250514` ✅

## allowedTools

```json
{
  "allowedTools": [
    "fs_read",        // 파일 읽기
    "fs_write",       // 파일 쓰기
    "execute_bash",   // 명령 실행
    "code",           // 코드 분석
    "grep",           // 검색
    "use_subagent"    // 하위 에이전트
  ]
}
```

## resources

```json
{
  "resources": [
    ".omk/steering/PROJECT.md",
    ".omk/state/",
    "src/"
  ]
}
```

## 역할별 템플릿

### 분석가
```json
{
  "complexity": "high",
  "model": "claude-opus-4",
  "allowedTools": ["fs_read", "code", "grep"],
  "resources": [".omk/steering/PROJECT.md", "docs/"]
}
```

### 구현자
```json
{
  "complexity": "medium",
  "model": "claude-sonnet-4",
  "allowedTools": ["fs_read", "fs_write", "execute_bash", "code"],
  "resources": [".omk/steering/PROJECT.md", "src/"]
}
```

### 검증자
```json
{
  "complexity": "low",
  "model": "claude-haiku-4",
  "allowedTools": ["fs_read", "execute_bash"],
  "resources": [".omk/steering/PROJECT.md"]
}
```
