import { Router } from 'express';
import Joi from 'joi';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { authGuard, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const doctors = await Doctor.find().populate('user', 'name email');
  res.json(doctors);
});

const createSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
  specialty: Joi.string().min(2).required(),
  bio: Joi.string().allow(''),
});

router.post('/', authGuard, requireRole(['admin']), async (req, res) => {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    // Check if user already exists
    let user = await User.findOne({ email: value.email });
    if (user) {
      if (user.role === 'doctor') {
        return res.status(409).json({ message: 'Doctor with this email already exists' });
      } else {
        return res.status(409).json({ message: 'User with this email already exists as a different role' });
      }
    }

    // Create new user for doctor
    user = await User.create({ 
      name: value.name, 
      email: value.email, 
      phone: value.phone,
      passwordHash: '!', // Temporary password, doctor will need to set their own
      role: 'doctor',
      isEmailVerified: true // Admin-created doctors are pre-verified
    });

    // Create doctor profile
    const doctor = await Doctor.create({ 
      user: user._id, 
      specialty: value.specialty, 
      bio: value.bio || '' 
    });

    const populated = await Doctor.findById(doctor._id).populate('user', 'name email phone');
    res.status(201).json(populated);
  } catch (e) {
    console.error('Error creating doctor:', e);
    res.status(500).json({ message: 'Server error creating doctor' });
  }
});

// Add sample doctors (for development)
router.post('/seed', async (req, res) => {
  try {
    const sampleDoctors = [
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@clinic.com',
        phone: '+1-555-0101',
        specialty: 'Sleep Medicine',
        bio: 'Board-certified sleep specialist with 10+ years of experience in treating sleep disorders including sleep apnea, insomnia, and circadian rhythm disorders.'
      },
      {
        name: 'Dr. Michael Chen',
        email: 'michael.chen@clinic.com',
        phone: '+1-555-0102',
        specialty: 'Pulmonology & Sleep',
        bio: 'Expert in respiratory sleep disorders and CPAP therapy management. Specializes in complex sleep breathing disorders and pulmonary conditions affecting sleep.'
      },
      {
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@clinic.com',
        phone: '+1-555-0103',
        specialty: 'Neurology & Sleep',
        bio: 'Specializes in neurological sleep disorders and sleep pattern analysis. Expert in narcolepsy, restless leg syndrome, and sleep-related movement disorders.'
      }
    ];

    const createdDoctors = [];
    for (const docData of sampleDoctors) {
      let user = await User.findOne({ email: docData.email });
      if (!user) {
        user = await User.create({ 
          name: docData.name, 
          email: docData.email, 
          phone: docData.phone,
          passwordHash: '!', 
          role: 'doctor',
          isEmailVerified: true,
          isPhoneVerified: true
        });
      }
      
      let doctor = await Doctor.findOne({ user: user._id });
      if (!doctor) {
        doctor = await Doctor.create({ 
          user: user._id, 
          specialty: docData.specialty, 
          bio: docData.bio 
        });
      }
      
      const populated = await Doctor.findById(doctor._id).populate('user', 'name email phone');
      createdDoctors.push(populated);
    }

    res.json({ message: 'Sample doctors added successfully', doctors: createdDoctors });
  } catch (e) {
    res.status(500).json({ message: 'Error adding sample doctors', error: e.message });
  }
});

// Auto-seed doctors on startup (development)
router.get('/auto-seed', async (req, res) => {
  try {
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      const sampleDoctors = [
        {
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@clinic.com',
          phone: '+1-555-0101',
          specialty: 'Sleep Medicine',
          bio: 'Board-certified sleep specialist with 10+ years of experience in treating sleep disorders including sleep apnea, insomnia, and circadian rhythm disorders.'
        },
        {
          name: 'Dr. Michael Chen',
          email: 'michael.chen@clinic.com',
          phone: '+1-555-0102',
          specialty: 'Pulmonology & Sleep',
          bio: 'Expert in respiratory sleep disorders and CPAP therapy management. Specializes in complex sleep breathing disorders and pulmonary conditions affecting sleep.'
        },
        {
          name: 'Dr. Emily Rodriguez',
          email: 'emily.rodriguez@clinic.com',
          phone: '+1-555-0103',
          specialty: 'Neurology & Sleep',
          bio: 'Specializes in neurological sleep disorders and sleep pattern analysis. Expert in narcolepsy, restless leg syndrome, and sleep-related movement disorders.'
        }
      ];

      for (const docData of sampleDoctors) {
        const user = await User.create({ 
          name: docData.name, 
          email: docData.email, 
          phone: docData.phone,
          passwordHash: '!', 
          role: 'doctor',
          isEmailVerified: true,
          isPhoneVerified: true
        });
        
        await Doctor.create({ 
          user: user._id, 
          specialty: docData.specialty, 
          bio: docData.bio 
        });
      }
      
      res.json({ message: '3 doctors auto-seeded successfully' });
    } else {
      res.json({ message: 'Doctors already exist', count: doctorCount });
    }
  } catch (e) {
    res.status(500).json({ message: 'Error auto-seeding doctors', error: e.message });
  }
});

export default router;


