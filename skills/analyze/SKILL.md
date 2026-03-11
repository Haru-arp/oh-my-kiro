---
name: analyze
description: "심층 분석. 코드베이스/아키텍처 조사. 트리거: $analyze, 분석, 조사"
---

# 분석

코드베이스, 아키텍처 또는 특정 이슈에 대한 심층 분석

## 사용법

```
$analyze "성능 병목 현상 조사"
$analyze "인증 플로우 검토"
```

## 워크플로우

1. 초기 발견에 `explore` 역할 사용
2. 심층 분석에 `architect` 역할 사용
3. 발견 사항 보고서 생성
4. `.omk/logs/analysis-[timestamp].md`에 출력

## 규칙

- **모든 응답은 한국어로 작성**
- 체계적이고 철저하게 분석
- 발견 사항을 명확히 문서화
- 구현은 executor에게 위임 권장
