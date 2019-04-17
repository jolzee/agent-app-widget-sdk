const POLLING_INTERVAL = 750;
let pollingTimer;

export function startURLMirroring(newURLCallback) {
  let currentUrl;
  pollingTimer = setInterval(() => {
    const url = window.location.pathname;
    if (url !== currentUrl) {
      currentUrl = url;
      newURLCallback(url);
    }
  }, POLLING_INTERVAL);
}

export function stopURLMirroring() {
  clearInterval(pollingTimer);
}

export function handleIncomingURL({url}) {
  window.history.pushState({}, '', url);
}
