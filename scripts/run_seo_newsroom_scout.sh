#!/bin/zsh
set -eu

repo_dir="${SEO_NEWSROOM_REPO_DIR:-/Users/tushaarmehtaa/Dev/active/tushar-skills}"
codex_bin="${SEO_NEWSROOM_CODEX_BIN:-/Users/tushaarmehtaa/.local/bin/codex}"
prompt_file="${SEO_NEWSROOM_PROMPT_FILE:-$repo_dir/workspace/seo-newsroom/prompts/daily-scout.md}"
runs_dir="${SEO_NEWSROOM_RUNS_DIR:-$repo_dir/workspace/seo-newsroom/runs}"
lock_dir="${SEO_NEWSROOM_LOCK_DIR:-/private/tmp/slashskills-seo-newsroom-scout.lock}"
log_file="${SEO_NEWSROOM_LOG_FILE:-/private/tmp/slashskills-seo-newsroom-scout.log}"
run_date="$(TZ=Asia/Kolkata date +%F)"
report_file="$runs_dir/$run_date.md"
temporary_report="$runs_dir/.$run_date.$$.tmp"

mkdir -p "$runs_dir"
if [[ -s "$report_file" ]]; then
  print -r -- "$(date -Iseconds) scout skipped: completed report exists for $run_date" >> "$log_file"
  exit 0
fi
if ! mkdir "$lock_dir" 2>/dev/null; then
  print -r -- "$(date -Iseconds) scout skipped: another run holds the lock" >> "$log_file"
  exit 0
fi
cleanup() { rm -f "$temporary_report"; rmdir "$lock_dir" 2>/dev/null || true }
trap cleanup EXIT INT TERM
print -r -- "$(date -Iseconds) scout started for $run_date" >> "$log_file"

if "$codex_bin" --search --ask-for-approval never exec --ephemeral --sandbox read-only --cd "$repo_dir" --output-last-message "$temporary_report" - < "$prompt_file" >> "$log_file" 2>&1; then
  if [[ -s "$temporary_report" ]] && grep -q '^# Daily SEO scout — ' "$temporary_report"; then
    mv "$temporary_report" "$report_file"
    print -r -- "$(date -Iseconds) scout completed: $report_file" >> "$log_file"
  else
    print -r -- "$(date -Iseconds) scout failed: final report missing or malformed" >> "$log_file"
    exit 1
  fi
else
  exit_code=$?
  print -r -- "$(date -Iseconds) scout failed with status $exit_code" >> "$log_file"
  exit "$exit_code"
fi
