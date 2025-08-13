explain_regex() {
    local regex=""

    if [[ -n "$1" ]]; then
        regex="$1"
    else
        # Clipboard
        if command -v pbpaste >/dev/null 2>&1; then
            regex=$(pbpaste | grep -oE '/.*?/' | head -n 1)
        elif command -v xclip >/dev/null 2>&1; then
            regex=$(xclip -o | grep -oE '/.*?/' | head -n 1)
        elif command -v xsel >/dev/null 2>&1; then
            regex=$(xsel --clipboard | grep -oE '/.*?/' | head -n 1)
        fi
        # Last command if no clipboard match
        if [[ -z "$regex" ]]; then
            regex=$(fc -nl -1 | grep -oE '/.*?/' | head -n 1)
        fi
    fi

    if [[ -z "$regex" ]]; then
        echo "No regex found."
        return 1
    fi

    node ~/.zsh-plugins/explain-regex/explain.js "$regex"
}
