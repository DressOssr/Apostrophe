export default {
  options: {
    alias: 'businessPermission'
  },

  middleware(self) {
    return {
      attachBusinessPermissionContext: {
        middleware: async (req, res, next) => {
          try {
            await self.attachRequestContext(req);
            req.can = async (action, moduleName, doc = null, fieldName = null) => {
              return self.can(req, action, moduleName, doc, fieldName);
            };
            return next();
          } catch (error) {
            return next(error);
          }
        }
      }
    };
  },

  methods(self) {
    return {
      normalizeModuleName(moduleName) {
        const name = self.apos.launder.string(moduleName || '');

        if (name === 'page') {
          return '@apostrophecms/any-page-type';
        }
        if (name === 'user') {
          return '@apostrophecms/user';
        }
        if (name) {
          const manager = self.apos.doc.getManager(name);

          if (manager && self.apos.synth.instanceOf(manager, '@apostrophecms/page-type')) {
            return '@apostrophecms/any-page-type';
          }
        }

        return name;
      },

      extractLocaleCode(locale) {
        return self.apos.launder.string(locale || '').split(':')[0] || '';
      },

      getOwnerIdentifiers(req, doc = null) {
        const identifiers = new Set();

        if (req.user?._id) {
          identifiers.add(req.user._id);
        }
        if (req.user?.aposDocId) {
          identifiers.add(req.user.aposDocId);
        }

        if (doc?.ownerIds?.length) {
          doc.ownerIds.forEach((id) => identifiers.add(id));
        }

        return Array.from(identifiers);
      },

      toStringArray(values) {
        if (!Array.isArray(values)) {
          return [];
        }

        return values
          .map((value) => {
            if (typeof value === 'string') {
              return value;
            }

            if (value && typeof value.value === 'string') {
              return value.value;
            }

            return '';
          })
          .filter(Boolean);
      },

      async attachRequestContext(req) {
        if (!req.user) {
          req.businessPermissionContext = {
            groups: [],
            rules: []
          };
          return;
        }

        const permissionGroupIds = Array.isArray(req.user.permissionGroupsIds)
          ? req.user.permissionGroupsIds
          : [];

        if (!permissionGroupIds.length) {
          req.businessPermissionContext = {
            groups: [],
            rules: []
          };
          req.user._permissionGroupsResolved = [];
          return;
        }

        const adminReq = self.apos.task.getAdminReq({
          locale: req.locale,
          aposLocale: req.aposLocale
        });
        const groups = await self.apos.modules['permission-group']
          .find(adminReq, {
            aposDocId: {
              $in: permissionGroupIds
            },
            isActive: true
          })
          .permission(false)
          .toArray();

        req.user._permissionGroupsResolved = groups;
        req.businessPermissionContext = {
          groups,
          rules: groups.flatMap((group) =>
            Array.isArray(group.permissions)
              ? group.permissions.map((rule) => ({
                ...rule,
                _groupSlug: group.slug,
                moduleName: self.normalizeModuleName(rule.moduleName)
              }))
              : []
          )
        };
      },

      getContext(reqOrUser) {
        if (reqOrUser?.businessPermissionContext) {
          return reqOrUser.businessPermissionContext;
        }

        if (reqOrUser?._permissionGroupsResolved) {
          const groups = reqOrUser._permissionGroupsResolved.filter((group) => group.isActive !== false);
          return {
            groups,
            rules: groups.flatMap((group) =>
              Array.isArray(group.permissions)
                ? group.permissions.map((rule) => ({
                  ...rule,
                  _groupSlug: group.slug,
                  moduleName: self.normalizeModuleName(rule.moduleName)
                }))
                : []
            )
          };
        }

        return {
          groups: [],
          rules: []
        };
      },

      actionMatches(rule, action) {
        const actions = Array.isArray(rule.actions) ? rule.actions : [];
        return actions.includes(action);
      },

      fieldMatches(rule, fieldName) {
        if (!fieldName) {
          return true;
        }

        const fieldPermissions = Array.isArray(rule.fieldPermissions)
          ? self.toStringArray(rule.fieldPermissions)
          : [];

        if (!fieldPermissions.length) {
          return false;
        }

        return fieldPermissions.includes(fieldName);
      },

      documentMatches(req, rule, doc) {
        const scope = rule.documentScope || 'all';

        if (scope === 'all') {
          return true;
        }

        if (scope === 'ids') {
          if (!doc) {
            return false;
          }

          const ids = Array.isArray(rule.documentIds) ? rule.documentIds : [];
          const normalizedIds = self.toStringArray(ids);
          return normalizedIds.includes(doc._id) || normalizedIds.includes(doc.aposDocId);
        }

        if (scope === 'ownerOnly') {
          if (!doc) {
            return true;
          }

          const docOwnerIds = Array.isArray(doc.ownerIds) ? doc.ownerIds : [];
          const userIds = self.getOwnerIdentifiers(req);
          return docOwnerIds.some((id) => userIds.includes(id));
        }

        if (scope === 'locale') {
          const localeCodes = Array.isArray(rule.localeCodes) ? rule.localeCodes : [];
          const normalizedLocaleCodes = self.toStringArray(localeCodes);
          const activeLocaleCode = self.extractLocaleCode(doc?.aposLocale || req.aposLocale || req.locale);

          if (!normalizedLocaleCodes.length) {
            return true;
          }

          return normalizedLocaleCodes.includes(activeLocaleCode);
        }

        return false;
      },

      checkSpecialRestrictions(req, moduleName, doc) {
        if (moduleName === '@apostrophecms/user' && doc?.role === 'admin' && req.user?.role !== 'admin') {
          return false;
        }

        return true;
      },

      matchesCustomPermission(req, action, moduleName, doc = null, fieldName = null) {
        if (!req?.user) {
          return false;
        }

        if (req.user.role === 'admin') {
          return true;
        }

        const resolvedModuleName = self.normalizeModuleName(moduleName);
        const { rules } = self.getContext(req);

        return rules.some((rule) => {
          if (rule.moduleName !== resolvedModuleName) {
            return false;
          }
          if (!self.actionMatches(rule, action)) {
            return false;
          }
          if (!self.fieldMatches(rule, fieldName)) {
            return false;
          }
          if (!self.documentMatches(req, rule, doc)) {
            return false;
          }
          if (!self.checkSpecialRestrictions(req, resolvedModuleName, doc)) {
            return false;
          }

          return true;
        });
      },

      can(req, action, moduleName, doc = null, fieldName = null) {
        if (self.matchesCustomPermission(req, action, moduleName, doc, fieldName)) {
          return true;
        }

        const resolvedModuleName = self.normalizeModuleName(moduleName);
        const coreActions = [ 'create', 'edit', 'delete', 'publish', 'view' ];

        if (!coreActions.includes(action)) {
          return false;
        }

        return self.apos.permission.can(req, action, doc || resolvedModuleName);
      },

      canForUser(user, action, moduleName, doc = null, fieldName = null) {
        if (!user) {
          return false;
        }

        if (user.role === 'admin') {
          return true;
        }

        const resolvedModuleName = self.normalizeModuleName(moduleName);
        const { rules } = self.getContext(user);

        return rules.some((rule) => {
          if (rule.moduleName !== resolvedModuleName) {
            return false;
          }
          if (!self.actionMatches(rule, action)) {
            return false;
          }
          if (!self.fieldMatches(rule, fieldName)) {
            return false;
          }
          if (resolvedModuleName === '@apostrophecms/user' && doc?.role === 'admin' && user.role !== 'admin') {
            return false;
          }
          return true;
        });
      },

      buildRuleCriteria(req, rule) {
        const criteria = rule.moduleName === '@apostrophecms/any-page-type'
          ? {
            level: {
              $gte: 0
            }
          }
          : {
            type: rule.moduleName
          };

        if (rule.moduleName === '@apostrophecms/user' && req.user?.role !== 'admin') {
          criteria.role = {
            $ne: 'admin'
          };
        }

        if (rule.documentScope === 'ids') {
          const ids = self.toStringArray(rule.documentIds);

          if (!ids.length) {
            return null;
          }

          return {
            $and: [
              criteria,
              {
                $or: [
                  { _id: { $in: ids } },
                  { aposDocId: { $in: ids } }
                ]
              }
            ]
          };
        }

        if (rule.documentScope === 'ownerOnly') {
          const userIds = self.getOwnerIdentifiers(req);

          if (!userIds.length) {
            return null;
          }

          criteria.ownerIds = {
            $in: userIds
          };
        }

        if (rule.documentScope === 'locale') {
          const localeCodes = self.toStringArray(rule.localeCodes);

          if (localeCodes.length) {
            criteria.aposLocale = {
              $regex: `^(${localeCodes.join('|')}):`
            };
          }
        }

        return criteria;
      },

      customCriteria(req, action) {
        if (!req?.user || req.user.role === 'admin') {
          return null;
        }

        const { rules } = self.getContext(req);
        const criteria = rules
          .filter((rule) => self.actionMatches(rule, action))
          .map((rule) => self.buildRuleCriteria(req, rule))
          .filter(Boolean);

        if (!criteria.length) {
          return null;
        }

        return criteria.length === 1 ? criteria[0] : { $or: criteria };
      },

      guardRoute(action, moduleName, options = {}) {
        return async (req, res, next) => {
          const doc = typeof options.getDoc === 'function'
            ? await options.getDoc(req)
            : null;
          const fieldName = typeof options.getFieldName === 'function'
            ? options.getFieldName(req)
            : null;

          if (!await req.can(action, moduleName, doc, fieldName)) {
            return next(self.apos.error('forbidden'));
          }

          return next();
        };
      }
    };
  }
};
