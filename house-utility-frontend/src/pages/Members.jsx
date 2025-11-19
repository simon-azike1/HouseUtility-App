// src/pages/Members.jsx
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "/services/api"; // your axios instance (baseURL = /api)
import { Crown, User } from "lucide-react";

export default function Members() {
  const { user: currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Try household members endpoint first, fallback to auth/users
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1) Try household members (preferred)
      const res = await api.get("/household/members");
      // If backend returns array directly or inside .data, handle both
      const membersData = Array.isArray(res.data) ? res.data : res.data.members || res.data.data || res.data;
      setMembers(mapMembers(membersData));
      setLoading(false);
      return;
    } catch (err) {
      // If the household endpoint isn't available or returns 404, try fallback
      if (err.response && err.response.status !== 404) {
        // If it's an auth/permission error let the user know
        if (err.response.status === 401) {
          setError("Unauthorized. Please login again.");
          setLoading(false);
          return;
        }
      }
      // fallback to /auth/users
      try {
        const res2 = await api.get("/auth/users");
        const membersData = res2.data.users || res2.data || [];
        setMembers(mapMembers(membersData));
      } catch (err2) {
        console.error("Both household and auth/users endpoints failed:", err, err2);
        setError("Failed to load members. Check backend routes.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Normalize different backend shapes into a consistent member object:
  // { _id, name, email, role, imageUrl, joinedAt, userId }
  const mapMembers = (raw) => {
    return raw.map((m) => {
      // Cases:
      // - household.members returns entries like { user: { _id, name, email }, role, joinedAt, _id }
      // - auth/users returns { _id, name, email, role, imageUrl, createdAt }
      if (m.user) {
        return {
          _id: m._id || (m.user && m.user._id) || m.userId,
          name: m.user.name || m.name || "Unnamed Member",
          email: m.user.email || m.email || "",
          role: m.role || (m.user.role || "member"),
          imageUrl: m.user.imageUrl || m.imageUrl || null,
          joinedAt: m.joinedAt || m.user.joinedAt || m.createdAt || null,
          userId: m.user._id || m.userId || m._id,
        };
      }

      // plain user object
      return {
        _id: m._id,
        name: m.name || "Unnamed Member",
        email: m.email || "",
        role: m.role || "member",
        imageUrl: m.imageUrl || null,
        joinedAt: m.joinedAt || m.createdAt || null,
        userId: m._id,
      };
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 text-lg animate-pulse">Loading members...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 bg-gradient-to-br from-indigo-50 to-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-indigo-700">Household Members</h2>
              <p className="text-sm text-gray-500 mt-1">
                {members.length} member{members.length !== 1 ? "s" : ""} in this household
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {members.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No members found</p>
              <p className="text-sm text-gray-400">Once users join the household they'll appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => {
                const isMe = currentUser && (currentUser.id === member.userId || currentUser._id === member.userId);
                return (
                  <div
                    key={member._id || member.userId}
                    className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center group"
                  >
                    {/* status dot (placeholder) */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          // keep deterministic "online" by hashing userId (simple)
                          hashString(member.userId || member._id) % 2 === 0 ? "bg-green-500" : "bg-gray-400"
                        }`}
                        title={
                          hashString(member.userId || member._id) % 2 === 0 ? "Online" : "Offline"
                        }
                      />
                    </div>

                    {/* avatar */}
                    <div className="relative">
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover border-4 border-indigo-50 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex justify-center items-center text-indigo-700 font-bold text-xl border-4 border-indigo-50">
                          {member.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}

                      <span className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow">
                        {member.role === "owner" ? (
                          <Crown size={16} className="text-yellow-500" />
                        ) : (
                          <User size={16} className="text-gray-500" />
                        )}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                      {member.name || "Unnamed Member"}
                    </h3>
                    <p className="text-sm text-gray-500">{member.email}</p>

                    <span
                      className={`mt-3 text-xs px-4 py-1 rounded-full font-medium ${
                        member.role === "owner" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {member.role ? member.role.toUpperCase() : "MEMBER"}
                    </span>

                    {isMe && (
                      <div className="mt-3 text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full inline-block">
                        You
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// small deterministic hash for status dot (so it doesn't flip all the time)
function hashString(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
