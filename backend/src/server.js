import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import profileRoutes from './routes/profile.js';
import sleepStudyRoutes from './routes/sleepStudy.js';
import invoiceRoutes from './routes/invoices.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/sleep-study', sleepStudyRoutes);
app.use('/api/invoices', invoiceRoutes);

// Serve static frontend (built-in simple setup)
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../../frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

const PORT = process.env.PORT || 4000;
let MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor_crm';

// Optional in-memory MongoDB to simplify local runs
if (MONGO_URI === 'memory') {
  console.log('Using in-memory MongoDB...');
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create();
  MONGO_URI = mongod.getUri();
}

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Auto-seed doctors if none exist
    try {
      const Doctor = (await import('./models/Doctor.js')).default;
      const doctorCount = await Doctor.countDocuments();
      if (doctorCount === 0) {
        console.log('No doctors found, seeding sample doctors...');
        const response = await fetch(`http://localhost:${PORT}/api/doctors/auto-seed`);
        const result = await response.json();
        console.log(result.message);
      } else {
        console.log(`Found ${doctorCount} doctors in database`);
      }
    } catch (seedError) {
      console.log('Auto-seeding will be available after server starts');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Visit http://localhost:4000/api/doctors/auto-seed to seed doctors if needed');
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();


