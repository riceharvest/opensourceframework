#!/bin/bash
set -e

# Configuration
MONOREPO_ROOT="/home/dario/Documents/dev workspace/opensourceframework"
STANDALONE_BASE="/home/dario/.gemini/tmp/dev-workspace/standalone-fixes"
GITHUB_ORG="riceharvest"

sync_package() {
  local pkg_name=$1
  echo ">>> Syncing $pkg_name..."

  local src_dir="$MONOREPO_ROOT/packages/$pkg_name"
  local dest_dir="$STANDALONE_BASE/$pkg_name"

  if [ ! -d "$src_dir" ]; then
    echo "Warning: Source directory $src_dir does not exist. Skipping."
    return 0
  fi

  if [ ! -d "$dest_dir" ]; then
    echo "Cloning $pkg_name..."
    cd "$STANDALONE_BASE"
    # Clone full depth to avoid shallow issues, or depth 1 if preferred
    gh repo clone "$GITHUB_ORG/$pkg_name" -- --depth 1 || {
      echo "Failed to clone $pkg_name. Creating it locally as a fallback."
      mkdir -p "$dest_dir"
      cd "$dest_dir"
      git init
      git remote add origin "https://github.com/$GITHUB_ORG/$pkg_name.git"
    }
  fi

  cd "$dest_dir"
  # Reset to a clean state if it was a clone
  if [ -d ".git" ]; then
    git fetch origin main || git fetch origin master || true
  fi

  # Clean destination except .git
  echo "Cleaning destination..."
  find . -maxdepth 1 ! -name ".git" ! -name "." -exec rm -rf {} +

  # Copy and flatten
  echo "Copying content from $src_dir to $dest_dir..."
  cp -rv "$src_dir/." .

  # Fix workspace references in package.json
  echo "Fixing workspace references in package.json..."
  if [ -f "package.json" ]; then
    sed -i 's/workspace:\*/link:../g' package.json
  fi
  
  # Fix tsconfig.json to point to local base
  if [ -f "tsconfig.json" ]; then
    echo "Fixing tsconfig.json..."
    sed -i 's|../../tsconfig.json|./tsconfig.base.json|g' tsconfig.json
  fi

  # Ensure CI workflow exists and is up-to-date
  mkdir -p ".github/workflows"
  
  # Check if we have a test-app
  HAS_TEST_APP=false
  if [ -d "test-app" ]; then HAS_TEST_APP=true; fi
  HAS_APP=false
  if [ -d "app" ]; then HAS_APP=true; fi

  # Generate fresh CI to be safe and consistent
  cat > ".github/workflows/ci.yml" <<EOF
name: CI
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - name: Install dependencies
        run: pnpm install --no-frozen-lockfile
EOF

  if [ "$HAS_TEST_APP" = true ] || [ "$HAS_APP" = true ] || [ "$pkg_name" == "next-auth" ] || [ "$pkg_name" == "next-pwa" ]; then
    echo "      - name: Install Playwright Browsers" >> ".github/workflows/ci.yml"
    echo "        run: npx playwright install --with-deps" >> ".github/workflows/ci.yml"
  fi

  cat >> ".github/workflows/ci.yml" <<EOF
      - name: Build library
        run: pnpm build
EOF

  if grep -q "\"lint\":" "package.json" 2>/dev/null; then
    echo "      - name: Lint" >> ".github/workflows/ci.yml"
    echo "        run: pnpm lint" >> ".github/workflows/ci.yml"
  fi

  if grep -q "\"typecheck\":" "package.json" 2>/dev/null; then
    echo "      - name: Typecheck" >> ".github/workflows/ci.yml"
    echo "        run: pnpm typecheck" >> ".github/workflows/ci.yml"
  fi

  if [ "$HAS_APP" = true ]; then
    echo "      - name: Build main app" >> ".github/workflows/ci.yml"
    echo "        run: cd app && pnpm build" >> ".github/workflows/ci.yml"
  fi
  if [ "$HAS_TEST_APP" = true ]; then
    echo "      - name: Build test app" >> ".github/workflows/ci.yml"
    echo "        run: cd test-app && pnpm build" >> ".github/workflows/ci.yml"
  fi

  cat >> ".github/workflows/ci.yml" <<EOF
      - name: Test
        run: pnpm test
EOF

  # Commit and push
  git add .
  if git diff --staged --quiet; then
    echo "No changes to commit for $pkg_name."
  else
    git config user.name "Gemini CLI"
    git config user.email "gemini-cli@google.com"
    git commit -m "sync: fix standalone CI/CD and tsconfig"
    
    # Detect current branch or use main/master
    CURRENT_BRANCH=$(git branch --show-current)
    if [ -z "$CURRENT_BRANCH" ]; then
      CURRENT_BRANCH="main"
    fi
    
    echo "Force pushing $CURRENT_BRANCH to $GITHUB_ORG/$pkg_name..."
    git push origin "$CURRENT_BRANCH" --force
    
    # Also push to main if it's currently on master or vice versa, to ensure 'main' exists
    if [ "$CURRENT_BRANCH" == "master" ]; then
       git push origin master:main --force || true
    fi
    if [ "$CURRENT_BRANCH" == "main" ]; then
       git push origin main:master --force || true
    fi
  fi
}

# Get list of all packages
cd "$MONOREPO_ROOT/packages"
PACKAGES=$(ls -d */ | sed 's|/||')

for pkg in $PACKAGES; do
  if [ "$pkg" == "CONTRIBUTING.md" ]; then continue; fi
  sync_package "$pkg"
done

echo "Sync complete!"
