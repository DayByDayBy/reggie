# copilot/web_fetch.py (Py 3.8 safe)
import time
import requests
import xml.etree.ElementTree as ET
from typing import Dict, List, Any, Optional, Tuple

def fetch_rss(url: str, headers: Optional[Dict[str, str]] = None) -> Tuple[List[Dict[str, Any]], requests.Response]:
    r = requests.get(url, headers=headers or {}, timeout=20)
    r.raise_for_status()
    root = ET.fromstring(r.text)
    entries: List[Dict[str, Any]] = []

    # Atom first
    for e in root.findall(".//{http://www.w3.org/2005/Atom}entry"):
        title = (e.findtext("{http://www.w3.org/2005/Atom}title") or "").strip()
        link_el = e.find("{http://www.w3.org/2005/Atom}link")
        link = (link_el.get("href") if link_el is not None else "").strip()
        entries.append({"title": title, "url": link, "published_ts": int(time.time()), "content": ""})
    if entries:
        return entries, r

    # RSS fallback
    for e in root.findall(".//item"):
        title = (e.findtext("title") or "").strip()
        link = (e.findtext("link") or "").strip()
        entries.append({"title": title, "url": link, "published_ts": int(time.time()), "content": ""})
    return entries, r

def fetch_html(url: str) -> Tuple[str, requests.Response]:
    r = requests.get(url, timeout=20)
    r.raise_for_status()
    return r.text, r
