const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Hashes a plain-text password using bcrypt.
 * @param {string} password - Plain text password.
 * @returns {Promise<string>} - Hashed password.
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
};

/**
 * Compares a plain-text password with a hashed password.
 * @param {string} password - Plain text password.
 * @param {string} hashedPassword - Hashed password stored in DB.
 * @returns {Promise<boolean>} - True if match, false otherwise.
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
