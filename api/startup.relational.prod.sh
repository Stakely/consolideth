#!/usr/bin/env bash
set -e

# echo "Running migrations..."
# pnpm run migration:run || exit 1

# echo "Running seeds..."
# pnpm run seed:run:relational || exit 1

echo "Starting application..."
exec pnpm run start:prod
