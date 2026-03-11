---
name: visual-verdict
description: "시각적 검증. 참조 이미지와 비교. 트리거: $visual-verdict, 비주얼 판정, 시각적 검증"
model: claude-sonnet-4-5
---

# 비주얼 판정

참조 이미지와 생성된 스크린샷 간의 시각적 충실도 검증

## 사용법

```
$visual-verdict "참조 이미지와 현재 구현 비교"
$visual-verdict "UI가 디자인과 일치하는지 확인"
```

## 워크플로우

1. 참조 이미지 로드
2. 현재 구현 스크린샷 생성
3. 시각적 비교 수행
4. 구조화된 JSON 반환
5. 통과 임계값: 90+

## 출력 형식

```json
{
  "score": 95,
  "verdict": "pass",
  "differences": ["색상 약간 다름"],
  "suggestions": ["배경색 조정"]
}
```

## 규칙

- **모든 응답은 한국어로 작성**
- 시각적 작업에서 매 반복마다 실행
- 90+ 점수를 통과 기준으로 권장
- 증거 없이 통과 주장 금지
