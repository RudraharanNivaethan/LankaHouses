import User from '../models/User.js';
import { formatErrorResponse } from '../utils/errorUtils.js';

export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name  !== undefined) updates.name  = req.body.name;
    if (req.body.phone !== undefined) updates.phone = req.body.phone;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};
