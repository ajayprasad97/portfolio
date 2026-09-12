# Ajay Prasad — Portfolio (Jekyll)

Jekyll portfolio with a project notebook, a photo journal, light/dark themes, and progressive scroll reveals. Published from `main` through GitHub Pages.

## Quick Start (GitHub Pages)
1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Select branch `main` and root `/`.
4. GitHub Pages will build and host the site.

## Local Preview (optional)
If you want to preview locally:
1. Install Ruby + Jekyll (RubyInstaller on Windows).
2. Run:
   ```bash
   bundle install
   bundle exec jekyll serve
   ```
3. Open `http://localhost:4000`.

## Content Updates

### Edit homepage
- `index.md`

### Add or edit projects
Projects are Jekyll posts in `_posts/`.

Example filename:
```
YYYY-MM-DD-project-name.md
```

Example front matter:
```yaml
---
title: "Project Title"
preview: "Short preview shown in lists"
cover: /assets/img/cover-placeholder.svg
links:
  - label: "Case Study"
    url: "https://example.com"
---
```

Body content below the front matter is the project description.

### Replace your photo
- `assets/img/ajay.jpg`

### Add a photo journal entry
- Add photos and an optional activity screenshot under `assets/img/`.
- Add an entry to `_data/places.yml` with `journal: true`, a unique `slug`, `name`, `location`, `date`, `lat`, `lng`, `eyebrow`, and `description`.
- Each `photos` item has `src`, `alt`, and `caption`. Each `stats` item has `label` and `value`. `activity` links to the recorded activity screenshot.
- Beyond Work renders journal entries in data-file order. Skyline Loop supplies the hero image.
- Sample map pins retain their placeholder images and are explicitly labeled in popups.

### Design and motion
- `assets/css/polish.css` contains the shared design, homepage layout, and motion styles.
- `assets/css/beyond-work.css` contains the photo journal layout.
- `assets/js/ui.js` handles theme, navigation, and one-time scroll reveals. Reduced-motion preferences are respected; content remains visible without JavaScript.

## Structure
- `_config.yml` — site config
- `_layouts/default.html` — base layout
- `_layouts/post.html` — project detail layout with sidebar
- `_posts/` — project entries
- `assets/css/custom.css` — site styling

## Custom Domain
Keep `CNAME` in the repo root. GitHub Pages will use it automatically.

## Styling Notes
Color tokens live at the top of `assets/css/custom.css`:
```css
:root {
  --bg: #f7f7f5;
  --surface: #ffffff;
  --text: #141414;
  --muted: #5c5c5c;
  --border: #e6e6e6;
  --accent: #1f5f5b;
  --accent-strong: #174645;
}
```
