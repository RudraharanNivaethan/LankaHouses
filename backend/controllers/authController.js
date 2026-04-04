import { formatErrorResponse } from '../utils/errorUtils.js';
import { setAuthCookies, clearAuthCookies } from '../utils/tokenUtils.js';
import * as authService from '../services/authService.js';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    await authService.register({ name, email, phone, password });
    return res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.login(email, password);
    setAuthCookies(res, accessToken, refreshToken);
    return res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const logout = (req, res) => {
  clearAuthCookies(res);
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const refreshToken = async (req, res) => {
  try {
    const { accessToken, newRefreshToken } = authService.verifyRefreshToken(req.cookies.refreshToken);
    setAuthCookies(res, accessToken, newRefreshToken);
    return res.status(200).json({ success: true, message: 'Token refreshed' });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-loginAttempts -lockUntil');
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      const { statusCode, response } = formatErrorResponse(error);
      return res.status(statusCode).json(response);
    }
  };