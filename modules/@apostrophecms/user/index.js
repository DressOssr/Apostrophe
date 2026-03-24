export default {
  fields: {
    add: {
      customRoleLabel: {
        type: 'string',
        label: 'Business Role Label'
      },
      _permissionGroups: {
        type: 'relationship',
        label: 'Permission Groups',
        withType: 'permission-group'
      }
    },
    group: {
      permissions: {
        fields: [
          'disabled',
          'role',
          'customRoleLabel',
          '_permissionGroups'
        ]
      }
    }
  },

  handlers(self) {
    return {
      beforeSave: {
        async preventNonAdminsFromManagingAdminUsers(req, doc) {
          if (!req.user || req.user.role === 'admin') {
            return;
          }

          const canManageUsers = req.can
            ? await req.can('manage', '@apostrophecms/user', doc)
            : false;

          if (!canManageUsers) {
            return;
          }

          if (doc.role === 'admin') {
            throw self.apos.error('forbidden', 'Only admins can assign the admin role.');
          }

          if (!doc._id) {
            return;
          }

          const existing = await self.find(self.apos.task.getAdminReq({
            locale: req.locale,
            aposLocale: req.aposLocale
          }), { _id: doc._id }).permission(false).toObject();

          if (existing?.role === 'admin') {
            throw self.apos.error('forbidden', 'Only admins can edit admin users.');
          }
        }
      }
    };
  }
};
