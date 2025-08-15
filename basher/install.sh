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
# Add sourcing of bash script to user's shell configuration
echo "🔧 Adding bash script to your shell configuration..."

# Determine which shell configuration file to use
if [[ -f "$HOME/.bashrc" ]]; then
    CONFIG_FILE="$HOME/.bashrc"
elif [[ -f "$HOME/.bash_profile" ]]; then
    CONFIG_FILE="$HOME/.bash_profile"
else
    CONFIG_FILE="$HOME/.bashrc"
    touch "$CONFIG_FILE"
    echo "Created $CONFIG_FILE"
fi

# Add source line to config file if not already present
SCRIPT_PATH="$(pwd)/explain-regex.bash"
SOURCE_LINE="source $SCRIPT_PATH"

if ! grep -qF "$SOURCE_LINE" "$CONFIG_FILE"; then
    echo "$SOURCE_LINE" >> "$CONFIG_FILE"
    echo "✅ Added bash script to $CONFIG_FILE"
else
    echo "⚠️  Bash script already in $CONFIG_FILE"
fi

echo ""
echo "To use the plugin:"
echo "1. For Zsh: Add this directory to your Zsh plugin manager, or source the plugin file directly:"
echo "   source $(pwd)/explain-regex.plugin.zsh"
echo "2. For Bash: The explain-regex.bash script has been added to your shell configuration."
echo "   Restart your terminal or run: source $SCRIPT_PATH"
echo ""
echo "Then use: explain_regex [pattern]"
echo "Example: explain_regex '/\\d+/'"