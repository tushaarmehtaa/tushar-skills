#!/usr/bin/env python3
"""Enforce the Slashskills newsroom's verified new-URL ceiling."""
from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
LEDGER = ROOT / "workspace" / "seo-newsroom" / "publishing-ledger.json"
CANONICAL_HOST = "www.slashskills.xyz"

def load_ledger(path: Path = LEDGER) -> dict:
    return json.loads(path.read_text())

def day_status(ledger: dict, now: datetime | None = None) -> tuple[str, int, int]:
    zone = ZoneInfo(ledger["timezone"])
    current = (now or datetime.now(zone)).astimezone(zone)
    day = current.date().isoformat()
    count = sum(datetime.fromisoformat(item["published_at"]).astimezone(zone).date().isoformat() == day for item in ledger["publications"])
    return day, count, int(ledger["max_new_indexable_urls_per_day"])

def validate_identity(ledger: dict, path: str, url: str, content_id: str) -> None:
    parsed = urlparse(url)
    if not path.startswith("/") or path != parsed.path or parsed.scheme != "https" or parsed.netloc != CANONICAL_HOST or parsed.query or parsed.fragment:
        raise ValueError("path and canonical HTTPS Slashskills URL must match exactly")
    for item in ledger["publications"]:
        if item["path"] == path or item["url"] == url or item["content_id"] == content_id:
            raise ValueError("duplicate path, URL, or content ID")

def write_ledger(ledger: dict, destination: Path) -> None:
    temporary = destination.with_suffix(".tmp")
    temporary.write_text(json.dumps(ledger, indent=2) + "\n")
    temporary.replace(destination)

def main(argv: list[str] | None = None, ledger_path: Path = LEDGER, now: datetime | None = None) -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("status"); sub.add_parser("can-publish")
    record = sub.add_parser("record")
    record.add_argument("path"); record.add_argument("url"); record.add_argument("content_id")
    args = parser.parse_args(argv)
    ledger = load_ledger(ledger_path)
    day, count, limit = day_status(ledger, now)
    if args.command in {"status", "can-publish"}:
        print(f"{day}: {count}/{limit} new indexable URLs published; {max(0, limit-count)} remaining")
        return 1 if args.command == "can-publish" and count >= limit else 0
    if count >= limit:
        print(f"Refusing publication: {day} already has {count}/{limit} new URLs")
        return 1
    try:
        validate_identity(ledger, args.path, args.url, args.content_id)
    except ValueError as error:
        print(f"Refusing publication: {error}")
        return 1
    zone = ZoneInfo(ledger["timezone"])
    published_at = (now or datetime.now(zone)).astimezone(zone).isoformat(timespec="seconds")
    ledger["publications"].append({"content_id":args.content_id,"path":args.path,"url":args.url,"published_at":published_at})
    write_ledger(ledger, ledger_path)
    print(f"Recorded {args.url}; {count+1}/{limit} used for {day}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
