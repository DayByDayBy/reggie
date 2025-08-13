#!/bin/bash
# Kilo Regex Explainer Installation Script

set -e  # Exit on any error

echo "🚀 Installing Kilo Regex Explainer..."
echo ""

# Check Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Node.js is required but not installed."
    echo "Please install Node.js from https://nodejs.org/"
    echo "Minimum version: 14.x"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [[ $NODE_VERSION -lt 14 ]]; then
    echo "❌ Node.js version 14 or higher required. Found: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [[ $? -eq 0 ]]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Test installation
echo "🧪 Testing installation..."
if node explain.js "/test/"; then
    echo "✅ Installation test passed"
else
    echo "❌ Installation test failed"
    exit 1
fi

# Check Zsh
if [[ -n "$ZSH_VERSION" ]]; then
    echo "✅ Zsh detected"
else
    echo "⚠️  Zsh not detected - this plugin is designed for Zsh"
fi

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "To use the plugin:"
echo "1. Add this directory to your Zsh plugin manager, or"
echo "2. Source the plugin file directly:"
echo "   source $(pwd)/explain-regex.plugin.zsh"
echo ""
echo "Then use: explain_regex [pattern]"
echo "Example: explain_regex '/\\d+/'"