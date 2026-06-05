# 図書管理システム（Next.js 版）

Hono + React(Vite) で構築した [library-management-system](https://github.com/seinosuke-imamura/library-management-system) を、**App Router + Route Handlers** のフルスタック Next.js アプリとして再実装する学習プロジェクト。

## セットアップ

```bash
npm install
cp .env.example .env.local   # または .env.local を手動作成
npm run db:migrate
npm run db:seed
npm run dev
```

`.env.local` の例:

```
DATABASE_URL=library.db
JWT_SECRET=your-secret-key
```

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
| [学習メモ.md](学習メモ.md) | 学習記録（Q&A） |
| 学習計画（Cursor plans） | Phase 進捗管理 |

## 技術スタック

- Next.js 16（App Router）
- React 19 + Tailwind CSS 4
- Drizzle ORM + SQLite（better-sqlite3）
- zod
- JWT + HttpOnly Cookie（Phase N3 以降）
