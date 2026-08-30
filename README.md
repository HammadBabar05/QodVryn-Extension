# QodVryn — LeetCode → GitHub Auto Sync

A Chrome extension that automatically syncs your accepted LeetCode
submissions to a GitHub repository — organized into topic-based folders,
consistently named, with a self-updating README and optional Google Sheets
tracking. Solve on LeetCode like normal; everything else happens in the
background.

## What it does

- **Detects accepted submissions in real time.** No polling, no terminal,
  no session cookies to copy-paste — everything runs as a background
  service worker the moment you get an "Accepted" verdict on LeetCode.
- **Pushes the solution to GitHub**, in a nested topic folder derived
  from the problem's own tags, with a consistent `ID_Title.ext` filename.
- **Keeps your README up to date** — a stats table and topic-progress
  checklist, wrapped in HTML marker comments so the rest of your README is
  never touched. Works even on a brand-new repo with no README at all.
- **Imports your full solving history**, not just new submissions, with
  resumable progress, a cancel option, and a "force full re-check" mode.
- **Optionally logs everything to a Google Sheet** — problem ID, title,
  difficulty, topics, language, and a link back to the solution on GitHub.

## How it works

Three scripts work together, each with a narrow job:

| Script | Runs in | Responsibility |
|---|---|---|
| `injected.js` | LeetCode's own page context (`MAIN` world) | Intercepts `fetch` to watch for LeetCode's submission-check endpoint; on an "Accepted" result, posts a message with the submission ID and problem slug. |
| `content.js` | Extension's isolated content-script world | Listens for that message and relays it to the background worker via `chrome.runtime.sendMessage`. |
| `background.js` | Background service worker | Does everything else: fetches the submission code and question metadata, determines the topic folder, pushes the file to GitHub, updates the README, and (if enabled) logs the row to Google Sheets. |

The popup (`popup.html` / `popup.js`) is the control surface for connecting
accounts, configuring the target repo, running a history import, and
viewing recent sync activity.

## Features

### GitHub sync
- Topic folders (e.g. `Array/1_Two_Sum.java`), based on
  each problem's actual LeetCode tags.
- Duplicate-safe: an existing solution file for a problem is found and
  updated in place rather than duplicated; if a problem's folder changes
  (tags updated on LeetCode), the old file is cleaned up.
- Automatic retry with backoff on GitHub API requests.

### Authentication
- **Connect with GitHub** via OAuth device flow — no token to generate or
  paste for the common case.
- **Advanced: Personal Access Token** fallback for users who prefer a
  manually-scoped PAT.
- **Load My Repos** — pick your target repository from a dropdown instead
  of typing `owner/repo` by hand.

### README automation
- Auto-generates a stats table and a topic checklist inside
  `<!-- AUTO-STATS:START/END -->` and `<!-- AUTO-TOPICS:START/END -->`
  markers.
- Creates a complete README from scratch on a repo that has none (or only
  GitHub's default placeholder).
- Skips the commit entirely if nothing actually changed.

### History import
- One-click import of your entire past LeetCode submission history into
  the same folder/naming/README pipeline used for live solves.
- Progress bar, resumable state, cancel button, and a "force full
  re-check" option for re-scanning everything.

### Google Sheets (optional)
- One click creates and connects a dedicated spreadsheet via Google OAuth
  (`chrome.identity`).
- Logs Problem ID, Title, Difficulty, Topics, Language, and a link to the
  GitHub solution for every solve.
- Offers to backfill the sheet from your existing GitHub repo if you
  already have solutions pushed before turning Sheets on.

### Popup dashboard
- Live GitHub/LeetCode connection status.
- Sync overview (last activity, live status).
- "Today's Problems" recent-activity list.
- Progress bars for both the GitHub history import and the Sheets
  backfill.

## Installation

Not yet published to the Chrome Web Store — install as an unpacked
extension:

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the extension folder.

## Setup

1. Click the extension icon to open the popup.
2. Under **GitHub Connection**, click **Connect with GitHub** and follow
   the device-code flow (or expand **Advanced** to paste a Personal
   Access Token instead).
3. Under **Repository Settings**, click **Load My Repos** and pick your
   target repo, or type `owner/repo` directly, then **Save Settings**.
4. Solve a problem on LeetCode — an accepted submission will sync
   automatically.
5. Optional: click **Import All Past Submissions** to backfill your
   existing solving history.
6. Optional: turn on **Google Sheets Sync** to also log every solve to a
   spreadsheet.

## Permissions

| Permission | Why it's needed |
|---|---|
| `storage` | Save your settings, tokens, and sync/import state locally. |
| `cookies` | Read your LeetCode session so API calls are authenticated as you. |
| `alarms` | Schedule periodic background checks. |
| `identity` | Google OAuth for the optional Sheets integration. |
| `host_permissions` (leetcode.com, api.github.com, github.com, sheets.googleapis.com) | Talk to LeetCode's API, push to GitHub, and write to Google Sheets. |

## Known limitations

- The LeetCode GraphQL API used here is unofficial and undocumented, so it
  can occasionally change or fail — requests retry automatically but this
  isn't bulletproof.
- README stats are derived from folder contents on GitHub, so a very large
  repo can make README updates slower.

## Roadmap

- [x] Auto-detect accepted submissions in real time
- [x] Auto-organize into topic folders
- [x] Auto-commit + push to GitHub
- [x] Auto-updating README with stats
- [x] Full history backfill
- [x] Browser extension (no terminal, GitHub OAuth device flow)
- [x] Optional Google Sheets tracking
- [ ] Publish to Chrome Web Store
