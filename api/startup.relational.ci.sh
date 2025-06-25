#!/usr/bin/env bash
set -e

# /opt/wait-for-it.sh mysql:3306 -t 45
# npm run migration:run
# npm run seed:run:relational
npm run start:prod > prod.log 2>&1 &
npm run lint
sleep 5
npm run test:e2e -- --runInBand
# npm run test:e2e
