#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-rpg_manager}; do
  sleep 1
done

echo "PostgreSQL is ready. Running migrations..."
npx prisma migrate deploy

echo "Database initialized successfully!"

