import { Router } from 'express';
import Joi from 'joi';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

const createSchema = Joi.object({
  doctorName: Joi.string().required(),
  scheduledAt: Joi.date().iso().required(),
  reason: Joi.string().allow('')
});

router.get('/', authGuard, async (req, res) => {
  const filter = {};
  if (req.user.role === 'patient') filter.patient = req.user.id;
  if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (doctor) filter.doctor = doctor._id;
  }
  const list = await Appointment.find(filter).populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } }).populate('patient', 'name email').sort({ scheduledAt: 1 });
  res.json(list);
});

router.post('/', authGuard, async (req, res) => {
  const { value, error } = createSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  
  // Find doctor by name
  const doctor = await Doctor.findOne().populate('user', 'name').where('user.name').equals(value.doctorName);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  
  const appt = await Appointment.create({ doctor: doctor._id, patient: req.user.id, scheduledAt: value.scheduledAt, reason: value.reason || '' });
  res.status(201).json(await appt.populate([{ path: 'doctor', populate: { path: 'user', select: 'name email' } }, { path: 'patient', select: 'name email' }]));
});

router.patch('/:id/status', authGuard, async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: 'Not found' });
  appt.status = status;
  await appt.save();
  res.json(appt);
});

router.delete('/:id', authGuard, async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default router;


