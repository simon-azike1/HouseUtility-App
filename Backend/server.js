import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://house-utility-app.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
connectDB();

// API routes
import authRoutes from './routes/auth.js';
import contributionRoutes from './routes/contributions.js';
import expenseRoutes from './routes/expenses.js';
import billRoutes from './routes/bills.js';
import householdRoutes from "./routes/household.js";

// Corrected route paths
app.use("/api/household", householdRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/bills', billRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'House Utility API is running 🚀', version: '1.0.0' });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.resolve(__dirname, '../house-utility-frontend/dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
