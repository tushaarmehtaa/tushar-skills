#!/bin/zsh
set -eu
run_date="$(TZ=Asia/Kolkata date +%F)"
current="$(TZ=Asia/Kolkata date +%H%M)"
report="/Users/tushaarmehtaa/Dev/active/tushar-skills/workspace/seo-newsroom/runs/$run_date.md"
if (( 10#$current < 820 )) || [[ -s "$report" ]]; then exit 0; fi
exec /bin/zsh /Users/tushaarmehtaa/Dev/active/tushar-skills/scripts/run_seo_newsroom_scout.sh
