# 図書管理システム（Next.js 版）プロジェクト参照

移行元: [library-management-system](https://github.com/seinosuke-imamura/library-management-system) の `develop` ブランチ  
移行先: このリポジトリ（`library-management-system-Nextjs`）

---

## 現行 → Next.js 対応表

| 現行（Hono / React Router） | Next.js |
|------------------------------|---------|
| `backend/src/routes/books.ts` | `app/api/books/**/route.ts` |
| `backend/src/routes/auth.ts` | `app/api/auth/**/route.ts` + `lib/auth/*` |
| `backend/src/routes/rentals.ts` | `app/api/rentals/**/route.ts` |
| `backend/src/middleware/auth.ts` | `middleware.ts` + `lib/auth/require-auth.ts` |
| `frontend/src/App.tsx` の `<Route>` | `app/**/page.tsx` |
| `ProtectedRoute` | `middleware.ts` |
| `apiClient`（`localhost:3000`） | 相対パス `/api/...` |
| `react-router-dom` の `Link` / `Navigate` | `next/link`, `next/navigation` |
| Hono `app.get("/", handler)` | `export async function GET()` in `route.ts` |
| Hono `c.req.valid("query")` | `searchParams` + zod |
| Hono `c.req.json()` | `await request.json()`（POST/PUT の body 用） |
| Hono `zValidator` | `schema.safeParse()` — 失敗時 400 |

### ページの写像

| 現行パス | Next.js パス |
|----------|--------------|
| `/login` | `app/login/page.tsx` |
| `/books` | `app/(protected)/books/page.tsx` |
| `/books/new` | `app/(protected)/books/new/page.tsx` |
| `/books/:id` | `app/(protected)/books/[id]/page.tsx` |
| `/books/:id/edit` | `app/(protected)/books/[id]/edit/page.tsx` |
| `/rentals` | `app/(protected)/rentals/page.tsx` |
| `/rentals/my` | `app/(protected)/rentals/my/page.tsx` |

---

## API スコープ（develop と同等）

### 認証

| メソッド | URL | 認証 |
|----------|-----|------|
| POST | `/api/auth/login` | 不要 |
| POST | `/api/auth/register` | 不要 |

### 書籍

| メソッド | URL | 認可 |
|----------|-----|------|
| GET | `/api/books` | 全ロール |
| GET | `/api/books/search?q=xxx` | 全ロール |
| GET | `/api/books/:id` | 全ロール |
| POST | `/api/books` | ADMIN / STAFF |
| PUT | `/api/books/:id` | ADMIN / STAFF |
| DELETE | `/api/books/:id` | ADMIN |

### 貸出

| メソッド | URL | 認可 |
|----------|-----|------|
| GET | `/api/rentals` | ADMIN / STAFF |
| GET | `/api/rentals/my` | 全ロール |
| POST | `/api/rentals` | 全ロール |
| PUT | `/api/rentals/:id/return` | 全ロール |

---

## ロール制御

| 機能 | USER | STAFF | ADMIN |
|------|:----:|:-----:|:-----:|
| 書籍一覧・検索・詳細・借りる | ✅ | ✅ | ✅ |
| 自分の貸出 | ✅ | ✅ | ✅ |
| 書籍追加・編集 | ❌ | ✅ | ✅ |
| 書籍削除 | ❌ | ❌ | ✅ |
| 全体貸出管理・返却 | ❌ | ✅ | ✅ |

---

## 目標ディレクトリ構成

```
library-management-system-Nextjs/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/page.tsx
│   ├── (protected)/
│   │   ├── layout.tsx
│   │   ├── books/ ...
│   │   └── rentals/ ...
│   └── api/ ...
├── components/
├── lib/
│   ├── db/
│   ├── auth/
│   └── validations/
├── types/
├── middleware.ts
├── drizzle/
├── drizzle.config.ts
├── .env.local
└── README.md
```
