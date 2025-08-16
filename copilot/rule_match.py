from typing import List, Dict
from .config import Rule

def _applies(rule: Rule, facts: Dict) -> bool:
    for k, v in rule.applies_if.items():
        if k == "language":
            if v not in facts.get("language", []):
                return False
        else:
            fv = facts.get(k)
            if isinstance(fv, bool):
                fv = "true" if fv else "false"
            if str(fv).lower() != str(v).lower():
                return False
    return True

def suggest(rules: List[Rule], facts: Dict) -> List[Dict]:
    out = []
    for r in rules:
        if _applies(r, facts):
            out.append({
                "id": r.id,
                "title": r.title,
                "severity": r.severity,
                "recommendation": r.recommendation,
                "sources": r.sources
            })
    return out
