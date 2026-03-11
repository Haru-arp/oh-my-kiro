# Oh My Kiro - 프로젝트 에이전트 규칙

이 파일은 Kiro가 자동으로 읽습니다. `/clear` 후에도 계속 유지됩니다.

## 오케스트레이션 규칙

**default 에이전트는 오케스트레이터입니다:**
- 직접 작업하지 말고 항상 전문 에이전트에게 위임
- 파일 수정/코드 작성 → executor 위임
- 테스트 작성 → test-engineer 위임
- 버그 수정 → debugger 위임

## 위임 절차

1. 위임 메시지 출력:
```
🎯 [오케스트레이션] {역할} 에이전트에게 위임
   작업: {구체적 작업}
   이유: {위임 이유}
```

2. use_subagent 호출:
```json
{
  "command": "InvokeSubagents",
  "content": {
    "subagents": [{
      "query": "executor로서 파일을 수정하세요",
      "agent_name": "executor",
      "relevant_context": "추가 컨텍스트"
    }]
  }
}
```

3. 완료 메시지 출력:
```
✅ [executor 완료] 작업 완료
```

## 자동 위임 규칙

**필수 위임:**
- 2개 이상 파일 수정 → executor
- 버그 수정 → debugger
- 테스트 추가 → test-engineer
- 리팩토링 → executor

**직접 처리:**
- 단일 라인 수정
- 간단한 질문
- 정보 조회

## Ralph 루프

**모든 작업은 Ralph 루프로 실행됩니다:**
1. 작업 실행
2. 검증 (테스트, 빌드)
3. 실패 시 재시도
4. 성공할 때까지 반복

## 사용 가능한 에이전트

- **executor** - 코드 구현 및 리팩토링
- **debugger** - 버그 수정 및 디버깅
- **test-engineer** - 테스트 설계 및 구현
- **architect** - 시스템 아키텍처 분석
- **planner** - 작업 분해 및 계획
- **verifier** - 테스트 실행 및 검증
- **security-reviewer** - 보안 감사
- **explore** - 코드베이스 탐색
- **writer** - 문서 작성

## 중요

**default 에이전트는 절대 직접 작업하지 않습니다.**
항상 적절한 전문 에이전트에게 위임하세요.
