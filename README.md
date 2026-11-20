# Gold / Silver Ratio Signal

A one-page tool that shows the current gold/silver ratio (from goldprice.org) and which metal looks attractive.

| Ratio | Signal |
|---|---|
| ≥ 75 | Silver Attractive |
| 65 – 75 | Leaning Silver |
| 60 – 65 | Neutral |
| 55 – 60 | Leaning Gold |
| < 55 | Gold Attractive |

## How the data is loaded
The browser tries these sources in order, using the first one that works:
1. goldprice.org's live price feed, fetched directly
2. the same feed through a public CORS proxy (corsproxy.io, allorigins)
3. gold-api.com, as a backup price source
4. `data.json`, which a GitHub Action refreshes every hour
5. if all of these fail, you can type the ratio in by hand

## Deploy to GitHub Pages
1. Create a new public repo, e.g. `gold-silver-ratio`, and upload all files (keep the `.github` folder).
2. **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)` → Save.
3. **Settings → Actions → General → Workflow permissions** → *Read and write permissions* → Save.
4. **Actions** tab → *Update gold/silver ratio* → **Run workflow** once, to fill `data.json`.
5. Open `https://<your-username>.github.io/gold-silver-ratio/`.

This is a rule of thumb, not financial advice.
