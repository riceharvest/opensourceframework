#!/bin/bash

# Fork Setup Script for OpenSource Framework
# Usage: ./scripts/fork-setup.sh <package-name> <original-repo-url> [original-author] [original-repo]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
PACKAGE_NAME=""
ORIGINAL_REPO_URL=""
ORIGINAL_AUTHOR="Unknown"
ORIGINAL_REPO=""
TEMP_DIR=""
FORCE=false

# Help function
show_help() {
    echo "Usage: $0 <package-name> <original-repo-url> [original-author] [original-repo]"
    echo ""
    echo "Arguments:"
    echo "  package-name        Name of the package (e.g., next-seo)"
    echo "  original-repo-url   GitHub URL of the original repository"
    echo "  original-author     Original author name (optional, defaults to 'Unknown')"
    echo "  original-repo       Original package name in package.json (optional, defaults to package-name)"
    echo ""
    echo "Options:"
    echo "  --force             Overwrite existing package directory"
    echo "  --help              Show this help message"
    echo ""
    echo "Example:"
    echo "  $0 next-seo https://github.com/garmeeh/next-seo \"Gary Meehan\" next-seo"
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --force)
            FORCE=true
            shift
            ;;
        --help)
            show_help
            ;;
        -*)
            echo -e "${RED}Unknown option: $1${NC}"
            show_help
            ;;
        *)
            if [ -z "$PACKAGE_NAME" ]; then
                PACKAGE_NAME="$1"
            elif [ -z "$ORIGINAL_REPO_URL" ]; then
                ORIGINAL_REPO_URL="$1"
            elif [ -z "$ORIGINAL_AUTHOR" ]; then
                ORIGINAL_AUTHOR="$1"
            else
                ORIGINAL_REPO="$1"
            fi
            shift
            ;;
    esac
done

# Validate required arguments
if [ -z "$PACKAGE_NAME" ] || [ -z "$ORIGINAL_REPO_URL" ]; then
    echo -e "${RED}Error: Missing required arguments${NC}"
    show_help
fi

# Set default for optional parameters
if [ -z "$ORIGINAL_REPO" ]; then
    ORIGINAL_REPO="$PACKAGE_NAME"
fi

# Normalize package name (remove @opensourceframework/ prefix if present)
PACKAGE_NAME=$(echo "$PACKAGE_NAME" | sed 's|^@opensourceframework/||')
FULL_PACKAGE_NAME="@opensourceframework/$PACKAGE_NAME"
TARGET_DIR="packages/$PACKAGE_NAME"

echo -e "${BLUE}=== OpenSource Framework Fork Setup ===${NC}"
echo -e "Package: ${GREEN}$FULL_PACKAGE_NAME${NC}"
echo -e "Original Repo: ${YELLOW}$ORIGINAL_REPO_URL${NC}"
echo -e "Original Author: ${YELLOW}$ORIGINAL_AUTHOR${NC}"
echo -e "Original Package Name: ${YELLOW}$ORIGINAL_REPO${NC}"
echo -e "Target Directory: ${YELLOW}$TARGET_DIR${NC}"
echo ""

# Check if target directory already exists
if [ -d "$TARGET_DIR" ] && [ "$FORCE" = false ]; then
    echo -e "${RED}Error: Target directory '$TARGET_DIR' already exists${NC}"
    echo "Use --force to overwrite, or remove the directory manually."
    exit 1
fi

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo -e "${BLUE}Creating temporary directory:${NC} $TEMP_DIR"

# Cleanup function
cleanup() {
    if [ -d "$TEMP_DIR" ]; then
        echo -e "${BLUE}Cleaning up temporary directory${NC}"
        rm -rf "$TEMP_DIR"
    fi
}

trap cleanup EXIT

# Step 1: Clone the original repository
echo -e "\n${BLUE}[1/10] Cloning original repository...${NC}"
if git clone "$ORIGINAL_REPO_URL" "$TEMP_DIR/original" 2>/dev/null; then
    echo -e "${GREEN}✓ Repository cloned successfully${NC}"
else
    echo -e "${RED}✗ Failed to clone repository${NC}"
    echo "Note: Some archived repositories may not be directly cloneable."
    echo "You may need to:"
    echo "  1. Contact the original maintainer for code transfer"
    echo "  2. Download the repository manually and place it in $TEMP_DIR/original"
    exit 1
fi

# Check if the clone was successful
if [ ! -d "$TEMP_DIR/original/.git" ]; then
    echo -e "${RED}✗ Not a valid git repository${NC}"
    exit 1
fi

# Step 2: Copy files to target directory
echo -e "\n${BLUE}[2/10] Copying files to target directory...${NC}"
if [ "$FORCE" = true ] && [ -d "$TARGET_DIR" ]; then
    rm -rf "$TARGET_DIR"
fi
mkdir -p "$(dirname "$TARGET_DIR")"

# Copy all files except .git
cp -r "$TEMP_DIR/original/." "$TARGET_DIR"
# Remove .git directory
rm -rf "$TARGET_DIR/.git"
echo -e "${GREEN}✓ Files copied${NC}"

# Step 3: Transform package.json
echo -e "\n${BLUE}[3/10] Transforming package.json...${NC}"
if [ -f "$TARGET_DIR/package.json" ]; then
    # Use Node.js to transform the package.json. The original manifest remains in
    # the temporary clone for the duration of the run; do not leave backup files
    # in package directories where they can be accidentally committed.
    node -e "
const fs = require('fs');
const path = '$TARGET_DIR/package.json';
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));

// Transform package
pkg.name = '$FULL_PACKAGE_NAME';
if (!pkg.repository) pkg.repository = {};
if (typeof pkg.repository === 'string') pkg.repository = { type: 'git', url: pkg.repository };
pkg.repository.url = 'git+https://github.com/riceharvest/opensourceframework.git';
pkg.repository.directory = 'packages/$PACKAGE_NAME';
pkg.repository.type = 'git';

// Remove private field if present
if (pkg.private) delete pkg.private;

// Update author field
if (pkg.author && typeof pkg.author === 'string') {
    pkg.author = 'OpenSource Framework Contributors (fork), Original: $ORIGINAL_AUTHOR';
} else if (pkg.author && typeof pkg.author === 'object') {
    pkg.author.name = 'OpenSource Framework Contributors (fork), Original: ' + (pkg.author.name || '$ORIGINAL_AUTHOR');
}

// Update contributors to include original
if (!pkg.contributors || !Array.isArray(pkg.contributors)) {
    pkg.contributors = [];
}
pkg.contributors.unshift({
    name: '$ORIGINAL_AUTHOR',
    url: 'https://github.com/$ORIGINAL_REPO'
});

// Update bugs URL
if (pkg.bugs) {
    pkg.bugs.url = 'https://github.com/riceharvest/opensourceframework/issues?q=is%3Aissue+is%3Aopen+$PACKAGE_NAME';
}

// Update homepage
pkg.homepage = 'https://github.com/riceharvest/opensourceframework/tree/main/packages/$PACKAGE_NAME#readme';

// Update publish config
pkg.publishConfig = { access: 'public' };

// Update engines
pkg.engines = pkg.engines || {};
pkg.engines.node = '>=18.0.0';

// Add funding if not present
if (!pkg.funding) {
    pkg.funding = {
        type: 'GitHub',
        url: 'https://github.com/sponsors/riceharvest'
    };
}

// Write transformed package.json
fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
console.log('✓ package.json transformed');
"
    echo -e "${GREEN}✓ package.json updated${NC}"
else
    echo -e "${YELLOW}! No package.json found, skipping${NC}"
fi

# Step 4: Create/update README with OpenSourceFramework branding
echo -e "\n${BLUE}[4/10] Updating README.md...${NC}"
if [ -f "$TARGET_DIR/README.md" ]; then
    # Extract original repo info from package.json
    ORIGINAL_REPO_NAME=$(node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('$TARGET_DIR/package.json', 'utf8'));
const url = pkg.repository?.url || pkg.homepage || '';
const match = url.match(/\/([^\/]+)\/?$/);
console.log(match ? match[1] : '');
")

    # Create updated README
    node -e "
const fs = require('fs');
const path = '$TARGET_DIR/README.md';
const content = fs.readFileSync(path, 'utf8');

// Replace package name references
const originalPkg = process.env.ORIGINAL_REPO || '$PACKAGE_NAME';
const newPkg = '$FULL_PACKAGE_NAME';

// Update package name in badges and imports
let updated = content
    .replace(new RegExp(originalPkg, 'g'), newPkg)
    .replace(/https:\/\/badge\.fury\.io\/js\/[^/]+\/\.svg/g, 'https://badge.fury.io/js/@opensourceframework/$PACKAGE_NAME.svg')
    .replace(/(badge\.fury\.io\/js\/)([^\/]+)(\.svg)/g, 'https://badge.fury.io/js/@opensourceframework/$PACKAGE_NAME.svg');

// Add attribution section if not present
if (!updated.includes('## Attribution')) {
    updated = updated.replace(
        /(# Features|# Installation|# Quick Start)/,
        '## Attribution\\n\\n- **Original Author**: $ORIGINAL_AUTHOR\\n- **Original Repository**: $ORIGINAL_REPO_URL\\n- **Original License**: MIT\\n\\n$1'
    );
}

fs.writeFileSync(path, updated);
console.log('✓ README.md updated');
"
    echo -e "${GREEN}✓ README.md updated with OpenSourceFramework branding${NC}"
else
    echo -e "${YELLOW}! No README.md found, will create from template${NC}"
fi

# Step 5: Add .changeset config if missing
echo -e "\n${BLUE}[5/10] Setting up Changeset configuration...${NC}"
if [ ! -f "$TARGET_DIR/.changeset/config.json" ]; then
    mkdir -p "$TARGET_DIR/.changeset"
    cp templates/.changeset/config.json.template "$TARGET_DIR/.changeset/config.json"
    echo -e "${GREEN}✓ .changeset/config.json created${NC}"
else
    echo -e "${YELLOW}! .changeset/config.json already exists${NC}"
fi

# Step 6: Set up TypeScript config
echo -e "\n${BLUE}[6/10] Setting up TypeScript configuration...${NC}"
if [ ! -f "$TARGET_DIR/tsconfig.json" ]; then
    # Inherit from root tsconfig
    echo '{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}' > "$TARGET_DIR/tsconfig.json"
    echo -e "${GREEN}✓ tsconfig.json created${NC}"
else
    echo -e "${YELLOW}! tsconfig.json already exists${NC}"
fi

# Step 7: Create vitest config if no tests exist
echo -e "\n${BLUE}[7/10] Setting up Vitest configuration...${NC}"
if [ ! -f "$TARGET_DIR/vitest.config.ts" ] && [ ! -f "$TARGET_DIR/vitest.config.js" ]; then
    cp templates/vitest.config.template.ts "$TARGET_DIR/vitest.config.ts"
    echo -e "${GREEN}✓ vitest.config.ts created${NC}"
else
    echo -e "${YELLOW}! vitest config already exists${NC}"
fi

# Step 8: Create tsup config if missing
echo -e "\n${BLUE}[8/10] Setting up tsup configuration...${NC}"
if [ ! -f "$TARGET_DIR/tsup.config.ts" ] && [ ! -f "$TARGET_DIR/tsup.config.js" ]; then
    # Extract external dependencies from package.json
    EXTERNAL_DEPS=$(node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('$TARGET_DIR/package.json', 'utf8'));
const deps = { ...pkg.dependencies, ...pkg.peerDependencies };
const list = Object.keys(deps || {}).filter(d => d !== 'next');
console.log(list.join('\',\''));
")
    sed "s#{external-dependencies}#$EXTERNAL_DEPS#" templates/tsup.config.template.ts > "$TARGET_DIR/tsup.config.ts"
    echo -e "${GREEN}✓ tsup.config.ts created${NC}"
else
    echo -e "${YELLOW}! tsup config already exists${NC}"
fi

# Step 9: Update imports to use new package name (if needed)
echo -e "\n${BLUE}[9/10] Checking imports...${NC}"
if [ -n "$ORIGINAL_REPO" ] && [ "$ORIGINAL_REPO" != "$PACKAGE_NAME" ]; then
    echo -e "${YELLOW}! Original package name differs from package-name, manual import updates may be needed${NC}"
    echo "  Search for: import ... from '$ORIGINAL_REPO'"
    echo "  Replace with: import ... from '$FULL_PACKAGE_NAME'"
else
    echo -e "${GREEN}✓ No import updates needed${NC}"
fi

# Step 10: Create initial commit
echo -e "\n${BLUE}[10/10] Creating initial commit...${NC}"
cd "$TARGET_DIR"
git init
git add .
git commit -m "feat($PACKAGE_NAME): fork from $ORIGINAL_REPO_URL

This is a maintained fork of the original $ORIGINAL_REPO package.
Original author: $ORIGINAL_AUTHOR

Co-authored-by: $ORIGINAL_AUTHOR <noreply@github.com>"

echo -e "${GREEN}✓ Initial commit created${NC}"

# Summary
echo -e "\n${GREEN}=== Fork Setup Complete ===${NC}"
echo -e "Package: ${GREEN}$FULL_PACKAGE_NAME${NC}"
echo -e "Location: ${YELLOW}$TARGET_DIR${NC}"
echo ""
echo "Next steps:"
echo "1. Review the package.json and update any missing fields"
echo "2. Update the README.md with specific documentation"
echo "3. Add tests if missing"
echo "4. Run: pnpm install (in the monorepo root)"
echo "5. Run: pnpm --filter $FULL_PACKAGE_NAME build"
echo "6. Run: pnpm --filter $FULL_PACKAGE_NAME test"
echo ""
echo "To complete the setup:"
echo "  - Add the package to the monorepo's package.json workspaces if not auto-detected"
echo "  - Update .github/CODEOWNERS to include this package"
echo "  - Create a changeset: pnpm changeset"
echo ""
