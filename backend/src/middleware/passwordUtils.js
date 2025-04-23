import bcrypt from 'bcrypt';

/**
 * Hash a password with bcrypt
 * @param {string} plainTextPassword - The password to hash
 * @param {number} saltRounds - The number of salt rounds to use (default: 10)
 * @returns {Promise<string>} The hashed password
 */
export const hashPassword = async (plainTextPassword, saltRounds = 10) => {
  return await bcrypt.hash(plainTextPassword, saltRounds);
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} plainTextPassword - The plain text password to compare
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} True if the passwords match, false otherwise
 */
export const comparePassword = async (plainTextPassword, hashedPassword) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};