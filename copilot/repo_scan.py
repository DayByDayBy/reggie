import os, json, re
from pathlib import Path

def scan_repo(root:str=".") -> dict:
    facts = {
        "language": set(),      # {"python","javascript",...}
        "has_ruff": False,
        "has_eslint": False,
        "py_version_hint": None,
        "found_files": []
    }
    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in {".git","node_modules","venv",".venv","dist","build",".tox","__pycache__"}]
        for f in files:
            p = Path(dirpath)/f
            if f.endswith(".py"):
                facts["language"].add("python")
            if f.endswith((".js",".ts",".mjs",".cjs")):
                facts["language"].add("javascript")
            if f == "pyproject.toml":
                txt = (Path(dirpath)/f).read_text(encoding="utf-8", errors="ignore")
                if "tool.ruff" in txt: facts["has_ruff"] = True
            if f in (".eslintrc",".eslintrc.js",".eslintrc.cjs",".eslintrc.json","eslint.config.js"):
                facts["has_eslint"] = True
            facts["found_files"].append(str(p))
    facts["language"] = sorted(facts["language"])
    return facts
