export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Product',
    pluralLabel: 'Products',
    sort: {
      createdAt: -1
    }
  },
  fields: {
    add: {
      id: {
        type: 'string',
        label: 'ID',
        required: true
      },
      title: {
        type: 'string',
        label: 'Title',
        required: true
      },
      price: {
        type: 'string',
        label: 'Price',
        required: true
      },
      description: {
        type: 'string',
        label: 'Description',
        textarea: true,
        required: true
      },
      _category: {
        type: 'relationship',
        label: 'Category',
        withType: 'product-category',
        max: 1,
        required: true
      },
      imageUrl: {
        type: 'url',
        label: 'Image URL',
        required: true
      },
      ratingRate: {
        type: 'string',
        label: 'Rating Rate'
      },
      ratingCount: {
        type: 'string',
        label: 'Rating Count'
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [ 'title', 'id', '_category', 'price' ]
      },
      details: {
        label: 'Details',
        fields: [
          'description',
          'imageUrl',
          'ratingRate',
          'ratingCount',
          'slug',
          'visibility'
        ]
      }
    }
  },
  columns: {
    add: {
      id: {
        label: 'id'
      },
      _category: {
        label: 'Category',
        component: 'DemoCellRelation'
      },
      price: {
        label: 'Price'
      }
    }
  },
  filters: {
    add: {
      category: {
        label: 'category'
      }
    }
  }
};
