# Oh My Kiro v2 구현 계획

## 구현 항목

### 1. 에이전트 JSON (8개)
- [ ] `agents/default.json` - Orchestrator
- [ ] `agents/executor.json` - Code implementation
- [ ] `agents/debugger.json` - Bug fixing
- [ ] `agents/tester.json` - Testing
- [ ] `agents/reviewer.json` - Code review
- [ ] `agents/architect.json` - Architecture
- [ ] `agents/planner.json` - Planning
- [ ] `agents/writer.json` - Documentation

### 2. 프롬프트 파일 (8개)
- [ ] `prompts/orchestrator.md`
- [ ] `prompts/executor.md`
- [ ] `prompts/debugger.md`
- [ ] `prompts/tester.md`
- [ ] `prompts/reviewer.md`
- [ ] `prompts/architect.md`
- [ ] `prompts/planner.md`
- [ ] `prompts/writer.md`

### 3. Steering 파일 (10개)

**Core:**
- [ ] `steering/orchestration.md`
- [ ] `steering/ralph-loop.md`

**Skills:**
- [ ] `steering/skills/team.md`
- [ ] `steering/skills/autopilot.md`
- [ ] `steering/skills/plan.md`
- [ ] `steering/skills/tdd.md`

**Guides:**
- [ ] `steering/guides/implementation.md`
- [ ] `steering/guides/debugging.md`
- [ ] `steering/guides/testing.md`

**Standards:**
- [ ] `steering/standards/tech-stack.md`

### 4. 프로젝트 파일
- [ ] `AGENTS.md` - 프로젝트 규칙

### 5. Setup 명령어
- [ ] `src/cli/commands.ts` 수정
  - 글로벌/로컬 설치 지원
  - 에이전트 설치
  - 프롬프트 설치
  - Steering 설치
  - AGENTS.md 설치
  - cli.json 생성

### 6. 삭제할 파일들
- [ ] v1 에이전트 삭제 (10개)
- [ ] v1 스킬 삭제 (16개)
- [ ] v1 steering 삭제 (7개)
- [ ] 이벤트 시스템 삭제
- [ ] 핸드오프 시스템 삭제

## 구현 순서

### Phase 1: 에이전트 & 프롬프트
1. 8개 에이전트 JSON 작성
2. 8개 프롬프트 파일 작성
3. 테스트

### Phase 2: Steering 파일
1. Core steering (orchestration, ralph-loop)
2. Skills (team, autopilot, plan, tdd)
3. Guides (implementation, debugging, testing)
4. Standards (tech-stack)
5. 테스트

### Phase 3: Setup 명령어
1. 글로벌/로컬 설치 로직
2. 파일 복사 로직
3. cli.json 생성
4. 테스트

### Phase 4: 정리
1. v1 파일 삭제
2. README 업데이트
3. 문서 정리
4. 최종 테스트

## 예상 작업 시간

- Phase 1: 에이전트 & 프롬프트 (30분)
- Phase 2: Steering 파일 (30분)
- Phase 3: Setup 명령어 (20분)
- Phase 4: 정리 (10분)

**총 예상 시간: 1.5시간**

## 시작할까?

다음 중 선택:
1. Phase 1부터 시작 (에이전트 & 프롬프트)
2. Phase 2부터 시작 (Steering 파일)
3. Phase 3부터 시작 (Setup 명령어)
4. 전체 한번에 진행
