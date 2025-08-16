import sqlite3, json, time
from typing import Any, Dict, List, Tuple

SCHEMA = """
CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY,
  name TEXT, url TEXT, fetched_at INTEGER, etag TEXT, last_modified TEXT, content TEXT
);
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY,
  source_url TEXT, title TEXT, url TEXT, published INTEGER, content TEXT
);
CREATE INDEX IF NOT EXISTS idx_items_source ON items(source_url);
"""

class KB:
    def __init__(self, db_path="copilot.db"):
        self.db = sqlite3.connect(db_path)
        self.db.execute("PRAGMA journal_mode=WAL;")
        self.db.executescript(SCHEMA)

    def upsert_source(self, name:str, url:str, meta:Dict[str,Any], content:str):
        self.db.execute(
            "INSERT INTO sources(name,url,fetched_at,etag,last_modified,content) VALUES(?,?,?,?,?,?)",
            (name, url, int(time.time()), meta.get("etag"), meta.get("last_modified"), content)
        )
        self.db.commit()

    def add_items(self, url:str, entries:List[Dict[str,Any]]):
        for e in entries:
            self.db.execute(
                "INSERT INTO items(source_url,title,url,published,content) VALUES(?,?,?,?,?)",
                (url, e.get("title"), e.get("url"), e.get("published_ts") or 0, e.get("content") or "")
            )
        self.db.commit()

    def latest_items(self, limit=50) -> List[Tuple]:
        cur = self.db.execute("SELECT title,url,published FROM items ORDER BY published DESC LIMIT ?", (limit,))
        return cur.fetchall()
