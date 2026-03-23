export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Container',
    description: 'Create Container',
    previewImage: 'svg',
  },
  fields: {
    add: {
      background: {
        type: 'select',
        label: 'Background',
        def: 'white',
        choices: [
          {
            label: 'White',
            value: 'white',
          },
          {
            label: 'Gray',
            value: 'gray',
          },
          {
            label: 'Dark',
            value: 'dark',
          },
          {
            label: 'Transparent',
            value: 'transparent',
          },
        ],
      },
      paddingY: {
        type: 'integer',
        label: 'Vertical padding',
        def: 64,
        min: 0,
        max: 200,
      },
      paddingX: {
        type: 'integer',
        label: 'Horizontal padding',
        def: 24,
        min: 0,
        max: 120,
      },
      maxWidth: {
        type: 'integer',
        label: 'Max width',
        def: 1200,
        min: 320,
        max: 2000,
      },
    },
  },
};
