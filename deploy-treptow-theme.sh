#!/usr/bin/env bash
set -euo pipefail

# Deploy/re-apply the treptow custom theme into a SearXNG source install.
# Run this after SearXNG upgrades to restore the custom theme.

SEARX_SRC="${SEARX_SRC:-$HOME/opt/searx/searxng-src}"
CUSTOM_DIR="${CUSTOM_DIR:-$HOME/custom-theme/treptow}"
SETTINGS="${SETTINGS:-$HOME/etc/searx/settings.yml}"

cd "$SEARX_SRC"

# Copy theme into live tree
rsync -a --delete "$CUSTOM_DIR/templates/treptow/" "searx/templates/treptow/"
rsync -a --delete "$CUSTOM_DIR/static/themes/treptow/" "searx/static/themes/treptow/"

# Ensure settings use treptow theme (idempotent edit)
python3 - "$SETTINGS" <<'PY'
from pathlib import Path
import re
import sys

p = Path(sys.argv[1])
text = p.read_text()
text = re.sub(r"default_theme\s*:\s*\w+", "default_theme : treptow", text)
if "simple_style" not in text:
    text = text.replace("theme_args :", "theme_args :\n        simple_style : black")
else:
    text = re.sub(r"simple_style\s*:\s*[^\n]+", "simple_style : black", text)
p.write_text(text)
PY

echo "treptow theme deployed. Restart SearXNG to activate."
