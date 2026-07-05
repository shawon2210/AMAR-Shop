export interface DeepLinkRoute {
  scheme: string;
  host: string;
  pathPattern: string;
  screen: string;
  params: string[];
}

export const deepLinkRoutes: DeepLinkRoute[] = [
  {
    scheme: 'amarshop',
    host: '',
    pathPattern: 'product/:id',
    screen: 'ProductDetail',
    params: ['id'],
  },
  {
    scheme: 'amarshop',
    host: '',
    pathPattern: 'order/:id',
    screen: 'OrderDetail',
    params: ['id'],
  },
  {
    scheme: 'amarshop',
    host: '',
    pathPattern: 'seller/:id',
    screen: 'SellerStore',
    params: ['id'],
  },
  {
    scheme: 'amarshop',
    host: '',
    pathPattern: 'category/:slug',
    screen: 'CategoryProducts',
    params: ['slug'],
  },
  {
    scheme: 'amarshop',
    host: '',
    pathPattern: 'promotion/:code',
    screen: 'Promotion',
    params: ['code'],
  },
  {
    scheme: 'amarshop',
    host: '',
    pathPattern: 'flash-sale/:id',
    screen: 'FlashSale',
    params: ['id'],
  },
  {
    scheme: 'https',
    host: 'amarshop.com',
    pathPattern: 'product/:id',
    screen: 'ProductDetail',
    params: ['id'],
  },
  {
    scheme: 'https',
    host: 'amarshop.com',
    pathPattern: 'order/:id',
    screen: 'OrderDetail',
    params: ['id'],
  },
  {
    scheme: 'https',
    host: 'amarshop.com',
    pathPattern: 'seller/:id',
    screen: 'SellerStore',
    params: ['id'],
  },
  {
    scheme: 'https',
    host: 'amarshop.com',
    pathPattern: 'category/:slug',
    screen: 'CategoryProducts',
    params: ['slug'],
  },
];

export function parseDeepLink(
  url: string,
): { screen: string; params: Record<string, string> } | null {
  try {
    const parsed = new URL(url);
    for (const route of deepLinkRoutes) {
      if (route.scheme !== parsed.protocol.replace(':', '')) continue;
      if (route.host && route.host !== parsed.hostname) continue;

      const pathParts = parsed.pathname.split('/').filter(Boolean);
      const patternParts = route.pathPattern.split('/');

      if (pathParts.length !== patternParts.length) continue;

      const params: Record<string, string> = {};
      let match = true;

      for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
          params[patternParts[i].slice(1)] = pathParts[i];
        } else if (patternParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        parsed.searchParams.forEach((value, key) => {
          params[key] = value;
        });
        return { screen: route.screen, params };
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function buildDeepLink(
  screen: string,
  params: Record<string, string>,
): string | null {
  const route = deepLinkRoutes.find(
    (r) => r.screen === screen && r.scheme === 'amarshop',
  );
  if (!route) return null;

  let path = route.pathPattern;
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, value);
  }

  return `amarshop://${path}`;
}

export function buildUniversalLink(
  screen: string,
  params: Record<string, string>,
): string | null {
  const route = deepLinkRoutes.find(
    (r) => r.screen === screen && r.scheme === 'https',
  );
  if (!route) return null;

  let path = route.pathPattern;
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, value);
  }

  return `https://amarshop.com/${path}`;
}

export const iosAssociatedDomains = [
  'applinks:amarshop.com',
  'activitycontinuation:amarshop.com',
];

export const androidDeepLinkIntentFilter = {
  scheme: 'amarshop',
  host: '*',
  pathPrefix: '/',
};
