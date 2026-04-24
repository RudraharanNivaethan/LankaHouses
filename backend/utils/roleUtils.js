/**
 * Role identity constants.
 *
 * Used only for:
 *   - JWT secret selection in `jwtConfig.js`
 *   - MongoDB queries filtering by role (e.g. in superAdminService.js)
 *   - Seeder scripts
 *
 * NOT used for authorization decisions. All authorization is done via
 * `PERMISSION` keys in `permissionKeys.js`.
 */
export const ROLE = Object.freeze({
  USER:       'user',
  ADMIN:      'admin',
  SUPERADMIN: 'superadmin',
});
