// [OLD CODE] Entire file superseded by Firebase authentication.
// Firebase owns password hashing and verification. Safe to delete along with the argon2 dependency.
//
// import argon2 from 'argon2';
//
// export const hashPassword = async (password) => {
//   return argon2.hash(password);
// };
//
// export const comparePasswords = async (password, hashedPassword) => {
//   return argon2.verify(hashedPassword, password);
// };
