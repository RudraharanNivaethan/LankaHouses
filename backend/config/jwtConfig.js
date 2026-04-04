const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';

export const CUSTOMER_JWT_SECRET         = process.env[`CUSTOMER_JWT_SECRET_${env}`];
export const CUSTOMER_REFRESH_JWT_SECRET = process.env[`CUSTOMER_REFRESH_JWT_SECRET_${env}`];
export const ADMIN_JWT_SECRET            = process.env[`ADMIN_JWT_SECRET_${env}`];
export const ADMIN_REFRESH_JWT_SECRET    = process.env[`ADMIN_REFRESH_JWT_SECRET_${env}`];

const secrets = {
  CUSTOMER_JWT_SECRET,
  CUSTOMER_REFRESH_JWT_SECRET,
  ADMIN_JWT_SECRET,
  ADMIN_REFRESH_JWT_SECRET
};

Object.entries(secrets).forEach(([name, value]) => {
  if (!value) throw new Error(`Missing JWT secret: ${name}_${env}. Check your .env file.`);
});
