import 'dotenv/config';
import { seedPrivilegedUser } from './lib/seedPrivilegedUser.js';

if (process.env.NODE_ENV === 'production') {
  console.error('❌ Superadmin seed must not run in production.');
  process.exit(1);
}

const SUPER_ADMIN_NAME     = process.env.SUPER_ADMIN_FULLNAME_DEV;
const SUPER_ADMIN_EMAIL    = process.env.SUPER_ADMIN_EMAIL_DEV;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD_DEV;

const missing = [];
if (!SUPER_ADMIN_NAME)     missing.push('SUPER_ADMIN_FULLNAME_DEV');
if (!SUPER_ADMIN_EMAIL)    missing.push('SUPER_ADMIN_EMAIL_DEV');
if (!SUPER_ADMIN_PASSWORD) missing.push('SUPER_ADMIN_PASSWORD_DEV');

if (missing.length) {
  console.error(`❌ Missing env variable(s): ${missing.join(', ')}`);
  process.exit(1);
}

seedPrivilegedUser({
  name:     SUPER_ADMIN_NAME,
  email:    SUPER_ADMIN_EMAIL,
  password: SUPER_ADMIN_PASSWORD,
  role:     'superadmin',
});
