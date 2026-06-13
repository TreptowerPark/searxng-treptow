#!/usr/bin/env fish
set -euo pipefail

# Deploy/re-apply the treptow custom theme into SearXNG.
# Supports both Docker and source installs.
# Run this after SearXNG upgrades to restore the custom theme.

set REPO_DIR (status dirname)
set CUSTOM_DIR "$REPO_DIR"

# Detect deployment mode
if docker ps --format '{{.Names}}' 2>/dev/null | grep -q searxng
    set -l CONTAINER (docker ps --format '{{.Names}}' | grep searxng | head -1)
    echo "Detected Docker container: $CONTAINER"

    # Copy templates
    docker cp "$CUSTOM_DIR/templates/treptow/." "$CONTAINER:/usr/local/searxng/searx/templates/treptow/"
    # Copy static assets
    docker cp "$CUSTOM_DIR/static/themes/treptow/." "$CONTAINER:/usr/local/searxng/searx/static/themes/treptow/"

    # Update settings.yml inside the container
    docker exec "$CONTAINER" python3 -c "
from pathlib import Path
import re
p = Path('/etc/searxng/settings.yml')
text = p.read_text()
text = re.sub(r'default_theme\s*:\s*\w+', 'default_theme: treptow', text)
if 'simple_style' not in text:
    text = text.replace('theme_args:', 'theme_args:\n        simple_style: black')
else:
    text = re.sub(r'simple_style\s*:\s*\w+', 'simple_style: black', text)
p.write_text(text)
print('Settings updated')
"

    # Restart the container
    docker restart "$CONTAINER"
    echo "treptow theme deployed to Docker container. SearXNG restarting."

else
    # Source install mode
    set -l SEARX_SRC "$HOME/opt/searx/searxng-src"
    set -l SETTINGS "$HOME/etc/searx/settings.yml"

    if not test -d "$SEARX_SRC"
        echo "Error: SearXNG source not found at $SEARX_SRC"
        echo "Set SEARX_SRC env var to override."
        exit 1
    end

    cd "$SEARX_SRC"

    # Copy theme into live tree
    rsync -a --delete "$CUSTOM_DIR/templates/treptow/" "searx/templates/treptow/"
    rsync -a --delete "$CUSTOM_DIR/static/themes/treptow/" "searx/static/themes/treptow/"

    # Ensure settings use treptow theme (idempotent edit)
    python3 - "$SETTINGS" -c "
from pathlib import Path
import re
import sys
p = Path(sys.argv[1])
text = p.read_text()
text = re.sub(r'default_theme\s*:\s*\w+', 'default_theme: treptow', text)
if 'simple_style' not in text:
    text = text.replace('theme_args:', 'theme_args:\n        simple_style: black')
else:
    text = re.sub(r'simple_style\s*:\s*\w+', 'simple_style: black', text)
p.write_text(text)
"

    echo "treptow theme deployed to source install. Restart SearXNG to activate."
end
