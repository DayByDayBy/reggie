#!/usr/bin/env python3
import argparse, json
from .config import DEFAULT
from .kb_store import KB
from .web_fetch import fetch_rss, fetch_html
from .repo_scan import scan_repo
from .rule_match import suggest
from .suggest import with_tone

# copilot/ci_cli.py
def refresh_kb(kb: KB, cfg=DEFAULT):
    for s in cfg.sources:
        try:
            if s.parser == "rss":
                entries, resp = fetch_rss(s.url)
                kb.upsert_source(s.name, s.url, {"etag": resp.headers.get("ETag"), "last_modified": resp.headers.get("Last-Modified")}, resp.text)
                if entries:
                    kb.add_items(s.url, entries)
            elif s.parser == "html":
                html, resp = fetch_html(s.url)
                kb.upsert_source(s.name, s.url, {"etag": resp.headers.get("ETag"), "last_modified": resp.headers.get("Last-Modified")}, html)
            # elif s.parser == "json": ...
        except Exception as e:
            print(f"[warn] failed to fetch {s.name} → {s.url} :: {e}")

def main():
    ap = argparse.ArgumentParser(description="Practice Copilot — repo scan + best-practice suggestions")
    ap.add_argument("--refresh", action="store_true", help="Refresh knowledge base from configured sources")
    ap.add_argument("--repo", default=".", help="Path to repository")
    ap.add_argument("--tone", default="friendly", choices=["concise","friendly","formal","teaching"])
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    kb = KB()
    if args.refresh:
        refresh_kb(kb)

    facts = scan_repo(args.repo)
    suggestions = suggest(DEFAULT.rules, facts)

    if args.json:
        print(json.dumps({"facts": facts, "suggestions": suggestions, "kb_latest": kb.latest_items(15)}, indent=2))
    else:
        print("=== Repo facts ===")
        print(f"Languages: {', '.join(facts['language']) or '(none)'}")
        print(f"Ruff: {facts['has_ruff']}  ESLint: {facts['has_eslint']}")
        print("\n=== Suggestions ===")
        if not suggestions:
            print("No suggestions 🎉")
        for s in suggestions:
            print(f"- [{s['severity']}] {with_tone(s, args.tone)}")
            for src in s["sources"]:
                print(f"    • {src}")
        print("\n=== Latest intel (KB) ===")
        for title, url, _ts in kb.latest_items(10):
            print(f"• {title} — {url}")

if __name__ == "__main__":
    main()
