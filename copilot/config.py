from dataclasses import dataclass, field
from typing import List, Dict

@dataclass
class Source:
    name: str
    url: str
    parser: str = "rss"  # rss|html|json|auto

@dataclass
class Rule:
    id: str
    title: str
    applies_if: Dict[str, str]
    recommendation: str
    severity: str = "info"
    sources: List[str] = field(default_factory=list)

@dataclass
class Settings:
    sources: List[Source]
    rules: List[Rule]

DEFAULT = Settings(
   sources=[
    # Was: "https://www.python.org/downloads/rss.xml"  (404)
    Source(name="CPython Releases", url="https://github.com/python/cpython/releases.atom", parser="rss"),
    Source(name="Ruff Releases",    url="https://github.com/astral-sh/ruff/releases.atom", parser="rss"),
    Source(name="ESLint Releases",  url="https://github.com/eslint/eslint/releases.atom", parser="rss"),
    # Optional stable docs pages you care about:
    # Source(name="PEP8", url="https://peps.python.org/pep-0008/", parser="html"),
    ],
    rules=[
        Rule(
            id="py-docstrings",
            title="Add function docstrings (PEP 257)",
            applies_if={"language": "python"},
            recommendation="Enable docstring checks (e.g., Ruff pydocstyle) for public APIs.",
            severity="info",
            sources=["https://peps.python.org/pep-0257/", "https://docs.astral.sh/ruff/rules/"]
        ),
        Rule(
            id="python-ruff",
            title="Adopt Ruff",
            applies_if={"language": "python", "has_ruff": "false"},
            recommendation="Add Ruff to pyproject.toml and enforce in CI.",
            severity="warn",
            sources=["https://docs.astral.sh/ruff/"]
        ),
        Rule(
            id="js-eslint-prettier",
            title="Ensure ESLint + Prettier",
            applies_if={"language": "javascript", "has_eslint": "false"},
            recommendation="Configure ESLint (recommended) and Prettier; run in CI.",
            severity="warn",
            sources=["https://eslint.org/docs/latest/use/getting-started", "https://prettier.io/docs/en/"]
        ),
    ]
)
