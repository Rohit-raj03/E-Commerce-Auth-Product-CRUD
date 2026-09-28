const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { hashPassword, comparePassword } = require('../utils/password');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} = require('../utils/jwt');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        errors: [{ field: 'email', message: 'Email already registered' }],
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return response without generating tokens as per requirements
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        errors: [],
      });
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        errors: [],
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    // Hash refresh token for server-side MongoDB storage
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
      user: user._id,
      tokenHash,
      expiresAt,
    });

    // Send refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token using httpOnly refresh-token cookie
 * POST /api/auth/refresh-token
 */
const refreshToken = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not provided',
        errors: [],
      });
    }

    // Verify token validity & expiration signature
    let decoded;
    try {
      decoded = verifyRefreshToken(incomingRefreshToken);
    } catch (err) {
      res.clearCookie('refreshToken');
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired refresh token',
        errors: [],
      });
    }

    // Hash incoming refresh token to match against DB record
    const tokenHash = hashToken(incomingRefreshToken);
    const storedTokenDoc = await RefreshToken.findOne({
      user: decoded.id,
      tokenHash,
    });

    if (!storedTokenDoc) {
      // Token not found (revoked or reused)
      res.clearCookie('refreshToken');
      return res.status(403).json({
        success: false,
        message: 'Refresh token revoked or invalid',
        errors: [],
      });
    }

    // Refresh Token Rotation: remove used refresh token & issue new pair
    await RefreshToken.findByIdAndDelete(storedTokenDoc._id);

    const newAccessToken = generateAccessToken({ id: decoded.id });
    const newRefreshToken = generateRefreshToken({ id: decoded.id });
    const newTokenHash = hashToken(newRefreshToken);
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
      user: decoded.id,
      tokenHash: newTokenHash,
      expiresAt: newExpiresAt,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully',
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user by clearing cookie and revoking refresh token in DB
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (incomingRefreshToken) {
      const tokenHash = hashToken(incomingRefreshToken);
      await RefreshToken.deleteOne({ tokenHash });
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  me,
};
