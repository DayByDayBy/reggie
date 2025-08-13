#!/bin/bash
# Cross-platform compatibility test script

echo "Testing Kilo Regex Explainer compatibility..."
echo "OS: $OSTYPE"
echo "Shell: $SHELL"
echo ""

# Test Node.js availability
if command -v node >/dev/null 2>&1; then
    echo "✓ Node.js found: $(node --version)"
else
    echo "✗ Node.js not found"
    exit 1
fi

# Test npm dependencies
if [[ -d "node_modules" ]]; then
    echo "✓ Dependencies installed"
else
    echo "✗ Dependencies missing - run 'npm install'"
    exit 1
fi

# Test basic functionality
echo ""
echo "Testing basic regex explanation..."
if node explain.js "/test/"; then
    echo "✓ Basic functionality works"
else
    echo "✗ Basic functionality failed"
    exit 1
fi

# Test clipboard tools
echo ""
echo "Testing clipboard tools..."
if command -v pbpaste >/dev/null 2>&1; then
    echo "✓ pbpaste available (macOS)"
elif command -v xclip >/dev/null 2>&1; then
    echo "✓ xclip available (Linux)"
elif command -v xsel >/dev/null 2>&1; then
    echo "✓ xsel available (Linux)"
elif command -v powershell.exe >/dev/null 2>&1; then
    echo "✓ PowerShell available (Windows/WSL)"
else
    echo "⚠ No clipboard tools found - clipboard detection will not work"
fi

echo ""
echo "Compatibility test completed successfully!"