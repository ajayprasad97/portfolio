# Ajay Prasad — Portfolio (Jekyll)

Minimal Jekyll portfolio with a left‑sidebar project layout, optimized for GitHub Pages.

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
