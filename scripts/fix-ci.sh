#!/bin/bash
set -e

PACKAGES_DIR="/home/dario/Documents/dev workspace/opensourceframework/packages"

for pkg_dir in "$PACKAGES_DIR"/*/; do
  if [ ! -d "$pkg_dir" ]; then continue; fi
  pkg_name=$(basename "$pkg_dir")
  
  # Skip non-package directories
  if [ "$pkg_name" == "CONTRIBUTING.md" ]; then continue; fi
  
  echo "Processing $pkg_name..."
  
  # Ensure .github/workflows directory exists
  mkdir -p "$pkg_dir/.github/workflows"
  
  # Define the CI file path
  CI_FILE="$pkg_dir/.github/workflows/ci.yml"
  
  # Check if it has test-app
  HAS_TEST_APP=false
  if [ -d "$pkg_dir/test-app" ]; then
    HAS_TEST_APP=true
  fi
  
  # Check if it has app (next-auth)
  HAS_APP=false
  if [ -d "$pkg_dir/app" ]; then
    HAS_APP=true
  fi
  
  # Standard CI content
  cat > "$CI_FILE" <<EOF
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
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

  # Add Playwright if test-app or app exists
  if [ "$HAS_TEST_APP" = true ] || [ "$HAS_APP" = true ]; then
    cat >> "$CI_FILE" <<EOF
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
EOF
  fi

  # Add Build library
  cat >> "$CI_FILE" <<EOF
      - name: Build library
        run: pnpm build
EOF

  # Add Lint if script exists
  if grep -q "\"lint\":" "$pkg_dir/package.json"; then
    cat >> "$CI_FILE" <<EOF
      - name: Lint
        run: pnpm lint
EOF
  fi

  # Add Typecheck if script exists
  if grep -q "\"typecheck\":" "$pkg_dir/package.json"; then
    cat >> "$CI_FILE" <<EOF
      - name: Typecheck
        run: pnpm typecheck
EOF
  fi

  # Add Build apps if they exist
  if [ "$HAS_APP" = true ]; then
    cat >> "$CI_FILE" <<EOF
      - name: Build main app
        run: cd app && pnpm build
EOF
  fi
  if [ "$HAS_TEST_APP" = true ]; then
    cat >> "$CI_FILE" <<EOF
      - name: Build test app
        run: cd test-app && pnpm build
EOF
  fi

  # Add Test
  cat >> "$CI_FILE" <<EOF
      - name: Test
        run: pnpm test
EOF

done

echo "All CI workflows updated!"
