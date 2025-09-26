import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    questions: [{
      question: String,
      type: { type: String, enum: ['text', 'multiple-choice', 'scale', 'yes-no'], default: 'text' },
      options: [String],
      required: { type: Boolean, default: true }
    }],
    responses: [{
      questionId: mongoose.Schema.Types.ObjectId,
      answer: mongoose.Schema.Types.Mixed
    }],
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    completedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model('Assessment', assessmentSchema);

