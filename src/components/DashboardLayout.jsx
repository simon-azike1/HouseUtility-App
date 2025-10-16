"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  DollarSign,
  Receipt,
  FileText,
  BarChart3,
  Home,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react"

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Contributions", path: "/contributions", icon: DollarSign, badge: "Soon" },
    { name: "Expenses", path: "/expenses", icon: Receipt, badge: "Soon" },
    { name: "Bills", path: "/bills", icon: FileText, badge: "Soon" },
    { name: "Reports", path: "/reports", icon: BarChart3, badge: "Soon" },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex h-screen bg-gray-50">
      <motion.aside
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="min-w-0"
                >
                  <h1 className="text-base font-bold text-gray-900 truncate">House Utility</h1>
                  <p className="text-xs text-gray-500 truncate">Management</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 mt-2 px-3 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg font-medium transition-all group relative ${
                  active ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${active ? "text-white" : "text-gray-600 group-hover:text-blue-600"}`}
                />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 truncate"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge && sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      active ? "bg-white/20 text-white" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.badge}
                  </motion.span>
                )}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all font-medium group ${
              !sidebarOpen ? "justify-center" : ""
            }`}
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      <motion.div
        animate={{ marginLeft: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 flex flex-col min-w-0"
      >
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 h-16">
            <h2 className="text-xl font-bold text-gray-900">
              {navigation.find((item) => isActive(item.path))?.name || "Dashboard"}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">{children}</main>
      </motion.div>
    </div>
  )
}

export default DashboardLayout
