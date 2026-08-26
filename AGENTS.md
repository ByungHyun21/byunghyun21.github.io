# Repository Guidelines

## Project Overview

Personal GitHub Pages site for **ByungHyun21** (developer focused on local LLM inference and hardware). Pure static HTML/CSS/JS — **no build system, no bundler, no dependencies, no package.json**. What is committed is what is served.

## Architecture & Data Flow

Flat directory; five pages share one stylesheet and one behavior script.

```
index.html ──┬─ activity-loader.js ──> activity.json          (3 newest rows in "Recent Activity")
activity.html┴─ activity-loader.js ──> activity.json          (full table)
repos.html ─── repo-loader.js ──────> GitHub API  ─┐
                              repo-descriptions.json ┴─ merge → repo cards
hardware.html / contact.html ── static only
main.js (all pages): typing animation + IntersectionObserver `.reveal`
```

- Render pattern: each loader exposes a **global function** (`renderActivity(container, max)`, `renderRepos(container)`); the page calls it from an inline `<script>` at end of body.
- `repo-loader.js` fetches `https://api.github.com/users/ByungHyun21/repos?sort=pushed&per_page=20`, filters forks and `byunghyun21.github.io`, re-sorts by `pushed_at` desc, and overlays hand-written descriptions from `repo-descriptions.json` (keyed by repo name, fields `short`/`desc`).
- `activity.json` is rendered as-is in array order — **keep it newest-first**; `max` only slices from the top.

## Key Directories

None — all 12 files live in the repo root. No `src/`, no tests, no CI (`.github/` does not exist), no README/LICENSE/.gitignore.

## Development Commands

No build/lint/test commands exist. Local preview **must** go through an HTTP server (loaders `fetch()` local JSON, which fails on `file://`):

```bash
python3 -m http.server 8000   # or: npx serve   /   bunx serve
# open http://localhost:8000
```

Deploy = `git push` to `origin main` (GitHub Pages user site, repo name `byunghyun21.github.io`). No CNAME, no Actions — publishing is the push itself.

Commit convention (33 commits, consistent): `area: lowercase message` — areas seen: `about`, `repos`, `activity`, `hardware`, `style`, `fix`, `theme`, `publication`, `experience`, `rename`, `favicon`.

## Code Conventions & Common Patterns

- **Files**: kebab-case (`repo-loader.js`, `activity.json`); pages are lowercase HTML matching their nav label.
- **JS**: no modules, no async/await — Promise chains; globals only. Defensive `.catch()` renders a fallback message into the container; feature guards like `if (typedEl)` keep scripts safe on pages lacking the element.
- **Rendering**: template literals injected via `innerHTML` (**unsanitized** — fine here because inputs are own JSON and GitHub API, but never point loaders at untrusted data).
- **Page skeleton**: every page duplicates the same `<header>`/`<nav>`/`<footer>` block; current page sets `class="active"` on its nav link manually. Scripts load at end of body: loader first, inline init `<script>`, then `main.js`. When adding a page, copy the skeleton and update the active link.
- **CSS**: single `style.css`; all colors/fonts via `:root` custom properties (`--accent`, `--text-dim`, `--bg`, `--mono`, ...). Component classes: `.sec-label` (auto-prefixed `// ` via `::before`), `.card` + `.card-title/-desc/-tags`, `.activity-table`, `.hw-table`, `.spec`, `.reveal`, `.contact-list`. Backgrounds are two fixed layers `.paper-bg`/`.grid-bg` — include both divs at top of `<body>`. Single breakpoint: `@media (max-width: 640px)`.
- **Content edits**: new activity → append object (`date`, `type`, `title`, `url`?, `desc`) to top of `activity.json`; new machine → copy a `.card` + `.hw-table` block in `hardware.html`; repo blurbs → `repo-descriptions.json`.

## Important Files

- `index.html` — landing page; all sections live here (about, activity preview, highlights, experience, publication).
- `style.css` — entire design system; change visuals here, not with inline styles (existing inline styles are legacy, don't extend them).
- `main.js` — typing phrases (edit the `phrases` array) and scroll reveal; loaded by every page.
- `repo-loader.js` / `activity-loader.js` — the only JS with data fetching.
- `activity.json` / `repo-descriptions.json` — the only data files; must stay valid JSON (no trailing commas).

## Runtime/Tooling Preferences

- Zero-runtime site: any browser, any static file host. Node/Bun/Python are only needed to run a local dev server.
- No package manager in the repo; nothing to install. Keep it that way — adding a build step requires justification.

## Testing & QA

No tests, no CI, no linters. Verify changes manually:

1. Serve over HTTP (see commands above) and load every changed page.
2. `repos.html` depends on the **unauthenticated GitHub API (60 req/hr/IP)** — "Failed to load repos." usually means rate limit, not a bug.
3. Check the browser console; loader failures degrade to inline messages rather than crashing.
4. Known wart: `activity.html` is missing `</body>` before `</html>` (browsers tolerate it); fix opportunistically if editing that file.

## Footer Notes for Agents

- Scale of change should match the project: hand-edited HTML/JSON, no scaffolding.
- `git status` clean on `main` tracking `origin/main` is the normal state; push only when asked.
