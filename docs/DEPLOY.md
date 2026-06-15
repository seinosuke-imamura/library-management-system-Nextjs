# Railway デプロイ手順

## 前提

- GitHub リポジトリに push 済み
- [Railway](https://railway.app) アカウント作成済み
- ローカルで `docker compose up --build` が動作すること

## 1. プロジェクト作成

1. Railway ダッシュボード → **New Project**
2. **Deploy from GitHub repo** を選択
3. `library-management-system-nextjs` リポジトリを連携

## 2. PostgreSQL アドオン追加

1. プロジェクト画面 → **Add Service** → **Database** → **PostgreSQL**
2. PostgreSQL サービスの **Variables** タブで `DATABASE_URL` を確認

## 3. アプリの環境変数を設定

Next.js サービスの **Variables** に追加:

| 変数 | 値 |
|------|-----|
| `DATABASE_URL` | PostgreSQL サービスの `${{Postgres.DATABASE_URL}}` を参照 |
| `JWT_SECRET` | ランダムな長い文字列（本番用） |
| `RUN_SEED` | `true`（初回のみ。seed 後は削除または `false`） |

## 4. デプロイ設定

リポジトリ直下の `railway.toml` と `Dockerfile` により、Docker ビルドでデプロイされます。

- 起動時: DB 待機 → migrate → （RUN_SEED=true なら seed）→ Next.js 起動

## 5. 初回デプロイ後の確認

1. Railway が発行した URL を開く
2. `/login` で seed ユーザーでログイン

| ユーザー名 | パスワード | ロール |
|-----------|-----------|--------|
| admin | admin | ADMIN |
| staff | staff | STAFF |
| user | user | USER |

3. 書籍一覧・貸出・返却を手動確認

## 6. 本番 DB の migrate / seed（手動）

Railway CLI を使う場合:

```bash
railway run node scripts/migrate.mjs
railway run node scripts/seed.mjs
```

## トラブルシューティング

| 症状 | 確認 |
|------|------|
| 502 / 起動失敗 | Deploy Logs で migrate エラーを確認 |
| ログインできない | `RUN_SEED=true` で seed 済みか、`JWT_SECRET` が設定されているか |
| DB 接続エラー | `DATABASE_URL` が PostgreSQL アドオンを指しているか |
