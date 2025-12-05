import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PreferencesProvider } from './context/PreferencesContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import VerifySuccess from './pages/VerifySuccess';
import Dashboard from './pages/Dashboard';
import Contributions from './pages/Contributions';
import Expenses from './pages/Expenses';
import Pricing from './pages/Pricing';
import Bills from './pages/Bills';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Members from './pages/Members';
import Services from './pages/Services';
import Contact from './pages/Contact';
import OurStory from './pages/OurStory';
import Team from './pages/Team';
// import Blog from './pages/Blog';
import Help from './pages/Help';
import AccountSettings from './pages/AccountSettings';
import PrivacySecurity from './pages/PrivacySecurity';
import LegalPrivacy from './pages/LegalPrivacy';
import LegalTerms from './pages/LegalTerms';
import LegalCookies from './pages/LegalCookies';

// Redirect authenticated users away from auth pages
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/our-story" element={<OurStory />} />
      <Route path="/team" element={<Team />} />
      {/* <Route path="/blog" element={<Blog />} /> */}

      {/* Legal Pages */}
      <Route path="/privacy" element={<LegalPrivacy />} />
      <Route path="/terms" element={<LegalTerms />} />
      <Route path="/cookies" element={<LegalCookies />} />
    
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* ✅ Email Verification Routes */}
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/verify-success" element={<VerifySuccess />} />

      {/* Protected Pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <Members />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/contributions"
        element={
          <ProtectedRoute>
            <Contributions />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/bills"
        element={
          <ProtectedRoute>
            <Bills />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        }
      />

      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountSettings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/privacy"
        element={
          <ProtectedRoute>
            <PrivacySecurity />
          </ProtectedRoute>
        }
      />

      {/* 404 Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <PreferencesProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </PreferencesProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;