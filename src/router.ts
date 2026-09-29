/* Lightweight hash router. */

export type RouteHandler = (route: string, param?: string) => void;

const handlers: RouteHandler[] = [];

export function onRoute(fn: RouteHandler) {
  handlers.push(fn);
}

export function parseHash(): { view: string; param?: string } {
  const h = location.hash.replace(/^#\/?/, '');
  const [view, param] = h.split('/');
  return { view: view || 'dashboard', param };
}

export function navigate(route: string) {
  const target = route.startsWith('#') ? route : `#/${route}`;
  if (location.hash === target) {
    /* re-dispatch for same-route navigation (e.g. detail refresh) */
    handlers.forEach(fn => { const { view, param } = parseHash(); fn(view, param); });
  } else {
    location.hash = target;
  }
}

export function startRouter() {
  window.addEventListener('hashchange', () => {
    const { view, param } = parseHash();
    handlers.forEach(fn => fn(view, param));
  });
}

export function currentRoute(): { view: string; param?: string } {
  return parseHash();
}
