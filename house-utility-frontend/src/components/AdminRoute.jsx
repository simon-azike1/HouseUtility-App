import { useAuth } from '../context/AuthContext';
import AdminForbidden from '../pages/AdminForbidden';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const normalizeEmail = (value) =>
    (value || '').toLowerCase().trim().replace(/^['"`]|['"`]$/g, '');
  const adminEmail = normalizeEmail(import.meta.env.VITE_ADMIN_EMAIL);
  const isAdminEmail = normalizeEmail(user?.email) === adminEmail;

  if (!isAdminEmail) {
    return <AdminForbidden adminEmail={adminEmail} userEmail={user?.email} />;
  }

  return children;
};

export default AdminRoute;
