import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialty: { type: String, required: true },
    bio: { type: String, default: '' },
    availability: [
      {
        dayOfWeek: { type: Number, min: 0, max: 6 },
        startTime: { type: String },
        endTime: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Doctor', doctorSchema);


