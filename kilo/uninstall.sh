#!/bin/bash
# Kilo Regex Explainer Uninstall Script

echo "🗑️  Uninstalling Kilo Regex Explainer..."

# Remove node_modules
if [[ -d "node_modules" ]]; then
    rm -rf node_modules
    echo "✅ Removed dependencies"
fi

# Remove package-lock.json
if [[ -f "package-lock.json" ]]; then
    rm package-lock.json
    echo "✅ Removed package lock file"
fi

echo ""
echo "✅ Uninstall completed"
echo "Note: Plugin files remain - remove manually if desired"