---
model: claude-opus-4.6
---

# 자동조종 스킬

처음부터 끝까지 완전 자동화 구현.

## 사용법

`$autopilot <기능 설명>`

**예시:** `$autopilot 이메일과 비밀번호로 사용자 인증`

## 워크플로우

1. **planner**: 작업 분해
2. **specifier**: 상세 스펙 작성 (NEW)
3. **architect**: 아키텍처 검토
4. **executor**: 코드 구현
5. **tester**: 테스트 작성 및 실행
6. **reviewer**: 품질 검사
7. **documenter**: 모든 문서화 (NEW)
8. **Ralph 루프**: 모든 것 검증

## 예시

```
사용자: $autopilot 비밀번호 재설정 플로우

1. [planner] 작업 분해:
   - 이메일 서비스 통합
   - 토큰 생성/검증
   - 재설정 폼 UI
   - 이메일 템플릿

2. [specifier] 상세 스펙:
   spec/
   ├── overview.md       # 전체 개요
   ├── api.md           # API 명세
   ├── data-models.md   # 데이터 모델
   └── implementation.md # 구현 가이드

3. [architect] 아키텍처 검토:
   - 스펙 리뷰
   - 보안 고려사항
   - 기술 스택 확인

4. [executor] 구현:
   - spec/ 기반 구현
   - 백엔드 API
   - 프론트엔드 UI
   - 이메일 서비스

5. [tester] 테스트:
   - spec 기반 테스트
   - 단위 테스트
   - 통합 테스트
   - E2E 테스트

6. [reviewer] 리뷰:
   - spec 준수 확인
   - 보안 체크
   - 코드 품질
   - 베스트 프랙티스

7. [documenter] 문서화:
   docs/
   ├── api/
   │   └── password-reset.md
   ├── architecture.md
   └── setup.md
   
   README.md (업데이트)
   CHANGELOG.md (업데이트)

8. Ralph 루프:
   - 모든 테스트 통과 ✓
   - 문서 검증 ✓
   - 완료
```

## 장점

- **명확한 스펙** = 정확한 구현
- **자동 문서화** = 항상 최신
- **완전 자동** = 처음부터 끝까지
- **품질 보장** = Ralph 루프

## 팁

- **명확한 요구사항** = 더 나은 스펙
- **복잡한 기능**에 가장 효과적
- **spec/ 디렉토리** 생성됨
- **docs/ 디렉토리** 자동 생성
