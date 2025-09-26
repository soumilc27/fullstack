import { Router } from 'express';
import Joi from 'joi';
import SleepStudy from '../models/SleepStudy.js';
import Doctor from '../models/Doctor.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

const requestSchema = Joi.object({
  doctorName: Joi.string().required(),
  scheduledDate: Joi.date().iso().required(),
  type: Joi.string().valid('in-lab', 'home', 'telemedicine').default('in-lab'),
  notes: Joi.string().allow('')
});

router.get('/', authGuard, async (req, res) => {
  const filter = {};
  if (req.user.role === 'patient') {
    filter.patient = req.user.id;
  } else if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (doctor) filter.doctor = doctor._id;
  }

  const studies = await SleepStudy.find(filter)
    .populate('patient', 'name phone email')
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
    .sort({ scheduledDate: 1 });

  res.json(studies);
});

router.post('/request', authGuard, async (req, res) => {
  try {
    const { value, error } = requestSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    // Find doctor by name
    const doctor = await Doctor.findOne().populate('user', 'name').where('user.name').equals(value.doctorName);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const study = await SleepStudy.create({
      patient: req.user.id,
      doctor: doctor._id,
      scheduledDate: value.scheduledDate,
      type: value.type,
      notes: value.notes || ''
    });

    const populated = await SleepStudy.findById(study._id)
      .populate('patient', 'name phone email')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } });

    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/status', authGuard, async (req, res) => {
  const { status } = req.body;
  const allowed = ['requested', 'approved', 'scheduled', 'completed', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const study = await SleepStudy.findById(req.params.id);
  if (!study) return res.status(404).json({ message: 'Sleep study not found' });

  study.status = status;
  await study.save();

  const populated = await SleepStudy.findById(study._id)
    .populate('patient', 'name phone email')
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } });

  res.json(populated);
});

router.post('/:id/upload', authGuard, async (req, res) => {
  // In production, implement file upload with multer
  const { filename, originalName, path } = req.body;
  
  const study = await SleepStudy.findById(req.params.id);
  if (!study) return res.status(404).json({ message: 'Sleep study not found' });

  study.documents.push({ filename, originalName, path });
  await study.save();

  res.json(study);
});

export default router;

