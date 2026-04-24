import 'dotenv/config';
import { seedPrivilegedUser } from './lib/seedPrivilegedUser.js';

if (process.env.NODE_ENV === 'production') {
  console.error('❌ Admin seed must not run in production.');
  process.exit(1);
}

const ADMIN_NAME     = process.env.ADMIN_FULLNAME_DEV;
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL_DEV;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD_DEV;

const missing = [];
if (!ADMIN_NAME)     missing.push('ADMIN_FULLNAME_DEV');
if (!ADMIN_EMAIL)    missing.push('ADMIN_EMAIL_DEV');
if (!ADMIN_PASSWORD) missing.push('ADMIN_PASSWORD_DEV');

if (missing.length) {
  console.error(`❌ Missing env variable(s): ${missing.join(', ')}`);
  process.exit(1);
}

seedPrivilegedUser({
  name:     ADMIN_NAME,
  email:    ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  role:     'admin',
});
