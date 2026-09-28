const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generates a short-lived access JWT.
 * @param {object} payload - Data to embed in the token (e.g., { id: user._id }).
 * @returns {string} - Signed JWT access token string.
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  });
};

/**
 * Generates a long-lived refresh JWT.
 * @param {object} payload - Data to embed in the token (e.g., { id: user._id }).
 * @returns {string} - Signed JWT refresh token string.
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  });
};

/**
 * Verifies an access token using ACCESS_TOKEN_SECRET.
 * @param {string} token - JWT access token string.
 * @returns {object} - Decoded token payload.
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

/**
 * Verifies a refresh token using REFRESH_TOKEN_SECRET.
 * @param {string} token - JWT refresh token string.
 * @returns {object} - Decoded token payload.
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

/**
 * Creates a SHA-256 hash of a raw token string for secure database storage.
 * @param {string} token - Raw refresh token string.
 * @returns {string} - Hex string representation of hashed token.
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
};
