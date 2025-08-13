# Enhanced regex detection function
detect_regex_pattern() {
    local input="$1"
    local detected=""
    
    # Method 1: Check if input is already a delimited regex (/pattern/flags)
    if [[ "$input" =~ ^/.*/.* ]]; then
        detected="$input"
    # Method 2: Check if input contains regex metacharacters (likely a raw pattern)
    elif [[ "$input" =~ [\.\*\+\?\[\]\(\)\{\}\^\$\|\\] ]]; then
        detected="$input"
    # Method 3: Try to extract delimited regex from text
    else
        detected=$(echo "$input" | grep -oE '/[^/]+/[gimsuxy]*' | head -n 1)
    fi
    
    echo "$detected"
}

# explain_regex function
explain_regex() {
    # Check if Node.js is available
    if ! command -v node >/dev/null 2>&1; then
        echo "Error: Node.js is not installed or not in PATH"
        echo "Please install Node.js from https://nodejs.org/"
        echo "Or ensure it's available in your PATH"
        return 1
    fi
# Detect environment for better error messages
    local os_type=""
    if [[ "$OSTYPE" == "darwin"* ]]; then
        os_type="macOS"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        os_type="Linux"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        os_type="Windows"
    else
        os_type="Unknown"
    fi

    local regex=""

    # If user provided a regex as an argument
    if [[ -n "$1" ]]; then
        regex="$1"
    else
        # Try clipboard first
        # Try clipboard with better error handling
        local clipboard_content=""
        if command -v pbpaste >/dev/null 2>&1; then
            # macOS
            clipboard_content=$(pbpaste 2>/dev/null || echo "")
        elif command -v xclip >/dev/null 2>&1; then
            # Linux with xclip
            clipboard_content=$(xclip -selection clipboard -o 2>/dev/null || echo "")
        elif command -v xsel >/dev/null 2>&1; then
            # Linux with xsel
            clipboard_content=$(xsel --clipboard --output 2>/dev/null || echo "")
        elif command -v powershell.exe >/dev/null 2>&1; then
            # Windows/WSL
            clipboard_content=$(powershell.exe -command "Get-Clipboard" 2>/dev/null | tr -d '\r' || echo "")
        fi

        if [[ -n "$clipboard_content" ]]; then
            regex=$(detect_regex_pattern "$clipboard_content")
        fi

        # Fallback to regex in last command
        if [[ -z "$regex" ]]; then
            last_command=$(fc -nl -1)
            regex=$(detect_regex_pattern "$last_command")
        fi
        
        # Validate auto-detected patterns (but not user-provided arguments)
        if [[ -n "$regex" ]]; then
            # Basic validation - check for minimum regex indicators
            if [[ ! "$regex" =~ [\.\*\+\?\[\]\(\)\{\}\^\$\|\\] ]] && [[ ! "$regex" =~ ^/.*/.*$ ]]; then
                echo "Warning: '$regex' doesn't appear to be a regex pattern"
                echo "Supported formats: /pattern/flags or raw pattern with metacharacters"
                return 1
            fi
        fi
    fi

    if [[ -z "$regex" ]]; then
        echo "No regex found in input, clipboard, or last command."
        return 1
    fi

   # Get the directory of the currently sourced file with better Zsh compatibility
   # Use Zsh-compatible path resolution
   local plugin_dir="$(cd "$(dirname "${(%):-%x}")" && pwd)"
   
   # Validate that explain.js exists
   if [[ ! -f "$plugin_dir/explain.js" ]]; then
       echo "Error: explain.js not found in plugin directory: $plugin_dir"
       echo "Please ensure the plugin is properly installed"
       return 1
   fi
   
   # Check if dependencies are installed
   if [[ ! -d "$plugin_dir/node_modules" ]]; then
       echo "Error: Node.js dependencies not installed"
       echo "Please run: cd '$plugin_dir' && npm install"
       return 1
   fi
   node "$plugin_dir/explain.js" "$regex"
}