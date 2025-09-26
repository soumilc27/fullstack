import { Router } from 'express';
import Joi from 'joi';
import Invoice from '../models/Invoice.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

const createInvoiceSchema = Joi.object({
  appointment: Joi.string().optional(),
  sleepStudy: Joi.string().optional(),
  items: Joi.array().items(Joi.object({
    description: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    unitPrice: Joi.number().min(0).required()
  })).min(1).required(),
  tax: Joi.number().min(0).default(0)
});

router.get('/', authGuard, async (req, res) => {
  const filter = {};
  if (req.user.role === 'patient') {
    filter.patient = req.user.id;
  }

  const invoices = await Invoice.find(filter)
    .populate('patient', 'name phone email')
    .populate('appointment')
    .populate('sleepStudy')
    .sort({ createdAt: -1 });

  res.json(invoices);
});

router.post('/', authGuard, async (req, res) => {
  try {
    const { value, error } = createInvoiceSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    // Calculate totals
    const items = value.items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal + (subtotal * value.tax / 100);

    const invoice = await Invoice.create({
      patient: req.user.id,
      appointment: value.appointment,
      sleepStudy: value.sleepStudy,
      items,
      subtotal,
      tax: value.tax,
      total,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    const populated = await Invoice.findById(invoice._id)
      .populate('patient', 'name phone email')
      .populate('appointment')
      .populate('sleepStudy');

    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/payment', authGuard, async (req, res) => {
  const { paymentMethod } = req.body;
  
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

  if (req.user.role === 'patient' && invoice.patient.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }

  invoice.status = 'paid';
  invoice.paymentMethod = paymentMethod;
  invoice.paymentDate = new Date();
  await invoice.save();

  const populated = await Invoice.findById(invoice._id)
    .populate('patient', 'name phone email')
    .populate('appointment')
    .populate('sleepStudy');

  res.json(populated);
});

export default router;

