#!/bin/bash
# Setup GitHub Rulesets for OpenSourceFramework
# This script creates branch protection and tag protection rulesets
# 
# Prerequisites:
# - GitHub CLI (gh) installed and authenticated
# - Repository admin access to the target repository
#
# Usage:
#   ./scripts/setup-github-rulesets.sh [owner/repo]
#
# If no repository is specified, defaults to the origin remote.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get repository from argument or detect from git remote
if [ -n "$1" ]; then
    REPO="$1"
else
    REPO=$(git remote get-url origin 2>/dev/null | sed -E 's|.*github\.com[/:]([^/]+/[^/]+)(\.git)?|\1|')
    if [ -z "$REPO" ]; then
        echo -e "${RED}Error: Could not detect repository from git remote.${NC}"
        echo "Usage: $0 [owner/repo]"
        exit 1
    fi
fi

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${GREEN}Setting up GitHub Rulesets for: ${REPO}${NC}"
echo ""

# Check if gh is authenticated
if ! gh auth status &>/dev/null; then
    echo -e "${RED}Error: GitHub CLI is not authenticated. Run 'gh auth login' first.${NC}"
    exit 1
fi

# Check for existing rulesets
echo -e "${YELLOW}Checking for existing rulesets...${NC}"
EXISTING_RULESETS=$(gh api "repos/${REPO}/rulesets" 2>/dev/null || echo "[]")

# Check if main-branch-protection already exists
if echo "$EXISTING_RULESETS" | grep -q '"main-branch-protection"'; then
    echo -e "${YELLOW}⚠ main-branch-protection ruleset already exists. Skipping...${NC}"
else
    echo -e "${YELLOW}Creating main-branch-protection ruleset...${NC}"
    gh api "repos/${REPO}/rulesets" \
        -X POST \
        -H "Accept: application/vnd.github+json" \
        --input "${SCRIPT_DIR}/main-branch-ruleset.json"
    echo -e "${GREEN}✓ main-branch-protection ruleset created${NC}"
fi

echo ""

# Check if release-tag-protection already exists
if echo "$EXISTING_RULESETS" | grep -q '"release-tag-protection"'; then
    echo -e "${YELLOW}⚠ release-tag-protection ruleset already exists. Skipping...${NC}"
else
    echo -e "${YELLOW}Creating release-tag-protection ruleset...${NC}"
    gh api "repos/${REPO}/rulesets" \
        -X POST \
        -H "Accept: application/vnd.github+json" \
        --input "${SCRIPT_DIR}/tag-ruleset.json"
    echo -e "${GREEN}✓ release-tag-protection ruleset created${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}Ruleset setup complete!${NC}"
echo "=========================================="
echo ""
echo "Created rulesets:"
echo "  1. main-branch-protection - Protects the main branch with:"
echo "     - Deletion protection"
echo "     - Linear history required"
echo "     - Signed commits required"
echo "     - No force pushes"
echo ""
echo "  2. release-tag-protection - Protects version tags (v*) with:"
echo "     - Deletion protection"
echo "     - Update protection"
echo "     - No force pushes"
echo ""
echo "To view rulesets: gh ruleset list --repo ${REPO}"
echo "To view on web: https://github.com/${REPO}/settings/rules"
