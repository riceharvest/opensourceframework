#!/bin/bash

# Repositories to update
repos=(
  "critters"
  "next-auth"
  "next-circuit-breaker"
  "next-compose-plugins"
  "next-cookies"
  "next-csrf"
  "next-images"
  "next-iron-session"
  "next-json-ld"
  "next-pwa"
  "next-seo"
  "next-session"
  "next-transpile-modules"
  "react-a11y-utils"
  "react-virtualized"
  "seeded-rng"
  "next-connect"
  "react-query-auth"
  "next-optimized-images"
)

footer="

---

Maintained by @opensourceframework in the [monorepo](https://github.com/riceharvest/opensourceframework)."

for repo_name in "${repos[@]}"; do
  full_repo="riceharvest/$repo_name"
  echo "Processing $full_repo..."
  
  resp=$(gh api repos/$full_repo/contents/README.md 2>/dev/null)
  
  if [ $? -eq 0 ]; then
    sha=$(echo "$resp" | jq -r '.sha')
    echo "$resp" | jq -r '.content' | base64 -d > current_readme.md
    
    if ! grep -q "Maintained by @opensourceframework in the \[monorepo\]" current_readme.md; then
      cat >> current_readme.md <<EOF
$footer
EOF
      base64 -w 0 current_readme.md > current_readme.b64
      
      echo "Updating $full_repo via file..."
      gh api --method PUT /repos/$full_repo/contents/README.md \
        -f message="docs: link to monorepo" \
        -F content=@current_readme.b64 \
        -f sha="$sha" > /dev/null
      echo "Updated README.md for $full_repo"
    else
      echo "README.md for $full_repo already contains clean link."
    fi
  else
    echo "# $repo_name

Modernized and maintained fork. Part of @opensourceframework.

Maintained in the [monorepo](https://github.com/riceharvest/opensourceframework)." > current_readme.md
    base64 -w 0 current_readme.md > current_readme.b64
    
    gh api --method PUT /repos/$full_repo/contents/README.md \
      -f message="docs: initial README" \
      -F content=@current_readme.b64 > /dev/null
    echo "Created README.md for $full_repo"
  fi
done

rm current_readme.md current_readme.b64
