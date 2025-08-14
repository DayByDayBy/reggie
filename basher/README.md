# Kilo Regex Explainer

A regex explanation tool that works as both a Zsh plugin and a Bash script, providing clear, concise explanations of regular expressions.

## Features

- 🎯 **Smart Detection**: Automatically detects regex patterns from arguments, clipboard, or command history
- 📝 **Clear Explanations**: Converts complex regex patterns into readable English
- 🔧 **Multiple Formats**: Supports both `/pattern/flags` and raw pattern formats
- 🌍 **Cross-Platform**: Works on macOS, Linux, and Windows/WSL
- 🐚 **Dual Shell Support**: Works as both a Zsh plugin and a Bash script

## Installation

### Quick Install
```bash
cd basher
./install.sh
```

The installation script will automatically:
- Check for Node.js 14+ and install dependencies
- Test the installation
- Add the Bash script to your shell configuration (`.bashrc` or `.bash_profile`)

### Zsh Manual Install
1. Ensure Node.js 14+ is installed
2. Run `npm install` in the plugin directory
3. Source the plugin in your `.zshrc`:
   ```bash
   source /path/to/basher/explain-regex.plugin.zsh
   ```

### Bash Manual Install
1. Ensure Node.js 14+ is installed
2. Run `npm install` in the plugin directory
3. Source the script in your `.bashrc` or `.bash_profile`:
   ```bash
   source /path/to/basher/explain-regex.bash
   ```

### Oh My Zsh
1. Clone to `$ZSH_CUSTOM/plugins/kilo-regex`
2. Add `kilo-regex` to your plugins list in `.zshrc`

## Usage

### Zsh Plugin Usage
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

### Bash Script Usage
The Bash version works identically to the Zsh plugin:
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
- Either Zsh shell (for the plugin) or Bash shell (for the script)
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
- **"Command not found" (Bash)**: Ensure the script is properly sourced in your `.bashrc` or `.bash_profile`

## Uninstall
## Bash Version

This project now includes a Bash-compatible version of the regex explainer in addition to the original Zsh plugin. 
The Bash script (`explain-regex.bash`) provides the same functionality as the Zsh plugin but can be used in Bash environments.

```bash
./uninstall.sh