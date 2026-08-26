import json
import sys
import tempfile
import unittest
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

sys.path.insert(0, str(Path(__file__).resolve().parent))
import seo_newsroom_guard as guard

class GuardTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.ledger = Path(self.temp.name) / "ledger.json"
        self.now = datetime(2026, 8, 27, 9, 0, tzinfo=ZoneInfo("Asia/Kolkata"))
        self.ledger.write_text(json.dumps({"timezone":"Asia/Kolkata","max_new_indexable_urls_per_day":3,"publications":[]}))

    def tearDown(self): self.temp.cleanup()
    def run_guard(self, args): return guard.main(args, self.ledger, self.now)
    def test_records_verified_identity(self):
        self.assertEqual(0, self.run_guard(["record","/guide","https://www.slashskills.xyz/guide","guide"])); self.assertEqual(1, len(guard.load_ledger(self.ledger)["publications"]))
    def test_rejects_duplicate_path(self):
        self.run_guard(["record","/guide","https://www.slashskills.xyz/guide","one"]); self.assertEqual(1, self.run_guard(["record","/guide","https://www.slashskills.xyz/guide","two"]))
    def test_blocks_fourth_url(self):
        for n in range(3): self.assertEqual(0, self.run_guard(["record",f"/g{n}",f"https://www.slashskills.xyz/g{n}",f"g{n}"]))
        self.assertEqual(1, self.run_guard(["can-publish"])); self.assertEqual(1, self.run_guard(["record","/g3","https://www.slashskills.xyz/g3","g3"]))
    def test_rejects_wrong_host_or_mismatch(self):
        self.assertEqual(1, self.run_guard(["record","/guide","https://slashskills.xyz/guide","bad"])); self.assertEqual(1, self.run_guard(["record","/guide","https://www.slashskills.xyz/other","bad2"]))

if __name__ == "__main__": unittest.main()
