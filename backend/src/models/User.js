import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: false, unique: true, sparse: true, lowercase: true, index: true },
    phone: { type: String, required: false, unique: true, sparse: true, index: true },
    passwordHash: { type: String, required: false },
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    otpCode: { type: String },
    otpExpiry: { type: Date },
    profile: {
      dateOfBirth: Date,
      gender: { type: String, enum: ['male', 'female', 'other'] },
      address: String,
      emergencyContact: String,
      medicalHistory: String,
      allergies: String,
      medications: String
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);


