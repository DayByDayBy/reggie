# Kilo Regex Explainer

A Zsh plugin that provides clear, concise explanations of regular expressions.

## Features

- 🎯 **Smart Detection**: Automatically detects regex patterns from arguments, clipboard, or command history
- 📝 **Clear Explanations**: Converts complex regex patterns into readable English
- 🔧 **Multiple Formats**: Supports both `/pattern/flags` and raw pattern formats
- 🌍 **Cross-Platform**: Works on macOS, Linux, and Windows/WSL

## Installation

### Quick Install
```bash
cd kilo
./install.sh
```

### Manual Install
1. Ensure Node.js 14+ is installed
2. Run `npm install` in the plugin directory
3. Source the plugin in your `.zshrc`:
   ```bash
   source /path/to/kilo/explain-regex.plugin.zsh
   ```

### Oh My Zsh
1. Clone to `$ZSH_CUSTOM/plugins/kilo-regex`
2. Add `kilo-regex` to your plugins list in `.zshrc`

## Usage

```bash
# Explain a regex pattern directly
explain_regex '/\d+/'

# Auto-detect from clipboard (if available)
explain_regex

# Examples
explain_regex 'hello'           # → "hello"
explain_regex '\d+'             # → a digit (0–9), one or more times
explain_regex '/[a-z]+/gi'      # → any of: a–z, one or more times
                               #   Flags: case-insensitive, global
```

## Requirements

- Node.js 14 or higher
- Zsh shell
- Optional: clipboard tools (pbpaste, xclip, xsel, or PowerShell)

## Troubleshooting

Run the compatibility test:
```bash
./test-compatibility.sh
```

Common issues:
- **"Node.js not found"**: Install Node.js from https://nodejs.org/
- **"Dependencies missing"**: Run `npm install` in plugin directory
- **"No regex found"**: Try passing the pattern as an argument

## Uninstall

```bash
./uninstall.sh