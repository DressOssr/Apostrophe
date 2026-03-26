# Custom Permission System

This project includes a custom business permission layer implemented in project code only. It does not use `@apostrophecms-pro/advanced-permission`.

## Architecture

- Apostrophe core roles remain unchanged: `guest`, `contributor`, `editor`, `admin`.
- A second authorization layer is added with the `permission-group` piece type.
- Users can belong to multiple permission groups through the `_permissionGroups` relationship on `@apostrophecms/user`.
- Request-level checks go through `req.can(action, moduleName, doc?, fieldName?)`.
- Central logic lives in [modules/permission/index.js](/Users/alexander/WebstormProjects/ApostropheCMS/my-website/modules/permission/index.js).
- Core permission integration lives in [modules/@apostrophecms/permission/index.js](/Users/alexander/WebstormProjects/ApostropheCMS/my-website/modules/@apostrophecms/permission/index.js).

## Main Files

- `modules/permission-group/index.js`
- `modules/permission/index.js`
- `modules/@apostrophecms/permission/index.js`
- `modules/@apostrophecms/user/index.js`
- `modules/product/index.js`
- `modules/helper/index.js`

## Permission Group Shape

Each `permission-group` contains:

- `title`
- `slug`
- `isActive`
- `description`
- `permissions`

Each `permissions` item contains:

- `moduleName`
- `actions`
- `fieldPermissions`
- `documentScope`
- `documentIds`
- `localeCodes`

Supported document scopes:

- `all`
- `ids`
- `ownerOnly`
- `locale`

## Request Helper

The middleware in `modules/permission/index.js` attaches:

```js
await req.can(action, moduleName, doc, fieldName);
```

Examples:

```js
await req.can('edit', 'product', productDoc);
await req.can('edit', 'product', productDoc, 'price');
await req.can('manage', 'product');
```

## Enforcement

Server-side enforcement happens in these places:

- `req.can(...)` for custom route guards
- `@apostrophecms/permission.can(...)` override for core type checks
- `@apostrophecms/permission.criteria(...)` override for manager/editor queries
- `modules/product/index.js` `beforeSave` handler for field-level restrictions
- `modules/@apostrophecms/user/index.js` `beforeSave` handler to block non-admin edits of admin users

UI checks are secondary only. Templates can use:

```jinja
{% if canPermission(data.user, 'manage', 'product') %}
```

## Product Example

The `product` module demonstrates:

- module-level permissions for `create`, `edit`, `publish`, `manage`
- field-level permissions for `price` and `status`
- document-level restriction through `_owner` / `ownerIds`
- custom route guard on `GET /api/v1/product/secure-summary`

## User Example

Users now support:

- `_permissionGroups`
- `customRoleLabel`

Business naming is separated from Apostrophe core role behavior.

## Seed Sample Groups

Run:

```bash
node app permission-group:seed-sample-groups
```

This creates:

- `Catalog Manager`
- `Content Editor`
- `Read-Only Reviewer`

## Limitations vs Apostrophe Pro Advanced Permission

- No Pro admin UI parity
- No advanced bulk-edit experience
- No full document-picker UI for scoped IDs; `documentIds` are stored as strings
- Locale scope is implemented in a practical partial way
- Field-level restrictions are enforced server-side in sample modules, not automatically for every module
- Manager filtering is best-effort through `criteria()` and may need module-specific hardening for complex cases

## Extending the System

To add new rules:

1. Add or edit `permission-group` pieces.
2. Use the target Apostrophe module name in `moduleName`.
3. Add route guards with `self.apos.businessPermission.guardRoute(...)`.
4. Add `beforeSave`, `beforeInsert`, or other handlers in sensitive modules for field-specific or business-specific rules.
5. Use `req.can(...)` in server code and `canPermission(...)` in templates.
