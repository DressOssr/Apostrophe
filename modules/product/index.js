export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Product',
    pluralLabel: 'Products',
    permissionsLabel: 'Products',
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
      status: {
        type: 'select',
        label: 'Status',
        def: 'draft',
        choices: [
          {
            label: 'Draft',
            value: 'draft'
          },
          {
            label: 'Active',
            value: 'active'
          },
          {
            label: 'Archived',
            value: 'archived'
          }
        ]
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
      _owner: {
        type: 'relationship',
        label: 'Owner',
        withType: '@apostrophecms/user',
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
        fields: [ 'title', 'id', 'status', '_category', '_owner', 'price' ]
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
  },
  methods(self) {
    return {
      async getExistingProduct(req, doc) {
        if (!doc?._id) {
          return null;
        }

        return self.find(self.apos.task.getAdminReq({
          locale: req.locale,
          aposLocale: req.aposLocale
        }), {
          _id: doc._id
        }).permission(false).toObject();
      }
    };
  },
  handlers(self) {
    return {
      beforeInsert: {
        assignOwner(req, doc) {
          if (!doc.ownerIds?.length && req.user?.aposDocId) {
            doc.ownerIds = [ req.user.aposDocId ];
          }
        }
      },
      beforeSave: {
        async enforceBusinessPermissions(req, doc) {
          const existing = await self.getExistingProduct(req, doc);
          const referenceDoc = existing || doc;
          const action = existing ? 'edit' : 'create';

          if (req.user?.role !== 'admin' && !(await req.can(action, 'product', referenceDoc))) {
            throw self.apos.error('forbidden', 'You do not have permission to manage this product.');
          }

          if (!existing) {
            return;
          }

          // Sample field-level protection. Price and status are protected unless
          // a matching rule explicitly grants access to those field names.
          if (doc.price !== existing.price && !(await req.can('edit', 'product', referenceDoc, 'price'))) {
            throw self.apos.error('forbidden', 'You do not have permission to edit price.');
          }

          if (doc.status !== existing.status && !(await req.can('edit', 'product', referenceDoc, 'status'))) {
            throw self.apos.error('forbidden', 'You do not have permission to edit status.');
          }
        }
      }
    };
  },
  apiRoutes(self) {
    return {
      get: {
        secureSummary: [
          self.apos.businessPermission.guardRoute('manage', 'product'),
          async (req) => {
            const total = await self.find(req, {}).permission(false).toCount();
            return { total };
          }
        ]
      }
    };
  }
};
