# 図書管理システム（Next.js 版）

Hono + React(Vite) で構築した [library-management-system](https://github.com/seinosuke-imamura/library-management-system) を、**App Router + Route Handlers** のフルスタック Next.js アプリとして再実装する学習プロジェクト。

## セットアップ

```bash
npm install
docker compose up -d
cp .env.example .env.local   # または .env.local を手動作成
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

テスト:

```bash
docker compose up -d
npm test
npm run test:coverage
```

`.env.local` の例:

```
DATABASE_URL=postgresql://user:password@localhost:5432/library
JWT_SECRET=your-secret-key
```

## Docker（Next.js + PostgreSQL）

アプリと DB をまとめて起動:

```bash
npm run docker:up
```

- アプリ: http://localhost:3000
- 起動時に migrate + seed（`RUN_SEED=true`）が自動実行されます
- 停止: `npm run docker:down`

本番デプロイ手順: [docs/DEPLOY.md](docs/DEPLOY.md)（Railway）

## 初期ユーザー（seed）

| ユーザー名 | パスワード | ロール |
|-----------|-----------|--------|
| admin | admin | ADMIN |
| staff | staff | STAFF |
| user | user | USER |

## ドキュメント

| ファイル | 内容 |
|---------|------|
| [docs/PROJECT.md](docs/PROJECT.md) | 現行→Next.js 対応表、API スコープ、ロール制御、ディレクトリ構成 |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Railway デプロイ手順 |
| [学習メモ.md](学習メモ.md) | 学習記録（Q&A） |
| 学習計画（Cursor plans） | Phase 進捗管理 |

## 技術スタック

- Next.js 16（App Router）
- React 19 + Tailwind CSS 4
- Drizzle ORM + PostgreSQL（pg）
- Docker Compose（Next.js + PostgreSQL）
- Vitest
- zod
- JWT + HttpOnly Cookie（Phase N3 以降）
