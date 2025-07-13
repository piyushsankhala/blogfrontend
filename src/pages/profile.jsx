import React, { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchwithrefresh";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const getBlogsOfExistingUser = async () => {
    try {
      const res = await fetchWithRefresh(
        "https://blogbackend-3-l6mp.onrender.com/api/blog/getblogofexistinguser",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setBlogs(data.blogs);
        if (data.blogs.length > 0 && data.blogs[0].user?.username) {
          setUsername(data.blogs[0].user.username);
        }
      } else {
        console.error("Error fetching blogs:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await fetchWithRefresh(
        "https://blogbackend-3-l6mp.onrender.com/api/chat/unreadcount",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setUnreadCount(data.unreadChatCount || 0);
      } else {
        console.error("Unread count error:", data.message);
      }
    } catch (err) {
      console.error("Unread count fetch error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(
        "https://blogbackend-3-l6mp.onrender.com/api/user/logout",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (res.ok) {
        navigate("/login");
      } else {
        const data = await res.json();
        console.error("Logout failed:", data.message);
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    getBlogsOfExistingUser();
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      {/* 🔷 Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between max-w-4xl mx-auto gap-4 mb-8">
        <div className="flex items-center gap-4">
          <img
            src={`https://api.dicebear.com/8.x/initials/svg?seed=${username || "U"}`}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {username ? `${username}'s Profile` : "Your Profile"}
            </h1>
            <p className="text-sm text-gray-600">{blogs.length} posts</p>
          </div>
        </div>

        {/* 🔘 Action Buttons */}
        <div className="flex flex-wrap gap-2 relative">
          <button
            onClick={() => navigate("/upload")}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm"
          >
            ➕ Create Post
          </button>
          <button
            onClick={() => navigate("/bloglist")}
            className="bg-green-600 text-white px-4 py-2 round
