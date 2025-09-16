---
title: "TypeScript with Node.js"
description: "Add TypeScript to Node projects: tsconfig, typing Node/Express, build pipelines, and DX tips."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-15"
datePublished: "2025-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - typescript
resources:
  - title: "TypeScript Handbook"
    type: "documentation"
    url: "https://www.typescriptlang.org/docs/"
    description: "Official TS docs"
  - title: "ts-node"
    type: "tool"
    url: "https://typestrong.org/ts-node/"
    description: "TypeScript execution engine for Node.js"
---

![TypeScript with Node.js](https://res.cloudinary.com/duojkrgue/image/upload/v1757930701/Portfolio/nodeJsCourse/32_ci1c0b.png)

<!-- # 📖 My Personal Notes – TypeScript with Node.js -->

When I switched my Node.js projects to TypeScript, two things changed immediately: I stopped shipping silly runtime errors, and big refactors stopped being scary. Below is how I set it up and the patterns I actually use, with clear explanations before each example so it reads like notes, not a wall of code.

## Why I use TypeScript in Node

TypeScript adds a compile step that checks types before your code runs. That means many bugs are caught in your editor instead of production. It also turns your code into self-documenting contracts: function inputs/outputs, API payloads, and service boundaries become explicit.

## Project setup in plain words

First we install TypeScript and the Node type definitions. The Node types tell the compiler what `process`, `Buffer`, `fs`, etc. look like.

```bash
npm i -D typescript @types/node ts-node nodemon
npx tsc --init
```

The `tsconfig.json` controls how TS compiles your code. I keep it strict to catch mistakes. `outDir` is where compiled JS goes; `rootDir` is where TS source lives.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  }
}
```

## A tiny Express server with types (and why it matters)

Below we import Express with its types. The `Request` and `Response` types give us autocomplete and catch typos in headers and JSON shapes. If I rename a field, the compiler flags all usages.

```ts
// src/server.ts
import express, { Request, Response, NextFunction } from 'express'

const app = express()
app.use(express.json())

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', ts: Date.now() })
})

// Central error handler with proper types
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: err.message })
})

app.listen(3000)
```

Explanation: By typing the handler signatures, we avoid the “any” trap. If we accidentally send a non-serializable object or forget to return, ESLint/TS helps us catch it.

## Modeling API payloads (the part I reuse everywhere)

Creating types for request bodies and responses helps keep controllers clean. The example shows a typed create-user endpoint with clear contracts.

```ts
// src/types/api.ts
export interface CreateUserRequest {
  name: string
  email: string
  age?: number
}

export interface UserResponse {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

And the controller enforces those shapes at compile time. If we forget `email`, TypeScript complains before we even run the server.

```ts
// src/controllers/userController.ts
import { Request, Response } from 'express'
import { CreateUserRequest, UserResponse, ApiResponse } from '@/types/api'

export async function createUser(
  req: Request<{}, ApiResponse<UserResponse>, CreateUserRequest>,
  res: Response<ApiResponse<UserResponse>>
) {
  const { name, email } = req.body
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'name and email required' })
  }

  const user: UserResponse = {
    id: crypto.randomUUID(),
    name,
    email,
    createdAt: new Date().toISOString()
  }
  return res.status(201).json({ success: true, data: user })
}
```

## Common utility types I reach for

These patterns save me from rewriting generics. They make refactors safer and APIs clearer.

```ts
// src/types/utils.ts
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] }
```

Why: `Optional` lets me define create/update payloads concisely, `RequiredFields` forces critical fields in specific paths, and `DeepPartial` helps for patch updates.

## Environment variables with validation (I stopped fearing .env)

The code below parses and validates `process.env` at startup. Instead of sprinkling `process.env.X` everywhere, I use a single `env` object with proper types.

```ts
// src/config/env.ts
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3000').transform(Number),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32)
})

export const env = schema.parse(process.env)
```

Explanation: If a required variable is missing, the app fails fast with a helpful error. In production, this prevents misconfigurations that are otherwise hard to debug.

## Testing with Jest + ts-jest (short and sweet)

I prefer `ts-jest` so I can write tests in TypeScript without a build step. The key is to keep tests fast and type-safe.

```json
{
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "roots": ["<rootDir>/src"],
    "testMatch": ["**/__tests__/**/*.test.ts"]
  }
}
```

## Build and run

Finally, I compile to `dist` for production and run Node on the JS output. This keeps startup fast and avoids shipping the compiler.

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

In practice: TypeScript pays for itself the first time you rename a function or change a payload. The compiler becomes your teammate, pointing out everything you forgot to update.


