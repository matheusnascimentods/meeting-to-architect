#!/bin/sh
set -e

PGHOST="${PGHOST:-localhost}"

echo "Aguardando PostgreSQL..."
until pg_isready -h "$PGHOST" -U postgres -q; do
  sleep 1
done

export DATABASE_URL="${DATABASE_URL:-postgresql://postgres:password@${PGHOST}:5432/diagrams_db?schema=public}"
PSQL_URL="${DATABASE_URL%%\?*}"

echo "Aplicando migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

USER_COUNT=$(psql "$PSQL_URL" -tAc 'SELECT COUNT(*) FROM "Users";' 2>/dev/null || echo "0")
USER_COUNT=$(echo "$USER_COUNT" | tr -d '[:space:]')

if [ "$USER_COUNT" = "0" ]; then
  echo "Banco vazio — executando seed..."
  psql "$PSQL_URL" -f ./prisma/seed.sql
  echo "Seed concluído."
else
  echo "Banco já possui dados ($USER_COUNT usuários) — seed ignorado."
fi
