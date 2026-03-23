export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Overlay Card',
  },
  fields: {
    add: {
      image: {
        type: 'attachment',
        label: 'Background image',
        required: true,
      },
      title: {
        type: 'string',
        label: 'Title',
      },
      text: {
        type: 'string',
        textarea: true,
        label: 'Text',
      },
      cardWidth: {
        type: 'integer',
        label: 'Card width',
        def: 420,
        min: 180,
        max: 900,
      },
      offsetX: {
        type: 'integer',
        label: 'Horizontal offset (left/right)',
        def: 0,
        min: -400,
        max: 400,
      },
      offsetY: {
        type: 'integer',
        label: 'Vertical offset (up/down)',
        def: 0,
        min: -400,
        max: 400,
      },
      cardBackground: {
        type: 'color',
        label: 'Card background',
        def: '#f3f4f6',
      },
      borderRadius: {
        type: 'integer',
        label: 'Card border radius',
        def: 24,
        min: 0,
        max: 80,
      },
      shadow: {
        type: 'boolean',
        label: 'Show shadow',
        def: true,
      },
      textAlign: {
        type: 'select',
        label: 'Text align',
        def: 'center',
        choices: [
          {
            label: 'Left',
            value: 'left',
          },
          {
            label: 'Center',
            value: 'center',
          },
          {
            label: 'Right',
            value: 'right',
          },
        ],
      },
      anchorX: {
        type: 'select',
        label: 'Card horizontal anchor',
        def: 'center',
        choices: [
          {
            label: 'Left',
            value: 'left',
          },
          {
            label: 'Center',
            value: 'center',
          },
          {
            label: 'Right',
            value: 'right',
          },
        ],
      },
      anchorY: {
        type: 'select',
        label: 'Card vertical anchor',
        def: 'bottom',
        choices: [
          {
            label: 'Top',
            value: 'top',
          },
          {
            label: 'Center',
            value: 'center',
          },
          {
            label: 'Bottom',
            value: 'bottom',
          },
        ],
      },
    },
  },
};
