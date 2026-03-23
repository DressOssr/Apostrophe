import { fullConfig } from '../../../lib/area.js';

export default {
  fields: {
    add: {
      items: {
        type: 'area',
        options: {
          widgets: fullConfig,
        },
      },
      justifyContent: {
        type: 'select',
        label: 'Justify content',
        def: 'center',
        choices: [
          {
            label: 'Left',
            value: 'flex-start',
          },
          {
            label: 'Center',
            value: 'center',
          },
          {
            label: 'Right',
            value: 'flex-end',
          },
          {
            label: 'Space between',
            value: 'space-between',
          },
          {
            label: 'Space around',
            value: 'space-around',
          },
        ],
      },
      alignItems: {
        type: 'select',
        label: 'Align items',
        def: 'stretch',
        choices: [
          {
            label: 'Stretch',
            value: 'stretch',
          },
          {
            label: 'Start',
            value: 'flex-start',
          },
          {
            label: 'Center',
            value: 'center',
          },
          {
            label: 'End',
            value: 'flex-end',
          },
        ],
      },
      gap: {
        type: 'integer',
        label: 'Gap',
        def: 32,
        min: 0,
        max: 120,
      },
      itemWidth: {
        type: 'integer',
        label: 'Item width',
        def: 380,
        min: 160,
        max: 800,
      },
      wrap: {
        type: 'boolean',
        label: 'Wrap items',
        def: true,
      },
    },
  },
};
