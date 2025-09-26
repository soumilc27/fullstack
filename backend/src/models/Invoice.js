import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    sleepStudy: { type: mongoose.Schema.Types.ObjectId, ref: 'SleepStudy' },
    items: [{
      description: String,
      quantity: Number,
      unitPrice: Number,
      total: Number
    }],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'overdue', 'cancelled'], default: 'pending' },
    paymentMethod: String,
    paymentDate: Date,
    dueDate: Date
  },
  { timestamps: true }
);

export default mongoose.model('Invoice', invoiceSchema);

