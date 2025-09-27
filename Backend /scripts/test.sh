#!/bin/bash

# Exit on error
set -e

# Set environment variables for testing
export NODE_ENV=test
export JWT_SECRET=test-secret
export JWT_EXPIRES_IN=90d

# Run tests
if [ "$1" = "--watch" ]; then
  npx jest --watchAll --no-cache
else
  npx jest --coverage
fi
