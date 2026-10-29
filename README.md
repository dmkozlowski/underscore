# Underscore site

Static site. No build step.

## Preview locally

```
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` directly works too, but the header logo links to `/`, which only resolves on a server.)

## Deploy to Cloudflare Pages

**Option A, drag and drop:** Cloudflare dashboard → Workers & Pages → Create → Pages → Upload assets → drop the `site` folder.

**Option B, from Git:** push this repo to GitHub, then Create → Pages → Connect to Git.
Framework preset: None · Build command: *(blank)* · Build output directory: `site`.

**Option C, CLI:** `npx wrangler pages deploy site --project-name underscore`

You'll get a `*.pages.dev` address. Add a custom domain later under the project's Custom domains tab.

See `CLAUDE.md` for brand rules, voice and open items.
