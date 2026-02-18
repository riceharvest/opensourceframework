#!/bin/bash

# Setup All Packages Script for OpenSource Framework
# Orchestrates the fork setup for all 10 target packages with proper ordering

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Target packages in priority order (highest priority first)
# Format: "package-name|repo-url|author|original-package-name"
PACKAGES=(
    # High Priority, Low-Medium Effort (Quick wins)
    "next-compose-plugins|https://github.com/hoangvvo/next-compose-plugins|Hoang Vo|next-compose-plugins"
    "next-cookies|https://github.com/hoangvvo/next-cookies|Hoang Vo|next-cookies"
    "next-mdx|https://github.com/hoangvvo/next-mdx|Hoang Vo|@next/mdx"

    # Medium Priority, Medium Effort
    "next-session|https://github.com/hoangvvo/next-session|Hoang Vo|next-session"
    "next-iron-session|https://github.com/vvo/next-iron-session|Vladimir|next-iron-session"

    # High Impact, Medium Effort
    "next-seo|https://github.com/garmeeh/next-seo|Gary Meehan|next-seo"
    "next-transpile-modules|https://github.com/hoangvvo/next-transpile-modules|Hoang Vo|next-transpile-modules"

    # High Effort, Critical
    # Note: next-auth v3 is archived, will need special handling
    "next-auth|https://github.com/nextauthjs/next-auth|NextAuth.js Team|next-auth"

    # High Effort, High Impact
    "next-pwa|https://github.com/hanford/next-pwa|Jeffrey Hanford|next-pwa"
    "react-virtualized|https://github.com/bvaughn/react-virtualized|Brian Vaughn|react-virtualized"
)

# Usage
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --dry-run           Show what would be done without doing it"
    echo "  --skip-existing     Skip packages that already have a directory"
    echo "  --force             Overwrite existing package directories"
    echo "  --start-index N     Start from package at index N (0-based)"
    echo "  --help              Show this help message"
    echo ""
    echo "Package Order (Priority):"
    for i in "${!PACKAGES[@]}"; do
        IFS='|' read -r name repo author orig <<< "${PACKAGES[$i]}"
        printf "  %2d. %s (from %s)\n" $((i+1)) "$name" "$orig"
    done
    exit 0
}

# Options
DRY_RUN=false
SKIP_EXISTING=false
FORCE=false
START_INDEX=0

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --skip-existing)
            SKIP_EXISTING=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --start-index)
            START_INDEX="$2"
            shift 2
            ;;
        --help)
            show_help
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_help
            ;;
    esac
done

echo -e "${BLUE}=== OpenSource Framework - Setup All Packages ===${NC}"
echo -e "Total packages to setup: ${YELLOW}${#PACKAGES[@]}${NC}"
echo -e "Starting from index: ${YELLOW}$START_INDEX${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}=== DRY RUN MODE ===${NC}"
    echo "No changes will be made."
    echo ""
fi

# Track results
SUCCESS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0

# Process each package
for i in "${!PACKAGES[@]}"; do
    # Skip packages before start index
    if [ "$i" -lt "$START_INDEX" ]; then
        continue
    fi

    IFS='|' read -r PACKAGE_NAME REPO_URL AUTHOR ORIGINAL_PACKAGE <<< "${PACKAGES[$i]}"
    FULL_PACKAGE_NAME="@opensourceframework/$PACKAGE_NAME"
    TARGET_DIR="packages/$PACKAGE_NAME"

    echo -e "${BLUE}--------------------------------------------------${NC}"
    echo -e "${BLUE}[$((i+1))/${#PACKAGES[@]}] Processing:${NC} ${GREEN}$FULL_PACKAGE_NAME${NC}"
    echo -e "  Original: ${YELLOW}$ORIGINAL_PACKAGE${NC}"
    echo -e "  Author: ${YELLOW}$AUTHOR${NC}"
    echo -e "  Repo: ${YELLOW}$REPO_URL${NC}"
    echo ""

    # Check if already exists
    if [ -d "$TARGET_DIR" ] && [ "$SKIP_EXISTING" = true ]; then
        echo -e "${YELLOW}⊘ Skipping (already exists)${NC}"
        SKIP_COUNT=$((SKIP_COUNT+1))
        continue
    fi

    # Check if already exists and not forcing
    if [ -d "$TARGET_DIR" ] && [ "$FORCE" = false ]; then
        echo -e "${YELLOW}⊘ Skipping (use --force to overwrite)${NC}"
        SKIP_COUNT=$((SKIP_COUNT+1))
        continue
    fi

    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}[DRY RUN] Would run:${NC} ./scripts/fork-setup.sh \"$PACKAGE_NAME\" \"$REPO_URL\" \"$AUTHOR\" \"$ORIGINAL_PACKAGE\""
        if [ "$FORCE" = true ]; then
            echo -e "${YELLOW}[DRY RUN] With --force flag${NC}"
        fi
        echo ""
        continue
    fi

    # Run the fork setup script
    FORCE_FLAG=""
    if [ "$FORCE" = true ]; then
        FORCE_FLAG="--force"
    fi

    if ./scripts/fork-setup.sh "$PACKAGE_NAME" "$REPO_URL" "$AUTHOR" "$ORIGINAL_PACKAGE" $FORCE_FLAG; then
        echo -e "${GREEN}✓ Successfully set up $FULL_PACKAGE_NAME${NC}"
        SUCCESS_COUNT=$((SUCCESS_COUNT+1))
    else
        echo -e "${RED}✗ Failed to set up $FULL_PACKAGE_NAME${NC}"
        FAIL_COUNT=$((FAIL_COUNT+1))
    fi

    echo ""
done

# Summary
echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}=== Summary ===${NC}"
echo -e "  Total packages: ${YELLOW}${#PACKAGES[@]}${NC}"
echo -e "  ${GREEN}Successful: $SUCCESS_COUNT${NC}"
echo -e "  ${RED}Failed: $FAIL_COUNT${NC}"
echo -e "  ${YELLOW}Skipped: $SKIP_COUNT${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}This was a dry run. No packages were actually set up.${NC}"
else
    if [ "$FAIL_COUNT" -eq 0 ]; then
        echo -e "${GREEN}All packages processed successfully!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Review each package's package.json and README.md"
        echo "2. Ensure tests pass: pnpm test"
        echo "3. Create changesets for each package: pnpm changeset"
        echo "4. Update .github/CODEOWNERS with new package maintainers"
        echo "5. Check npm package name availability (see plans/npm-squatting-monitor.md)"
    else
        echo -e "${RED}Some packages failed to set up. Check the logs above.${NC}"
        echo "Common issues:"
        echo "  - Repository not accessible (requires SSH setup)"
        echo "  - Package already exists (use --force to overwrite)"
        echo "  - Network connectivity issues"
    fi
fi

echo ""
