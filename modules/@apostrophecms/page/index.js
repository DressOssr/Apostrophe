// This configures the @apostrophecms/pages module to add a "home" page type to the
// pages menu

export default {
  options: {
    types: [
      {
        name: 'default-page',
        label: 'project:defaultPage',
      },
      {
        name: 'product-page',
        label: 'project:productPage',
      },
      {
        name: 'faq-page',
        label: 'Faq Page',
      },
      {
        name: 'article-page',
        label: 'project:articleIndexPage',
      },
      {
        name: '@apostrophecms/home-page',
        label: 'project:home',
      },
    ],
  },
};
