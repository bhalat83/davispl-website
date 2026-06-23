export const routes = {
  PL: {
    home: '/',
    collections: '/kolekcje',
    collection: (nazwa) => `/kolekcja/${nazwa}`,
    contact: '/kontakt',
    about: '/o-nas',
    trends: '/trendy',
    offer: '/uslugi',
    downloads: '/do-pobrania',
    grs: '/zrownowazony-rozwoj',
    architect: '/strefa-architekta',
  },
  ENG: {
    home: '/en/home',
    collections: '/en/collections',
    collection: (nazwa) => `/en/collection/${nazwa}-2`,
    contact: '/en/contact',
    about: '/en/about-us',
    trends: '/en/trends',
    offer: '/en/services',
    downloads: '/en/downloads',
    grs: '/en/grs',
    architect: '/en/architect-zone',
  },
};

export const getRoutes = (language) => routes[language] || routes.PL;

// Map any path to its EN equivalent
export const toEnPath = (pathname) => {
  if (pathname.startsWith('/kolekcja/')) {
    const slug = pathname.replace('/kolekcja/', '');
    return `/en/collection/${slug}-2`;
  }
  const map = {
    '/': '/en/home',
    '/kolekcje': '/en/collections',
    '/kontakt': '/en/contact',
    '/o-nas': '/en/about-us',
    '/trendy': '/en/trends',
    '/uslugi': '/en/services',
    '/do-pobrania': '/en/downloads',
    '/zrownowazony-rozwoj': '/en/grs',
    '/strefa-architekta': '/en/architect-zone',
  };
  return map[pathname] || '/en/home';
};

// Map any /en/ path to its PL equivalent
export const toPlPath = (pathname) => {
  if (pathname.startsWith('/en/collection/')) {
    const slug = pathname.replace('/en/collection/', '').replace(/-2$/, '');
    return `/kolekcja/${slug}`;
  }
  const map = {
    '/en/home': '/',
    '/en/collections': '/kolekcje',
    '/en/contact': '/kontakt',
    '/en/about-us': '/o-nas',
    '/en/trends': '/trendy',
    '/en/services': '/uslugi',
    '/en/downloads': '/do-pobrania',
    '/en/grs': '/zrownowazony-rozwoj',
    '/en/architect-zone': '/strefa-architekta',
  };
  return map[pathname] || '/';
};
