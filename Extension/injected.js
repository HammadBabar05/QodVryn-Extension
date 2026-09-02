// This file runs INSIDE LeetCode's own page (not the isolated extension world).
// Its only job: watch network requests, and if one shows "Accepted", tell the
// content script via postMessage (the only way to cross from page -> extension).

(function () {
  const notifiedSubmissions = new Set();
  const CHECK_URL_PATTERN = /\/submissions\/detail\/(\d+)\/v2\/check/;

  // Shared by both the fetch() and XMLHttpRequest interceptors below, so an
  // "Accepted" result is reported the same way regardless of which API
  // LeetCode's frontend happens to use for this request.
  function handleCheckResponseData(url, data) {
    const match = url && url.match(CHECK_URL_PATTERN);
    if (!match) return;
    if (!data || data.status_code !== 10 || data.status_msg !== "Accepted") return;

    const submissionId = match[1];
    if (notifiedSubmissions.has(submissionId)) return; // avoid duplicate firing
    notifiedSubmissions.add(submissionId);

    const slugMatch = window.location.pathname.match(/\/problems\/([a-z0-9\-]+)/);
    const titleSlug = slugMatch ? slugMatch[1] : null;

    window.postMessage(
      {
        source: "leetcode-github-sync",
        type: "ACCEPTED",
        payload: data,
        submissionId,
        titleSlug,
      },
      "*"
    );
  }

  // --- fetch() interception (LeetCode's current mechanism) ---
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);

    try {
      const url = typeof args[0] === "string" ? args[0] : args[0]?.url;
      if (url && CHECK_URL_PATTERN.test(url)) {
        response
          .clone()
          .json()
          .then((data) => handleCheckResponseData(url, data))
          .catch(() => {
            // Not JSON, or unrelated response shape — ignore silently.
          });
      }
    } catch (e) {
      // Never let our interceptor break LeetCode's own functionality.
    }

    return response;
  };

  // --- XMLHttpRequest interception (fallback, in case LeetCode's frontend
  // ever polls this endpoint via XHR instead of fetch) ---
  const OriginalXHR = window.XMLHttpRequest;
  const originalOpen = OriginalXHR.prototype.open;
  const originalSend = OriginalXHR.prototype.send;

  OriginalXHR.prototype.open = function (method, url, ...rest) {
    try {
      this.__qodvryn_url = url;
    } catch (e) {
      // Never let our interceptor break LeetCode's own functionality.
    }
    return originalOpen.call(this, method, url, ...rest);
  };

  OriginalXHR.prototype.send = function (...sendArgs) {
    try {
      const url = this.__qodvryn_url;
      if (url && CHECK_URL_PATTERN.test(url)) {
        this.addEventListener("load", () => {
          try {
            const data = JSON.parse(this.responseText);
            handleCheckResponseData(url, data);
          } catch (e) {
            // Not JSON, or unrelated response shape — ignore silently.
          }
        });
      }
    } catch (e) {
      // Never let our interceptor break LeetCode's own functionality.
    }
    return originalSend.apply(this, sendArgs);
  };

  console.log("QodVryn: fetch + XHR interceptors installed.");
})();
