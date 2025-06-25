#!/usr/bin/env bash
set -e

# echo "Running migrations..."
# npm run migration:run || exit 1

# echo "Running seeds..."
# npm run seed:run:relational || exit 1

echo "Starting application..."
exec npm run start:prod
