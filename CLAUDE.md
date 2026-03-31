# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static demo site for Tishonator WordPress themes, deployed to Cloudflare Workers via Wrangler. Each theme's demo is a self-contained directory of pre-rendered static HTML (exported from WordPress) with local JS replacing WooCommerce AJAX, search, and chatbot functionality.

## Architecture

- **wrangler.jsonc** — Cloudflare Workers config. The `assets.directory` is set to `alphana` (the primary/default theme). Other themes (`tblogging`, `tfengshui`, `tmagazine`, `tmedicine`) are separate top-level directories with identical structure.
- **Each theme directory** contains: static HTML pages (blog posts, product pages, shop, categories, projects, etc.), an `assets/` folder with vendored JS/CSS/fonts/images, and a `static-demo.js` that provides client-side interactivity.
- **`assets/static-demo.js`** (per theme) — Core interactivity layer: localStorage-based cart, local page-index search, form interception (contact, newsletter, comments, chatbot), and notification UI. This file is the main custom JS to edit when changing demo behavior.
- **`assets/demo1/tishonator-demo/`** — Vendored WordPress/WooCommerce assets (jQuery, WooCommerce JS/CSS/fonts). These are static copies, not generated.
- **`assets/external/`** — Vendored third-party assets (Google Fonts, Font Awesome, social sharing scripts).

## Commands

```bash
# Install wrangler (if not already installed)
npm install -g wrangler

# Local development server
npx wrangler dev

# Deploy to Cloudflare Workers
npx wrangler deploy
```

## Key Considerations

- Only the `alphana` directory is served by the current Wrangler config. To serve a different theme, change `assets.directory` in `wrangler.jsonc`.
- HTML files are pre-rendered static exports — they contain inline CSS and hardcoded content. Bulk changes across pages require scripting or find-and-replace.
- The `static-demo.js` page index array must be manually updated when adding/removing pages.
- Asset filenames include content hashes (e.g., `jquery.min_f43b551b.js`). When replacing vendored assets, update all HTML references.
