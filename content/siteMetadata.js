var siteMetadata = {
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
  email: 'niket.suchak2020@gmail.com',
  github: 'https://github.com/niketsuchak',
  twitter: 'https://twitter.com/niket_suchak',
  facebook: 'https://facebook.com',
  linkedin: 'https://www.linkedin.com/in/niket-suchak',
  spotify: 'https://open.spotify.com/user/3vwfkze8gmgwid1ttrercvhmi?si=9ecaebc783a345d7',
  steam: 'https://steamcommunity.com/id/',
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
