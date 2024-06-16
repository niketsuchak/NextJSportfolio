const siteMetadata = {
  title: 'Niket Suchak',
  author: 'Niket Suchak',
  headerTitle: 'Niket Suchak',
  description: 'Student at VIT',
  language: 'en-us',
  theme: 'dark', // system, dark or light
  siteUrl: 'https://niketsuchak.com',
  siteRepo: 'https://github.com/niketsuchak',
  siteLogo: '/static/images/logo.png',
  image: '/static/images/avatar.webp',
  socialBanner: '/static/images/twitter-card.png',
  email: 'dlarroder@gmail.com',
  github: 'https://github.com/niketsuchak',
  twitter: 'https://twitter.com/dalelarroder',
  facebook: 'https://facebook.com/dlarroder',
  linkedin: 'https://www.linkedin.com/in/niket-suchak',
  spotify: 'https://open.spotify.com/user/12162121994?si=e685b3546f414967',
  steam: 'https://steamcommunity.com/id/dlarroder/',
  locale: 'en-US',
  comment: {
    provider: 'giscus',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO || '',
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID || '',
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || '',
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '',
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
    },
  },
};

module.exports = siteMetadata;
