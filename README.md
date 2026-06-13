# searxng-treptow

Custom SearXNG theme and configuration for [treptow.uber.space](https://treptow.uber.space/).

## What this repo contains

| Directory / File | Purpose |
|---|---|
| `templates/treptow/` | Jinja2 templates (forked from upstream `simple`, references updated to `treptow/`) |
| `static/themes/treptow/` | Static assets: CSS, JS, fonts, images, leaflet |
| `static/themes/treptow/codeblocks-bg.css` | Animated codeblock background styling |
| `static/themes/treptow/codeblocks-bg.js` | Animated codeblock background behaviour |
| `deploy-treptow-theme.sh` | Deploy/re-apply theme into a SearXNG source install |
| `settings.yml.template` | Settings template (copy to `settings.yml`, fill in `secret_key`) |

## Animated codeblock background

Inspired by [TreptowerPark/aviationcenter-landing](https://github.com/TreptowerPark/aviationcenter-landing).

- Decorative only: `aria-hidden="true"`, `pointer-events: none`
- No network calls, no query access, no storage
- Respects `prefers-reduced-motion: reduce` (background hidden)
- CSS transform animation (no layout properties)

## Installation

### Fresh install

```bash
# Clone SearXNG source
git clone https://github.com/searxng/searxng.git ~/opt/searx/searxng-src
cd ~/opt/searx/searxng-src
python3 -m venv ~/opt/searx/searx-pyenv
source ~/opt/searx/searx-pyenv/bin/activate
pip install -e .

# Clone this repo
git clone https://github.com/TreptowerPark/searxng-treptow.git ~/custom-theme/treptow

# Deploy theme
~/custom-theme/treptow/deploy-treptow-theme.sh

# Create settings from template
cp ~/custom-theme/treptow/settings.yml.template ~/etc/searx/settings.yml
# Edit settings.yml: set secret_key, adjust host/port as needed

# Start (adjust for your setup)
SEARX_SETTINGS_PATH=~/etc/searx/settings.yml python3 searx/webapp.py
```

### Re-apply after SearXNG upgrade

```bash
cd ~/opt/searx/searxng-src
git pull
source ~/opt/searx/searx-pyenv/bin/activate
pip install -e .
pip install "Werkzeug<3"

# Re-deploy custom theme
~/custom-theme/treptow/deploy-treptow-theme.sh

# Restart service
supervisorctl restart searx
```

## Rollback

Remove the custom theme and revert to upstream `simple`:

```bash
sed -i 's/default_theme : treptow/default_theme : simple/' ~/etc/searx/settings.yml
rm -rf ~/opt/searx/searxng-src/searx/templates/treptow \
       ~/opt/searx/searxng-src/searx/static/themes/treptow
supervisorctl restart searx
```

## Architecture

```
searxng-treptow/
├── templates/treptow/          # Jinja2 templates
│   ├── base.html               # Main layout (includes codeblocks-bg hooks)
│   ├── index.html              # Homepage
│   ├── results.html            # Search results
│   ├── preferences.html        # User preferences
│   └── ...
├── static/themes/treptow/      # Static assets
│   ├── codeblocks-bg.css       # Background styling
│   ├── codeblocks-bg.js        # Background animation
│   ├── css/                    # Compiled CSS
│   ├── js/                     # Compiled JS
│   ├── less/                   # LESS source
│   ├── fonts/                  # Icon fonts
│   ├── img/                    # Images
│   └── leaflet/                # Map assets
├── deploy-treptow-theme.sh     # Deploy script
├── settings.yml.template       # Settings template
└── README.md
```

## Live instance

- URL: https://treptow.uber.space/
- Instance name: `treptow-search`
- Theme: `treptow` (based on `simple`, black style)
- Privacy: `X-Robots-Tag: noindex, nofollow`

## License

Theme templates are derived from [searxng/searxng](https://github.com/searxng/searxng) (AGPL-3.0).
Custom additions (codeblocks-bg, deploy script) are MIT.
