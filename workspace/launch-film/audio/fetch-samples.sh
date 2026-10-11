#!/bin/sh
# Downloads the recorded effects score.py uses into audio/samples (kept out of git).
# Kenney Interface Sounds: CC0. Mixkit sound effects: Mixkit Sound Effects Free License (use in videos, no redistribution as files).
set -e
cd "$(dirname "$0")"
mkdir -p samples
cd samples
if [ ! -d kenney ]; then
  curl -sL -o kenney.zip "https://kenney.nl/media/pages/assets/interface-sounds/fa43c1dd4d-1677589452/kenney_interface-sounds.zip"
  unzip -qo kenney.zip -d kenney && rm kenney.zip
fi
# 2531 laptop typing, 2542 hard key press, 1113 mouse click, 3005 explainer pop, 2569 negative interface tap
for id in 2531 2542 1113 3005 2569; do
  [ -f "mk-$id.mp3" ] || curl -sL -o "mk-$id.mp3" "https://assets.mixkit.co/active_storage/sfx/$id/$id-preview.mp3"
done
echo "samples ready"
