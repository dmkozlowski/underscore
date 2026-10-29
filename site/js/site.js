// Shared by every page. Kept in a file (not an inline <script>) so the
// Content-Security-Policy in _headers can block inline scripts.

// Footer year
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
