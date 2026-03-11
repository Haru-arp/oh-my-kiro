---
name: team
description: "멀티 에이전트 팀 오케스트레이션. 단계별 실행 (plan → prd → exec → verify → fix). 최대 6개 워커. 트리거: $team, 팀 모드, 팀 작업"
model: claude-opus-4.6
---

# 팀 오케스트레이션

멀티 에이전트 조정을 통한 단계별 작업 실행

## 사용법

```
$team 3:executor "인증 모듈 리팩토링"
$team 2:verifier "테스트 커버리지 검증"
```

## 워크플로우

1. `.omk/state/team.json`에서 팀 상태 로드
2. `use_subagent` 도구로 워커 생성
3. 페이즈 진행: plan → prd → exec → verify → fix
4. 각 페이즈 후 상태 업데이트
5. 완료까지 verify → fix 반복

## 구현

워커 생성:
```json
{
  "command": "InvokeSubagents",
  "content": {
    "subagents": [
      {
        "query": "executor로서 기능 X 구현",
        "agent_name": "default",
        "relevant_context": "Worker 1/3"
      }
    ]
  }
}
```

## 규칙

- **모든 응답은 한국어로 작성**
- 워커 간 명확한 역할 분담
- 상태는 항상 파일에 영속화
- 페이즈 전환은 검증 후에만
