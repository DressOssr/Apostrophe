export default {
  extend: '@apostrophecms/widget-type',

  options: {
    label: 'Icon List'
  },

  fields: {
    add: {
      items: {
        type: 'array',
        label: 'Icons',
        titleField: 'label',
        min: 1,
        fields: {
          add: {
            label: {
              type: 'string',
              label: 'Label',
              help: 'Used for alt text and editor label'
            },
            _image: {
              type: 'relationship',
              label: 'Image',
              withType: '@apostrophecms/image',
              max: 1,
              required: true
            },
            link: {
              type: 'url',
              label: 'Link',
              required: false
            },
            openInNewTab: {
              type: 'boolean',
              label: 'Open in new tab',
              def: false
            }
          }
        }
      },
      columnsDesktop: {
        type: 'integer',
        label: 'Columns on desktop',
        def: 6,
        min: 1,
        max: 12
      },
      columnsTablet: {
        type: 'integer',
        label: 'Columns on tablet',
        def: 3,
        min: 1,
        max: 8
      },
      columnsMobile: {
        type: 'integer',
        label: 'Columns on mobile',
        def: 2,
        min: 1,
        max: 4
      },
      gap: {
        type: 'select',
        label: 'Gap',
        def: 'md',
        choices: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' }
        ]
      },
      align: {
        type: 'select',
        label: 'Alignment',
        def: 'center',
        choices: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' }
        ]
      },
      imageMaxWidth: {
        type: 'integer',
        label: 'Max image width (px)',
        def: 120,
        min: 40,
        max: 400
      },
      grayscale: {
        type: 'boolean',
        label: 'Make logos grayscale',
        def: false
      }
    }
  }
}
