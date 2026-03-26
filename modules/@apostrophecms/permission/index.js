export default {
  extendMethods(self) {
    return {
      criteria(_super, req, action) {
        const coreCriteria = _super(req, action);
        const customCriteria = self.apos.businessPermission.customCriteria(req, action);

        if (!customCriteria) {
          return coreCriteria;
        }

        if (!coreCriteria || !Object.keys(coreCriteria).length) {
          return customCriteria;
        }

        return {
          $or: [
            coreCriteria,
            customCriteria
          ]
        };
      },

      can(_super, req, action, docOrType, mode) {
        const moduleName = docOrType && (docOrType.type || docOrType);

        if (action === 'manage') {
          return self.apos.businessPermission.matchesCustomPermission(req, action, moduleName, docOrType);
        }

        if (self.apos.businessPermission.matchesCustomPermission(req, action, moduleName, docOrType)) {
          return true;
        }

        return _super(req, action, docOrType, mode);
      }
    };
  }
};
