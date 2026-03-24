const ACTION_CHOICES = [
  { label: 'Create', value: 'create' },
  { label: 'Edit', value: 'edit' },
  { label: 'Delete', value: 'delete' },
  { label: 'Publish', value: 'publish' },
  { label: 'View', value: 'view' },
  { label: 'Manage', value: 'manage' }
];

const DOCUMENT_SCOPE_CHOICES = [
  { label: 'All Documents', value: 'all' },
  { label: 'Specific Document IDs', value: 'ids' },
  { label: 'Owner Only', value: 'ownerOnly' },
  { label: 'Locale', value: 'locale' }
];

const SAMPLE_GROUPS = [
  {
    title: 'Catalog Manager',
    slug: 'catalog-manager',
    isActive: true,
    description: 'Can manage products, including protected business fields.',
    permissions: [
      {
        moduleName: 'product',
        actions: [ 'create', 'edit', 'delete', 'publish', 'view', 'manage' ],
        fieldPermissions: [ 'price', 'status' ],
        documentScope: 'all'
      }
    ]
  },
  {
    title: 'Content Editor',
    slug: 'content-editor',
    isActive: true,
    description: 'Can manage editorial content across the site.',
    permissions: [
      {
        moduleName: 'article',
        actions: [ 'create', 'edit', 'publish', 'view', 'manage' ],
        fieldPermissions: [],
        documentScope: 'all'
      },
      {
        moduleName: 'page',
        actions: [ 'edit', 'publish', 'view', 'manage' ],
        fieldPermissions: [],
        documentScope: 'locale',
        localeCodes: [ 'default' ]
      }
    ]
  },
  {
    title: 'Read-Only Reviewer',
    slug: 'read-only-reviewer',
    isActive: true,
    description: 'Can review products and articles without changing them.',
    permissions: [
      {
        moduleName: 'product',
        actions: [ 'view', 'manage' ],
        fieldPermissions: [],
        documentScope: 'locale',
        localeCodes: [ 'default' ]
      },
      {
        moduleName: 'article',
        actions: [ 'view', 'manage' ],
        fieldPermissions: [],
        documentScope: 'locale',
        localeCodes: [ 'default' ]
      }
    ]
  }
];

export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Permission Group',
    pluralLabel: 'Permission Groups',
    editRole: 'admin',
    publishRole: 'admin',
    viewRole: 'admin',
    showPermissions: false
  },

  fields: {
    add: {
      title: {
        type: 'string',
        label: 'Title',
        required: true
      },
      slug: {
        type: 'slug',
        label: 'Slug',
        required: true
      },
      isActive: {
        type: 'boolean',
        label: 'Active',
        def: true
      },
      description: {
        type: 'string',
        label: 'Description',
        textarea: true
      },
      permissions: {
        type: 'array',
        label: 'Permissions',
        titleField: 'moduleName',
        fields: {
          add: {
            moduleName: {
              type: 'string',
              label: 'Module Name',
              required: true,
              help: 'Examples: product, article, faq-widget, page, @apostrophecms/user'
            },
            actions: {
              type: 'checkboxes',
              label: 'Actions',
              choices: ACTION_CHOICES,
              required: true
            },
            fieldPermissions: {
              type: 'array',
              label: 'Field Permissions',
              help: 'Optional list of field names this rule may edit, for example price or status.',
              titleField: 'value',
              fields: {
                add: {
                  value: {
                    type: 'string',
                    label: 'Field Name',
                    required: true
                  }
                }
              }
            },
            documentScope: {
              type: 'select',
              label: 'Document Scope',
              choices: DOCUMENT_SCOPE_CHOICES,
              def: 'all',
              required: true
            },
            documentIds: {
              type: 'array',
              label: 'Document IDs',
              help: 'Used when the document scope is ids. Store _id or aposDocId values.',
              titleField: 'value',
              fields: {
                add: {
                  value: {
                    type: 'string',
                    label: 'Document ID',
                    required: true
                  }
                }
              }
            },
            localeCodes: {
              type: 'array',
              label: 'Locale Codes',
              help: 'Used when the document scope is locale. Example: en, fr, default.',
              titleField: 'value',
              fields: {
                add: {
                  value: {
                    type: 'string',
                    label: 'Locale Code',
                    required: true
                  }
                }
              }
            }
          }
        }
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [ 'title', 'slug', 'isActive', 'description' ]
      },
      rules: {
        label: 'Rules',
        fields: [ 'permissions' ]
      }
    }
  },

  columns: {
    add: {
      isActive: {
        label: 'Active'
      }
    }
  },

  methods(self) {
    return {
      getSampleGroups() {
        return SAMPLE_GROUPS;
      }
    };
  },

  tasks(self) {
    return {
      'seed-sample-groups': {
        usage: 'Usage: node app permission-group:seed-sample-groups',
        task: async () => {
          const req = self.apos.task.getAdminReq();

          for (const group of SAMPLE_GROUPS) {
            const existing = await self.find(req, { slug: group.slug }).permission(false).toObject();

            if (existing) {
              await self.update(req, {
                ...existing,
                ...group
              }, { permissions: false });
            } else {
              await self.insert(req, group, { permissions: false });
            }
          }
        }
      }
    };
  }
};
