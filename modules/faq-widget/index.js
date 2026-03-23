export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'FAQ',
  },
  fields: {
    add: {
      title: {
        type: 'string',
        label: 'Section Title',
      },
      items: {
        type: 'array',
        titleField: 'question',
        label: 'FAQ Items',
        min: 1,
        fields: {
          add: {
            question: {
              type: 'string',
              label: 'Question',
              required: true,
            },
            answer: {
              type: 'string',
              label: 'Answer',
              textarea: true,
              required: true,
            },
            isOpenByDefault: {
              type: 'boolean',
              label: 'Open by default',
              def: false,
            },
          },
        },
      },
    },
  },
};
