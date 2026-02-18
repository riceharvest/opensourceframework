#!/bin/bash
# Look at how messy this script is :p

NEXT_VERSION="13.4.12"
ROOT=$(pwd)

echo "==================== NPM ===================="
npm --prefix "$ROOT/src/__tests__/__apps__/npm-basic" install "next@$NEXT_VERSION" --save-exact

echo "==================== PNPM ===================="
pnpm --dir "$ROOT/src/__tests__/__apps__/pnpm" install "next@$NEXT_VERSION"

echo "==================== YARN WORKSPACES ===================="
yarn --cwd "$ROOT/src/__tests__/__apps__/yarn-workspaces/app" add "next@$NEXT_VERSION"

echo "==================== YARN WORKSPACES SYMLINKS ===================="
yarn --cwd "$ROOT/src/__tests__/__apps__/yarn-workspaces-symlinks/app" add "next@$NEXT_VERSION"

echo "==================== SWC ===================="
yarn --cwd "$ROOT/src/__tests__/__apps__/swc/app" add "next@$NEXT_VERSION"

echo "==================== WITH-APP-DIR ===================="
yarn --cwd "$ROOT/src/__tests__/__apps__/with-app-dir/app" add "next@$NEXT_VERSION"
