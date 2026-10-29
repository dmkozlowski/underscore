// Booking page: Cal.com inline embed.

// Cal.com's standard loader. If Cal.com changes it, regenerate from:
// Cal.com → Event Types → Listening session → Embed → Inline.
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");

const NS = "listening-session";
const fallback = document.getElementById("cal-fallback");
const status = document.getElementById("cal-status");

Cal("init", NS, { origin: "https://cal.com" });

Cal.ns[NS]("inline", {
  elementOrSelector: "#cal-inline",
  calLink: "daniel-kozlowski-a26gig/listening-session",
  config: { layout: "month_view", theme: "light" }
});

// Match the brand: light theme (the site has no dark mode), ink as the accent.
Cal.ns[NS]("ui", {
  theme: "light",
  hideEventTypeDetails: false,
  layout: "month_view",
  cssVarsPerTheme: { light: { "cal-brand": "#2A1D16" } }
});

// The plain link stays visible until the calendar is actually ready.
// If it never loads (blocked, offline, Cal.com down), say so and keep the link.
status.textContent = "Loading the calendar…";
const giveUp = setTimeout(showFailure, 15000);

Cal.ns[NS]("on", {
  action: "linkReady",
  callback: () => { clearTimeout(giveUp); fallback.hidden = true; }
});
Cal.ns[NS]("on", { action: "linkFailed", callback: showFailure });

function showFailure() {
  status.textContent = "The calendar didn't load here. You can still book on Cal.com.";
}
