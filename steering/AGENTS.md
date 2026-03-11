# Oh My Kiro - 에이전트 역할

## 고복잡도 (High Complexity)
- **architect**: 시스템 아키텍처 분석, 설계 결정
- **security-reviewer**: 보안 감사, 취약점 분석

## 중복잡도 (Medium Complexity)
- **planner**: 작업 분해, 의존성 분석
- **executor**: 코드 구현, 리팩토링
- **debugger**: 근본 원인 분석, 버그 수정
- **test-engineer**: 테스트 설계 및 구현

## 저복잡도 (Low Complexity)
- **verifier**: 테스트 실행, 검증
- **explore**: 코드베이스 탐색
- **writer**: 문서 작성

## 모델 설정

에이전트별 권장 모델:
- 고복잡도: `claude-opus-4-6`, `claude-opus-4-5` 또는 `claude-sonnet-4-6`
- 중복잡도: `claude-sonnet-4-5`
- 저복잡도: `claude-haiku-4-5` 또는 `claude-sonnet-4.5`

설정 위치: 각 에이전트 JSON 파일의 `model` 필드
