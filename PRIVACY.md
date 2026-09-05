# Privacy Policy — QodVryn

**Last updated:** September 2026

QodVryn is a browser extension that syncs your accepted LeetCode
submissions to a GitHub repository you control, with optional logging to
a Google Sheet you control. This document explains what data the
extension touches and where it goes.

## Summary

QodVryn does not run its own server, does not collect analytics, does
not use tracking or advertising of any kind, and does not sell or share
your data with anyone. Every request the extension makes goes directly
from your browser to LeetCode's, GitHub's, or Google's own APIs — never
through a server operated by the developer.

## What data the extension accesses, and why

| Data | Purpose | Where it goes |
|---|---|---|
| Your LeetCode session cookie | To read your accepted submissions and problem details as you, using LeetCode's own API. | Sent only to `leetcode.com`, directly from your browser. |
| Your submitted solution code and problem metadata (title, tags, language) | To create/update a file in your GitHub repository and update its README. | Sent only to `api.github.com` / `github.com`, directly from your browser. |
| A GitHub token (OAuth device flow token, or a Personal Access Token you paste in manually) | To authenticate the GitHub write requests above. | Stored locally in your browser (`chrome.storage.local`). Sent only to `api.github.com` as an authorization header. |
| A Google OAuth token (only if you enable Google Sheets sync) | To create/update a Google Sheet in **your own** Google Drive. | Stored locally in your browser (`chrome.storage.local`). Sent only to `sheets.googleapis.com` / Google's own OAuth endpoints. |

The extension requests the `drive.file` Google OAuth scope, which is the
narrowest Drive scope Google offers — it only ever sees the one
spreadsheet the extension itself creates for you, never any other file
in your Google Drive.

## What the extension does NOT do

- It does not operate a backend server. There is no server-side logging,
  storage, or processing of your data by the developer at any point.
- It does not use analytics, telemetry, or crash-reporting SDKs.
- It does not show ads or share data with advertisers.
- It does not sell, rent, or otherwise share your data with any third
  party.

## Where your data is stored

All tokens and settings (GitHub token, Google auth token, your chosen
repository, sync history) are stored locally on your own device using
Chrome's `chrome.storage.local` API. Nothing is stored on any server
controlled by the developer. Uninstalling the extension removes this
local data.

## Open source

QodVryn's full source code is public and can be reviewed by anyone at:
https://github.com/HammadBabar05/QodVryn-Extension

## Contact

Questions about this policy or the extension can be sent to:
**hammad.feroze05@gmail.com**
