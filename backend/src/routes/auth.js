import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import User from '../models/User.js';
import crypto from 'crypto';

const router = Router();

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^\\+?[\d\s-()]+$/).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).optional(),
  role: Joi.string().valid('patient').default('patient') // Only patients can register
});

const otpVerifySchema = Joi.object({
  phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).required(),
  otp: Joi.string().length(6).required()
});

// Generate OTP for phone verification
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number required' });

    // Basic phone validation
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if user exists and is verified
    const existingVerifiedUser = await User.findOne({ phone, isPhoneVerified: true });
    if (existingVerifiedUser) {
      return res.status(409).json({ message: 'Phone number already registered. Please use a different number or try logging in.' });
    }

    // Check if user exists but not verified
    let user = await User.findOne({ phone, isPhoneVerified: false });
    if (user) {
      user.otpCode = otp;
      user.otpExpiry = expiry;
      await user.save();
    } else {
      // Create temporary user record with default name
      user = await User.create({
        name: 'Temp',
        phone,
        otpCode: otp,
        otpExpiry: expiry,
        role: 'patient'
      });
    }

    // In production, send OTP via SMS service
    console.log(`OTP for ${phone}: ${otp}`);
    
    res.json({ message: 'OTP sent successfully' });
  } catch (e) {
    console.error('Error sending OTP:', e);
    res.status(500).json({ message: 'Server error sending OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { value, error } = otpVerifySchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const user = await User.findOne({ phone: value.phone });
    if (!user) return res.status(404).json({ message: 'User not found. Please request OTP again.' });

    if (!user.otpCode || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (user.otpCode !== value.otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
    }

    // Verify phone
    user.isPhoneVerified = true;
    user.otpCode = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, phone: user.phone, role: user.role } });
  } catch (e) {
    console.error('Error verifying OTP:', e);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    // Check if phone is already registered
    const existingPhone = await User.findOne({ phone: value.phone, isPhoneVerified: true });
    if (existingPhone) return res.status(409).json({ message: 'Phone number already registered. Please use a different number or try logging in.' });

    // Check if phone exists but not verified - allow resending OTP
    const existingUnverifiedPhone = await User.findOne({ phone: value.phone, isPhoneVerified: false });
    if (existingUnverifiedPhone) {
      // Update the existing unverified user with new data
      existingUnverifiedPhone.name = value.name;
      existingUnverifiedPhone.email = value.email;
      if (value.password) {
        existingUnverifiedPhone.passwordHash = await bcrypt.hash(value.password, 10);
      }
      existingUnverifiedPhone.otpCode = generateOTP();
      existingUnverifiedPhone.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await existingUnverifiedPhone.save();
      
      console.log(`OTP for ${value.phone}: ${existingUnverifiedPhone.otpCode}`);
      return res.status(201).json({ message: 'Registration updated. Please verify OTP.', userId: existingUnverifiedPhone._id });
    }

    // Check if email is already registered (if provided)
    if (value.email) {
      const existingEmail = await User.findOne({ email: value.email });
      if (existingEmail) return res.status(409).json({ message: 'Email already registered. Please use a different email or try logging in.' });
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    let passwordHash = null;
    if (value.password) {
      passwordHash = await bcrypt.hash(value.password, 10);
    }

    const user = await User.create({
      name: value.name,
      phone: value.phone,
      email: value.email,
      passwordHash,
      role: 'patient', // Force patient role for registration
      otpCode: otp,
      otpExpiry: expiry
    });

    // In production, send OTP via SMS
    console.log(`OTP for ${value.phone}: ${otp}`);

    res.status(201).json({ message: 'Registration successful. Please verify OTP.', userId: user._id });
  } catch (e) {
    console.error('Error registering user:', e);
    if (e.code === 11000) {
      const field = Object.keys(e.keyPattern)[0];
      return res.status(409).json({ message: `${field} already exists` });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required()
});

router.post('/login', async (req, res) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    
    if (!user.passwordHash) return res.status(401).json({ message: 'No password set for this account. Please use phone verification.' });
    
    const valid = await bcrypt.compare(value.password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    console.error('Error during login:', e);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Create admin user (development only)
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password required' });
    }

    // Check if user with this email exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.role !== 'admin') {
        return res.status(409).json({ message: 'Email already in use by a non-admin user' });
      }
      // Existing admin → verify password and log in
      const ok = await bcrypt.compare(password, existing.passwordHash || '');
      if (!ok) return res.status(401).json({ message: 'Invalid admin credentials' });
      const token = jwt.sign({ id: existing._id, role: existing.role, name: existing.name }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
      return res.status(200).json({ 
        message: 'Admin already exists. Logged in successfully.',
        token,
        user: { id: existing._id, name: existing.name, email: existing.email, role: existing.role }
      });
    }

    // Create new admin
    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      email,
      passwordHash,
      role: 'admin',
      isEmailVerified: true,
      isPhoneVerified: true
    });

    const token = jwt.sign({ id: admin._id, role: admin.role, name: admin.name }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    
    res.status(201).json({ 
      message: 'Admin user created successfully',
      token, 
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } 
    });
  } catch (e) {
    console.error('Error creating admin:', e);
    res.status(500).json({ message: 'Server error creating admin' });
  }
});

export default router;


