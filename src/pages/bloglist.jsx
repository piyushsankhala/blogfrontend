import React, { useState, useEffect } from "react";
import { fetchWithRefresh } from "../utils/fetchwithrefresh";
import { useNavigate } from "react-router-dom";

export default function BlogList() {
  const [bloglist, setBloglist] = useState([]);
  const navigate = useNavigate();

  const fetchAllBlogs = async () => {
    try {
      const res = await fetchWithRefresh(
        "https://blogbackend-3-l6mp.onrender.com/api/blog/getallblogs",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setBloglist(data.blogs);
      } else {
        console.error("Fetch error:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const togglelikes = async (blogid) => {
    try {
      const res = await fetchWithRefresh(
        "https://blogbackend-3-l6mp.onrender.com/api/blog/togglelike",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ blogid }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setBloglist((prev) =>
          prev.map((blog) =>
            blog._id === data.updatedBlog._id ? data.updatedBlog : blog
          )
        );
      } else {
        console.log("Error:", data.message);
      }
    } catch (error) {
      console.error("Toggle error:", error);
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
    fetchAllBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 max-w-3xl mx-auto gap-2">
        <h1 className="text-3xl font-bold text-gray-800">📸 InstaBlog</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/chatuserlist")}
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition text-sm"
          >
            💬 Messages
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm"
          >
            My Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition text-sm"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Blog List */}
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
        {bloglist.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No blogs found.</p>
        ) : (
          bloglist.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <img
                  src={`https://api.dicebear.com/8.x/initials/svg?seed=${blog.user?.username || "U"}`}
                  alt="User"
                  className="w-10 h-10 rounded-full cursor-pointer hover:underline"
                  onClick={() => {
                    navigate(`/userprofile/${blog.user._id}`);
                  }}
                />
                <div>
                  <h3
                    onClick={() => {
                      navigate(`/userprofile/${blog.user._id}`);
                    }}
                    className="cursor-pointer hover:underline font-semibold text-sm text-gray-900"
                  >
                    {blog.user?.username || "Unknown"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {new Date(blog.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Image */}
              {blog.image && (
                <div className="w-full bg-black flex justify-center items-center">
                  <img
                    src={blog.image}
                    alt="Blog"
                    className="w-full max-h-[500px] object-contain"
                  />
                </div>
              )}

              {/* Content */}
              <div className="px-4 py-3 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglelikes(blog._id)}
                    className="text-xl hover:text-red-500 transition"
                    title="Like"
                  >
                    ❤️
                  </button>
                  <span className="text-sm text-gray-700">
                    {blog.likes?.length || 0} like
                    {blog.likes?.length !== 1 ? "s" : ""}
                  </span>
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
