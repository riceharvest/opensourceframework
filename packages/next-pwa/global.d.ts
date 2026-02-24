declare var __PWA_START_URL__: string;
declare var __PWA_SW__: string;
declare var __PWA_SCOPE__: string;
declare var __PWA_ENABLE_REGISTER__: boolean;
declare var __PWA_CACHE_ON_FRONT_END_NAV__: boolean;
declare var __PWA_RELOAD_ON_ONLINE__: boolean;

interface Window {
  workbox: any;
}

interface ServiceWorkerGlobalScope {
  fallback: (request: Request) => Promise<Response>;
}
