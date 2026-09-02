// This runs INSIDE the LeetCode page, in the EXTENSION's isolated world.
// It listens for the message that injected.js sends when it detects an
// Accepted submission, and relays it to the background service worker.
// submissionId/titleSlug come directly from injected.js (extracted from the
// actual network request URL) — NOT parsed from window.location.href, since
// that can lag behind the real submission state.

window.addEventListener("message", (event) => {
  // Defense-in-depth: the content script only ever runs on leetcode.com
  // (see manifest.json "matches"), so this should always be true anyway —
  // but checking it explicitly means we never act on a message from an
  // unexpected origin even if that assumption is ever violated.
  if (event.origin !== "https://leetcode.com") return;
  if (event.source !== window) return;
  if (event.data?.source !== "leetcode-github-sync") return;

  if (event.data.type === "ACCEPTED") {
    console.log("QodVryn: Accepted submission detected!", event.data.payload);

    if (!event.data.submissionId || !event.data.titleSlug) {
      console.log("QodVryn: missing submissionId/titleSlug, skipping.");
      return;
    }

    chrome.runtime.sendMessage({
      type: "SUBMISSION_ACCEPTED",
      payload: event.data.payload,
      submissionId: event.data.submissionId,
      titleSlug: event.data.titleSlug,
    });
  }
});

console.log("QodVryn: content script loaded, listening for Accepted submissions.");