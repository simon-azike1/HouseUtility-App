import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Navbar from './components/Navbar'; // 👈 NEW
import Landing from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing'; // 👈 NEW PAGE IMPORT

// Redirect authenticated users away from auth pages
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

// Wrapper to include Navbar on public pages
const WithNavbar = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WithNavbar><Landing /></WithNavbar>} />
      <Route path="/pricing" element={<WithNavbar><Pricing /></WithNavbar>} />

      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <WithNavbar><Login /></WithNavbar>
          </PublicRoute>
        } 
      />

      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <WithNavbar><Register /></WithNavbar>
          </PublicRoute>
        } 
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard /> {/* No navbar here */}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
