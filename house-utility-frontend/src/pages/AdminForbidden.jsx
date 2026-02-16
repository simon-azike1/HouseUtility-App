const AdminForbidden = ({ adminEmail, userEmail }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-md w-full rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">403 - Access Denied</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          You do not have permission to access the admin dashboard.
        </p>
        {null}
      </div>
    </div>
  );
};

export default AdminForbidden;
