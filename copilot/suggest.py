def with_tone(suggestion: dict, tone: str = "friendly") -> str:
    base = suggestion["recommendation"]
    if tone == "concise":
        return base
    if tone == "formal":
        return f"{suggestion['title']}: {base}"
    if tone == "teaching":
        return f"{suggestion['title']}: {base} Rationale and examples are linked in the sources."
    # friendly default
    return f"{suggestion['title']} — {base} 👍"
