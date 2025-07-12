import React, { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchwithrefresh";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const getBlogsOfExistingUser = async () => {
    try {
      const res = await fetchWithRefresh(
        "https://blogbackend-3-l6mp.onrender.com/api/blog/getblogofexistinguser",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      {/* 📌 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between max-w-3xl mx-auto gap-4 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={`https://api.dicebear.com/8.x/initials/svg?seed=${username || "U"}`}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            {username ? username : "Your"}'s Profile
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/upload")}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm"
          >
            ➕ Create Post
          </button>
          <button
            onClick={() => navigate("/bloglist")}
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition text-sm"
          >
            📄 View All Blogs
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition text-sm"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* 📝 Blog List */}
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No blogs found.</p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
            >
              {/* Blog Header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <img
                  src={`https://api.dicebear.com/8.x/initials/svg?seed=${username || "U"}`}
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">
                    {username || "Unknown"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {new Date(blog.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Blog Image */}
              {blog.image && (
                <div className="w-full bg-black flex justify-center items-center">
                  <img
                    src={blog.image}
                    alt="Blog"
                    className="w-full max-h-[500px] object-contain"
                  />
                </div>
              )}

              {/* Content and Likes */}
              <div className="px-4 py-3 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <span className="text-xl">❤️</span>
                  {blog.likes.length} like{blog.likes.length !== 1 ? "s" : ""}
                </div>

                <p className="text-sm text-gray-800 leading-relaxed">
                  {blog.content?.length > 250
                    ? blog.content.slice(0, 250) + "..."
                    : blog.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
