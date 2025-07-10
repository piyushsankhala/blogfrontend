import React, { useState, useEffect } from "react";
import { fetchWithRefresh } from "../utils/fetchwithrefresh";
import { useNavigate } from "react-router-dom";

export default function BlogList() {
  const [bloglist, setBloglist] = useState([]);
  const navigate = useNavigate();

  const fetchAllBlogs = async () => {
    try {
      const res = await fetchWithRefresh("http://localhost:5000/api/blog/getallblogs", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Sort by newest first
        const sorted = data.blogs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBloglist(sorted);
      } else {
        console.error("Fetch error:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
    const interval = setInterval(fetchAllBlogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const togglelikes = async (blogid) => {
    try {
      const res = await fetchWithRefresh("http://localhost:5000/api/blog/togglelike", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ blogid }),
      });

      const data = await res.json();

      if (res.ok) {
        fetchAllBlogs(); // Refresh blogs
      } else {
        console.log("Error:", data.message);
      }
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">Explore Blogs</h1>
        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm"
        >
          My Profile
        </button>
      </div>

      {/* Blog List */}
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
        {bloglist.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No blogs found.</p>
        ) : (
          bloglist.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
              {/* User Info */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <img
                  src={`https://api.dicebear.com/8.x/initials/svg?seed=${blog.user?.username || "U"}`}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    {blog.user?.username || "Unknown User"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {new Date(blog.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Blog Image */}
              {blog.image && (
                <img
                  src={blog.image}
                  alt="Blog"
                  className="w-full h-72 object-cover"
                />
              )}

              {/* Blog Content */}
              <div className="p-4">
                <p className="text-gray-800 text-sm mb-3">
                  {blog.content?.length > 200
                    ? blog.content.slice(0, 200) + "..."
                    : blog.content}
                </p>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => togglelikes(blog._id)}
                    className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
                  >
                    👍 {blog.likes?.length || 0}
                  </button>
                  <span className="text-xs text-gray-400">
                    {blog.likes?.length > 0
                      ? `${blog.likes.length} like${blog.likes.length > 1 ? "s" : ""}`
                      : "No likes yet"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
