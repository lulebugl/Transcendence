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

if [ "$NODE_ENV" = "development" ]; then
    echo "Starting Drizzle Studio..."
    npx drizzle-kit studio --host 0.0.0.0 --port 4983 &> /dev/null &
fi

echo "Database setup complete. Starting application..."
exec "$@"