import mongoose from 'mongoose';

const sleepStudySchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    scheduledDate: { type: Date, required: true },
    status: { type: String, enum: ['requested', 'approved', 'scheduled', 'completed', 'cancelled'], default: 'requested' },
    type: { type: String, enum: ['in-lab', 'home', 'telemedicine'], default: 'in-lab' },
    notes: String,
    results: String,
    documents: [{ 
      filename: String, 
      originalName: String, 
      path: String, 
      uploadedAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

export default mongoose.model('SleepStudy', sleepStudySchema);

