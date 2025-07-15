import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchWithRefresh } from "./utils/fetchwithrefresh";

import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import BlogList from "./pages/bloglist.jsx";
import Profile from "./pages/profile.jsx";
import UploadPost from "./pages/upload.jsx";
import Otp from "./pages/otp.jsx";
import UserProfile from "./pages/userprofile.jsx";
import UserChatList from "./pages/userchatlist.jsx";
import Chatroom from "./pages/chatroom.jsx";
import EditBlog from "./pages/editblog.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetchWithRefresh("https://blogbackend-3-l6mp.onrender.com/api/user/currentuser", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.currentuserid);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  if (loading) return <div className="text-center mt-20 text-lg">Loading...</div>;

  return (
    <Routes>
      {/* Conditionally redirect root based on auth status */}
      <Route
        path="/"
        element={<Navigate to={user ? "/bloglist" : "/login"} replace />}
      />

      {/* Public Routes (pass setUser if needed) */}
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<Otp/>} />

      {/* Protected Routes */}
      <Route
        path="/bloglist"
        element={user ? <BlogList /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/upload"
        element={user ? <UploadPost /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/userprofile/:id"
        element={user ? <UserProfile/>: <Navigate to="/login" replace />}
      />
      <Route
        path="/userchatlist"
        element={user ? <UserChatList/>: <Navigate to="/login" replace />}
      />
       <Route
        path="/chatroom/:id"
        element={user ? <Chatroom/>: <Navigate to="/login" replace />}
      />
      <Route
        path="/editblog/:id"
        element={user ? <EditBlog/>: <Navigate to="/login" replace />}
      />
    </Routes>
  );
}
