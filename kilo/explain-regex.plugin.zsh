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
    local regex=""

    # If user provided a regex as an argument
    if [[ -n "$1" ]]; then
        regex="$1"
    else
        # Try clipboard first
        if command -v pbpaste >/dev/null 2>&1; then
            clipboard_content=$(pbpaste)
            regex=$(detect_regex_pattern "$clipboard_content")
        elif command -v xclip >/dev/null 2>&1; then
            clipboard_content=$(xclip -o)
            regex=$(detect_regex_pattern "$clipboard_content")
        elif command -v xsel >/dev/null 2>&1; then
            clipboard_content=$(xsel --clipboard)
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

    # Use dynamic path resolution to find explain.js in the same directory as this plugin
    # Get the directory of the currently sourced file
    local plugin_dir="$(cd "$(dirname "${BASH_SOURCE[0]:-${(%):-%x}}")" && pwd)"
    node "$plugin_dir/explain.js" "$regex"
}