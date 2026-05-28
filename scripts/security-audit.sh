#!/bin/bash

# Security Audit Script for OpenSource Framework Packages
# Audits all packages for vulnerabilities and generates reports

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
REPORT_DIR="plans/security-audits"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
AUDIT_LEVEL="low"  # Options: low, moderate, high, critical

# Usage
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --level LEVEL        Audit level: low, moderate, high, critical (default: low)"
    echo "  --output DIR         Output directory for reports (default: plans/security-audits)"
    echo "  --packages LIST      Comma-separated list of packages to audit (default: all)"
    echo "  --fix                Attempt to automatically fix vulnerabilities (pnpm audit --fix)"
    echo "  --dry-run            Show what would be audited without auditing"
    echo "  --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Audit all packages with low level"
    echo "  $0 --level moderate                  # Audit all with moderate+ level"
    echo "  $0 --packages next-csrf,next-images  # Audit specific packages"
    echo "  $0 --fix                             # Audit and attempt to fix"
    exit 0
}

# Parse arguments
AUDIT_PACKAGES=""
FIX_VULNS=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --level)
            AUDIT_LEVEL="$2"
            shift 2
            ;;
        --output)
            REPORT_DIR="$2"
            shift 2
            ;;
        --packages)
            AUDIT_PACKAGES="$2"
            shift 2
            ;;
        --fix)
            FIX_VULNS=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
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

# Validate audit level
VALID_LEVELS=("low" "moderate" "high" "critical")
if [[ ! " ${VALID_LEVELS[@]} " =~ " ${AUDIT_LEVEL} " ]]; then
    echo -e "${RED}Error: Invalid audit level '$AUDIT_LEVEL'${NC}"
    echo "Valid levels: ${VALID_LEVELS[*]}"
    exit 1
fi

REPORT_FILE="$REPORT_DIR/audit-report-$TIMESTAMP.md"
SUMMARY_FILE="$REPORT_DIR/audit-summary-$TIMESTAMP.json"

# Create report directory
if [ "$DRY_RUN" = false ]; then
    mkdir -p "$REPORT_DIR"
fi

echo -e "${BLUE}=== OpenSource Framework Security Audit ===${NC}"
echo -e "Audit Level: ${YELLOW}$AUDIT_LEVEL${NC}"
echo -e "Report Directory: ${YELLOW}$REPORT_DIR${NC}"
echo -e "Timestamp: ${YELLOW}$TIMESTAMP${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}=== DRY RUN MODE ===${NC}"
    echo "No audits will be performed."
    echo ""
fi

# Get list of packages
if [ -z "$AUDIT_PACKAGES" ]; then
    # Find all package.json files in packages/ directory
    mapfile -t PACKAGE_JSONS < <(find packages -name "package.json" -type f | sort)
else
    # Use provided list
    IFS=',' read -ra PKG_NAMES <<< "$AUDIT_PACKAGES"
    PACKAGE_JSONS=()
    for pkg in "${PKG_NAMES[@]}"; do
        PACKAGE_JSONS+=("packages/$pkg/package.json")
    done
fi

echo -e "${BLUE}Packages to audit: ${YELLOW}${#PACKAGE_JSONS[@]}${NC}"
echo ""

# Initialize summary
SUMMARY='{"timestamp":"'"$TIMESTAMP"'","audit_level":"'"$AUDIT_LEVEL"'","packages":[],"total_vulnerabilities":0,"critical":0,"high":0,"moderate":0,"low":0}'

# Audit each package
for pkg_json in "${PACKAGE_JSONS[@]}"; do
    if [ ! -f "$pkg_json" ]; then
        echo -e "${YELLOW}⚠ Skipping $pkg_json (not found)${NC}"
        continue
    fi

    PKG_DIR=$(dirname "$pkg_json")
    PKG_NAME=$(node -p "require('./$pkg_json').name" 2>/dev/null || echo "unknown")

    echo -e "${BLUE}Auditing: ${YELLOW}$PKG_NAME${NC}"
    echo -e "  Directory: $PKG_DIR"
    echo ""

    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}[DRY RUN] Would run: pnpm -C $PKG_DIR audit --audit-level=$AUDIT_LEVEL${NC}"
        echo ""
        continue
    fi

    # Run pnpm audit. Temporarily disable errexit so vulnerability findings
    # (reported by pnpm as a non-zero exit) can be parsed into the report.
    AUDIT_ERROR_FILE=$(mktemp)
    set +e
    AUDIT_OUTPUT=$(pnpm -C "$PKG_DIR" audit --audit-level="$AUDIT_LEVEL" --json 2>"$AUDIT_ERROR_FILE")
    AUDIT_EXIT=$?
    set -e
    AUDIT_ERROR=$(cat "$AUDIT_ERROR_FILE")
    rm -f "$AUDIT_ERROR_FILE"

    if ! echo "$AUDIT_OUTPUT" | node -e "JSON.parse(require('fs').readFileSync(0, 'utf8'))" >/dev/null 2>&1; then
        echo -e "${RED}✗ pnpm audit failed before returning JSON${NC}"
        if [ -n "$AUDIT_ERROR" ]; then
            echo "$AUDIT_ERROR"
        fi
        if [ -n "$AUDIT_OUTPUT" ]; then
            echo "$AUDIT_OUTPUT"
        fi
        if [ $AUDIT_EXIT -eq 0 ]; then
            exit 1
        fi
        exit $AUDIT_EXIT
    fi

    if [ $AUDIT_EXIT -ne 0 ] && ! echo "$AUDIT_OUTPUT" | node -e "
const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
process.exit(data && data.vulnerabilities ? 0 : 1);
" >/dev/null 2>&1; then
        echo -e "${RED}✗ pnpm audit failed without vulnerability data${NC}"
        if [ -n "$AUDIT_ERROR" ]; then
            echo "$AUDIT_ERROR"
        fi
        echo "$AUDIT_OUTPUT"
        exit $AUDIT_EXIT
    fi

    # Parse audit results
    if [ $AUDIT_EXIT -eq 0 ]; then
        echo -e "${GREEN}✓ No vulnerabilities found${NC}"
        VULN_COUNT=0
        CRITICAL=0
        HIGH=0
        MODERATE=0
        LOW=0
        VULN_DETAILS="[]"
    else
        echo -e "${RED}✗ Vulnerabilities detected${NC}"

        # Parse JSON output
        VULN_COUNT=$(echo "$AUDIT_OUTPUT" | node -e "
const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
if (data.vulnerabilities) {
    const counts = { critical: 0, high: 0, moderate: 0, low: 0 };
    Object.values(data.vulnerabilities).forEach(v => {
        if (v.severity) counts[v.severity] = (counts[v.severity] || 0) + 1;
    });
    console.log(Object.values(counts).reduce((a, b) => a + b, 0));
} else {
    console.log(0);
}
" 2>/dev/null || echo "0")

        CRITICAL=$(echo "$AUDIT_OUTPUT" | node -e "
const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
if (data.vulnerabilities) {
    console.log(Object.values(data.vulnerabilities).filter(v => v.severity === 'critical').length);
} else { console.log(0); }
" 2>/dev/null || echo "0")

        HIGH=$(echo "$AUDIT_OUTPUT" | node -e "
const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
if (data.vulnerabilities) {
    console.log(Object.values(data.vulnerabilities).filter(v => v.severity === 'high').length);
} else { console.log(0); }
" 2>/dev/null || echo "0")

        MODERATE=$(echo "$AUDIT_OUTPUT" | node -e "
const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
if (data.vulnerabilities) {
    console.log(Object.values(data.vulnerabilities).filter(v => v.severity === 'moderate').length);
} else { console.log(0); }
" 2>/dev/null || echo "0")

        LOW=$(echo "$AUDIT_OUTPUT" | node -e "
const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
if (data.vulnerabilities) {
    console.log(Object.values(data.vulnerabilities).filter(v => v.severity === 'low').length);
} else { console.log(0); }
" 2>/dev/null || echo "0")

        # Extract vulnerability details
        VULN_DETAILS=$(echo "$AUDIT_OUTPUT" | node -e "
const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
if (data.vulnerabilities) {
    const vulns = [];
    Object.entries(data.vulnerabilities).forEach(([name, vuln]) => {
        if (vuln.severity && ['critical', 'high', 'moderate'].includes(vuln.severity)) {
            vulns.push({
                name,
                severity: vuln.severity,
                via: vuln.via ? vuln.via.map(v => ({
                    source: v.source,
                    name: v.name,
                    version: v.version,
                    range: v.range,
                    fixed: v.fixed || null
                })) : []
            });
        }
    });
    console.log(JSON.stringify(vulns, null, 2));
} else {
    console.log('[]');
}
" 2>/dev/null || echo "[]")
    fi

    # Try to fix if requested
    if [ "$FIX_VULNS" = true ] && [ $VULN_COUNT -gt 0 ]; then
        echo -e "${YELLOW}  Attempting to fix vulnerabilities...${NC}"
        if pnpm -C "$PKG_DIR" audit --fix 2>&1 | tee /tmp/audit-fix.log; then
            echo -e "${GREEN}  ✓ Fix attempted. Re-run audit to verify.${NC}"
        else
            echo -e "${YELLOW}  ⚠ Some fixes may require manual intervention${NC}"
        fi
    fi

    echo ""

    # Add to summary
    PKG_SUMMARY=$(cat <<EOF
{
  "name": "$PKG_NAME",
  "directory": "$PKG_DIR",
  "vulnerabilities": $VULN_COUNT,
  "critical": $CRITICAL,
  "high": $HIGH,
  "moderate": $MODERATE,
  "low": $LOW,
  "details": $VULN_DETAILS
}
EOF
    )
    SUMMARY=$(echo "$SUMMARY" | node -e "
const summary = $PKG_SUMMARY;
const full = JSON.parse(require('fs').readFileSync(0, 'utf8'));
full.packages.push(summary);
full.total_vulnerabilities += summary.vulnerabilities;
full.critical += summary.critical;
full.high += summary.high;
full.moderate += summary.moderate;
full.low += summary.low;
console.log(JSON.stringify(full, null, 2));
" 2>/dev/null)

done

# Write summary JSON
if [ "$DRY_RUN" = false ]; then
    echo "$SUMMARY" | python3 -m json.tool > "$SUMMARY_FILE" 2>/dev/null || echo "$SUMMARY" > "$SUMMARY_FILE"
    echo -e "${GREEN}✓ Summary written to: $SUMMARY_FILE${NC}"
fi

# Generate markdown report
if [ "$DRY_RUN" = false ]; then
    echo "# Security Audit Report" > "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "**Generated:** $(date -Iseconds)" >> "$REPORT_FILE"
    echo "**Audit Level:** $AUDIT_LEVEL" >> "$REPORT_FILE"
    echo "**Packages Audited:** ${#PACKAGE_JSONS[@]}" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "## Summary" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "- Total Vulnerabilities: **$(echo "$SUMMARY" | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).total_vulnerabilities)" 2>/dev/null || echo "0")**" >> "$REPORT_FILE"
    echo "  - Critical: $(echo "$SUMMARY" | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).critical)" 2>/dev/null || echo "0")" >> "$REPORT_FILE"
    echo "  - High: $(echo "$SUMMARY" | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).high)" 2>/dev/null || echo "0")" >> "$REPORT_FILE"
    echo "  - Moderate: $(echo "$SUMMARY" | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).moderate)" 2>/dev/null || echo "0")" >> "$REPORT_FILE"
    echo "  - Low: $(echo "$SUMMARY" | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).low)" 2>/dev/null || echo "0")" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "## Package Details" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"

    # Add package details
    echo "$SUMMARY" | node -e "
const summary = JSON.parse(require('fs').readFileSync(0, 'utf8'));
summary.packages.forEach(pkg => {
    console.log('### ' + pkg.name);
    console.log('');
    console.log('- **Vulnerabilities:** ' + pkg.vulnerabilities);
    if (pkg.vulnerabilities > 0) {
        console.log('- **Severity:**');
        if (pkg.critical > 0) console.log('  - Critical: ' + pkg.critical);
        if (pkg.high > 0) console.log('  - High: ' + pkg.high);
        if (pkg.moderate > 0) console.log('  - Moderate: ' + pkg.moderate);
        if (pkg.low > 0) console.log('  - Low: ' + pkg.low);
        console.log('');
        console.log('#### Details');
        console.log('');
        pkg.details.forEach(v => {
            console.log('**' + v.name + '** (' + v.severity + ')');
            v.via.forEach(dep => {
                console.log('- ' + dep.name + '@' + dep.version + ' (source: ' + dep.source + ')');
                if (dep.fixed) console.log('  - **Fixed in:** ' + dep.fixed);
            });
            console.log('');
        });
    } else {
        console.log('- Status: ✅ No vulnerabilities');
    }
    console.log('');
});
" 2>/dev/null >> "$REPORT_FILE"

    echo "## Recommendations" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "### Immediate Actions" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "1. **Critical/High vulnerabilities:** Address immediately" >> "$REPORT_FILE"
    echo "2. **Moderate vulnerabilities:** Plan fixes within 1 week" >> "$REPORT_FILE"
    echo "3. **Low vulnerabilities:** Address in next regular update" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "### Ongoing Monitoring" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "- Run this audit weekly" >> "$REPORT_FILE"
    echo "- Enable Dependabot on all repositories" >> "$REPORT_FILE"
    echo "- Subscribe to security advisories" >> "$REPORT_FILE"
    echo "- Review and update dependencies regularly" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "### Prevention" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo '- Use `--audit-level=high` in CI/CD pipelines' >> "$REPORT_FILE"
    echo "- Fail builds on critical/high vulnerabilities" >> "$REPORT_FILE"
    echo "- Regularly update dependencies" >> "$REPORT_FILE"
    echo '- Use `pnpm audit --fix` to automatically resolve some issues' >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"

    echo -e "${GREEN}✓ Report written to: $REPORT_FILE${NC}"
fi

# Final summary
echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}=== Audit Summary ===${NC}"
TOTAL_VULNS=$(echo "$SUMMARY" | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).total_vulnerabilities)" 2>/dev/null || echo "0")
CRITICAL=$(echo "$SUMMARY" | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).critical)" 2>/dev/null || echo "0")
HIGH=$(echo "$SUMMARY" | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).high)" 2>/dev/null || echo "0")
MODERATE=$(echo "$SUMMARY" | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).moderate)" 2>/dev/null || echo "0")
LOW=$(echo "$SUMMARY" | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).low)" 2>/dev/null || echo "0")

echo -e "  Total Vulnerabilities: ${YELLOW}$TOTAL_VULNS${NC}"
echo -e "    Critical: ${RED}$CRITICAL${NC}"
echo -e "    High: ${RED}$HIGH${NC}"
echo -e "    Moderate: ${YELLOW}$MODERATE${NC}"
echo -e "    Low: ${BLUE}$LOW${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}This was a dry run. No actual audits were performed.${NC}"
else
    if [ "$CRITICAL" -gt 0 ] || [ "$HIGH" -gt 0 ]; then
        echo -e "${RED}⚠ CRITICAL/HIGH vulnerabilities found!${NC}"
        echo "Review the report at: $REPORT_FILE"
        echo "Address these vulnerabilities immediately."
        exit 1
    elif [ "$MODERATE" -gt 0 ]; then
        echo -e "${YELLOW}⚠ Moderate vulnerabilities found.${NC}"
        echo "Review the report and plan fixes."
    elif [ "$TOTAL_VULNS" -gt 0 ]; then
        echo -e "${BLUE}ℹ Only low vulnerabilities found.${NC}"
        echo "Consider addressing in next update cycle."
    else
        echo -e "${GREEN}✓ No vulnerabilities found!${NC}"
    fi
fi

echo ""
