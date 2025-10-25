#!/bin/sh
set -e

echo "Starting database setup..."

# Generate migrations (if needed)
echo "Generating migrations..."
pnpm db:generate

echo "Running migrations..."
pnpm db:migrate

# Push schema changes
echo "Pushing schema changes..."
pnpm db:push

echo "Database setup complete. Starting application..."

exec "$@"