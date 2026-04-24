import { formatErrorResponse } from '../utils/errorUtils.js';
import { toPublicUser } from '../utils/userDto.js';
import {
  listUsers,
  getUserRoleStats,
  createAdminUser,
} from '../services/superAdminService.js';

export const getUsers = async (req, res) => {
  try {
    const { role, page, limit } = req.validatedQuery;
    const result = await listUsers({ role, page, limit });
    return res.status(200).json({
      success: true,
      data:       result.users.map(toPublicUser),
      pagination: {
        total:      result.total,
        page:       result.page,
        limit:      result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const getUserStats = async (_req, res) => {
  try {
    const stats = await getUserRoleStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const createAdmin = async (req, res) => {
  try {
    const user = await createAdminUser(req.body);
    return res.status(201).json({ success: true, data: toPublicUser(user) });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};
