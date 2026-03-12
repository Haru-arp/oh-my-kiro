# Technology Stack

## Frontend

**Core:**
- React 18
- TypeScript
- Vite

**Styling:**
- Tailwind CSS
- shadcn/ui components

**State:**
- React hooks (useState, useEffect, etc.)
- Context API for global state
- TanStack Query for server state

**Forms:**
- React Hook Form
- Zod validation

## Backend

**Runtime:**
- Node.js 20+
- TypeScript

**Framework:**
- Express or Fastify

**Database:**
- PostgreSQL
- Prisma ORM

**Auth:**
- JWT tokens
- bcrypt for passwords

## Testing

**Unit/Integration:**
- Jest
- React Testing Library

**E2E:**
- Playwright

## Tools

**Development:**
- ESLint
- Prettier
- TypeScript

**Design:**
- Figma (use MCP for design access)

**Version Control:**
- Git
- GitHub

## File Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   └── features/        # Feature components
├── lib/                 # Utilities
├── hooks/               # Custom hooks
├── types/               # TypeScript types
├── api/                 # API client
└── app/                 # Pages/routes
```

## Conventions

- **TypeScript** for all code
- **Functional components** with hooks
- **Tailwind** for styling
- **shadcn/ui** for UI components
- **Prisma** for database
