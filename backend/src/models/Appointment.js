import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledAt: { type: Date, required: true },
    reason: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' }
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);


