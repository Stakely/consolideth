#!/usr/bin/env bash
set -e

# /opt/wait-for-it.sh mysql:3306 -t 45
# pnpm run migration:run
# pnpm run seed:run:relational
pnpm run start:prod > prod.log 2>&1 &
pnpm run lint
sleep 5
pnpm run test:e2e -- --runInBand
# pnpm run test:e2e
