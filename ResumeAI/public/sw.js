// No-op service worker
// This file exists to prevent 404 errors from browser/extension requests for /sw.js
// If you later add PWA support, replace this with a proper service worker.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
