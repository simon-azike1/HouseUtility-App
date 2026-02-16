import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';

// ✅ Debug: Check if env variables loaded
console.log('🔍 Environment Variables Check:');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Loaded' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ Missing');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Loaded' : '❌ Missing');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('FRONTEND_URLS:', process.env.FRONTEND_URLS);
console.log('---');

const app = express();
// Required for secure cookies behind proxies (Render, Vercel, etc.)
app.set('trust proxy', 1);

// CORS configuration: support a single FRONTEND_URL or comma-separated FRONTEND_URLS
const rawFrontendList = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = rawFrontendList.split(',').map(s => s.trim()).filter(Boolean);

console.log('✅ Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    console.log('🌐 Incoming request from origin:', origin);
    
    // Allow non-browser requests (no origin header) - e.g., Postman, curl
    if (!origin) {
      console.log('✅ Allowing request with no origin');
      return callback(null, true);
    }
    
    // Allow requests from whitelisted origins
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed:', origin);
      return callback(null, true);
    }
    
    // Reject requests from other origins
    console.log('❌ Origin rejected:', origin);
    console.log('Allowed origins are:', allowedOrigins);
    return callback(new Error(`CORS policy: origin ${origin} not allowed`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
}));

// Add explicit OPTIONS handler for preflight requests
app.options('*', cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware
app.use(
  session({
    secret: process.env.JWT_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 3600000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

// Start the server (async to allow dynamic passport import)
(async () => {
  try {
    console.log('Importing routes...');
    // Import routes with error handling
    const authRoutes = (await import('./routes/auth.js')).default;
    const householdRoutes = (await import('./routes/household.js')).default;
    const billRoutes = (await import('./routes/bills.js')).default;
    const expenseRoutes = (await import('./routes/expenses.js')).default;
    const contributionRoutes = (await import('./routes/contributions.js')).default;
    const notificationRoutes = (await import('./routes/notification.js')).default;
    const feedbackRoutes = (await import('./routes/feedback.js')).default;
    const adminRoutes = (await import('./routes/admin.js')).default;
    const contactRoutes = (await import('./routes/contact.js')).default;
    console.log('✅ Routes imported successfully');

    // Import passport after env vars are loaded
    console.log('Importing passport...');
    const passport = (await import('./config/passport.js')).default;
    console.log('✅ Passport imported successfully');

    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/household', householdRoutes);
    app.use('/api/bills', billRoutes);
    app.use('/api/expenses', expenseRoutes);
    app.use('/api/contributions', contributionRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/feedback', feedbackRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/contact', contactRoutes);

    // Health check endpoint
    app.get('/', (req, res) => {
      res.json({ 
        message: 'House Utility API is running',
        allowedOrigins: allowedOrigins,
        nodeEnv: process.env.NODE_ENV
      });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      if (err.message.includes('CORS policy')) {
        console.error('CORS Error:', err.message);
        return res.status(403).json({ 
          error: 'CORS Error', 
          message: err.message,
          requestOrigin: req.get('origin'),
          allowedOrigins: allowedOrigins
        });
      }
      console.error('Server Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

    // Start listening
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
})();
