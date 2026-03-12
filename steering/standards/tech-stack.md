# 기술 스택

## 프론트엔드

**핵심:**
- React 18
- TypeScript
- Vite

**스타일링:**
- Tailwind CSS
- shadcn/ui 컴포넌트

**상태:**
- React hooks (useState, useEffect 등)
- Context API (전역 상태)
- TanStack Query (서버 상태)

**폼:**
- React Hook Form
- Zod 유효성 검사

## 백엔드

**런타임:**
- Node.js 20+
- TypeScript

**프레임워크:**
- Express 또는 Fastify

**데이터베이스:**
- PostgreSQL
- Prisma ORM

**인증:**
- JWT 토큰
- bcrypt (비밀번호)

## 테스트

**단위/통합:**
- Jest
- React Testing Library

**E2E:**
- Playwright

## 도구

**개발:**
- ESLint
- Prettier
- TypeScript

**디자인:**
- Figma (MCP로 디자인 접근)

**버전 관리:**
- Git
- GitHub

## 파일 구조

```
src/
├── components/
│   ├── ui/              # shadcn/ui 컴포넌트
│   └── features/        # 기능 컴포넌트
├── lib/                 # 유틸리티
├── hooks/               # 커스텀 훅
├── types/               # TypeScript 타입
├── api/                 # API 클라이언트
└── app/                 # 페이지/라우트
```

## 규칙

- **TypeScript** 모든 코드
- **함수형 컴포넌트** + hooks
- **Tailwind** 스타일링
- **shadcn/ui** UI 컴포넌트
- **Prisma** 데이터베이스
