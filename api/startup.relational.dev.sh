#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh mysql:3306
pnpm run migration:run
pnpm run seed:run:relational
pnpm run start:prod
