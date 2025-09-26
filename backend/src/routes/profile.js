import { Router } from 'express';
import Joi from 'joi';
import User from '../models/User.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

const profileUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\+?[\d\s-()]+$/),
  profile: Joi.object({
    dateOfBirth: Joi.date(),
    gender: Joi.string().valid('male', 'female', 'other'),
    address: Joi.string(),
    emergencyContact: Joi.string(),
    medicalHistory: Joi.string(),
    allergies: Joi.string(),
    medications: Joi.string()
  })
});

router.get('/', authGuard, async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash -otpCode -otpExpiry');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

router.put('/', authGuard, async (req, res) => {
  try {
    const { value, error } = profileUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if email is already taken by another user
    if (value.email && value.email !== user.email) {
      const existingEmail = await User.findOne({ email: value.email, _id: { $ne: user._id } });
      if (existingEmail) return res.status(409).json({ message: 'Email already taken' });
    }

    // Check if phone is already taken by another user
    if (value.phone && value.phone !== user.phone) {
      const existingPhone = await User.findOne({ phone: value.phone, _id: { $ne: user._id } });
      if (existingPhone) return res.status(409).json({ message: 'Phone already taken' });
    }

    // Update user fields
    Object.keys(value).forEach(key => {
      if (key === 'profile') {
        user.profile = { ...user.profile, ...value.profile };
      } else {
        user[key] = value[key];
      }
    });

    await user.save();

    const updatedUser = await User.findById(user._id).select('-passwordHash -otpCode -otpExpiry');
    res.json(updatedUser);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

