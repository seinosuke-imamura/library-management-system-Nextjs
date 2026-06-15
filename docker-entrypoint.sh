#!/bin/sh
set -e

echo "Waiting for database..."
until node -e "
const pg = require('pg');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT 1').then(() => { pool.end(); process.exit(0); }).catch(() => { pool.end(); process.exit(1); });
"; do
  sleep 2
done

echo "Running migrations..."
node scripts/migrate.mjs

if [ "$RUN_SEED" = "true" ]; then
  echo "Running seed..."
  node scripts/seed.mjs
fi

echo "Starting Next.js..."
exec node server.js
