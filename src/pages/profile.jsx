import React, { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchwithrefresh";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const getBlogsOfExistingUser = async () => {
    try {
      const res = await fetchWithRefresh("https://blogbackend-3-l6mp.onrender.com/api/blog/getblogofexistinguser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

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

  useEffect(() => {
    getBlogsOfExistingUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 max-w-3xl mx-auto">
      {/* 📌 Header */}
      <div className="flex items-center justify-between mb-8">
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

        <button
          onClick={() => navigate("/upload")}
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
        >
          ➕ Create Post
        </button>
      </div>

      {/* 📝 Blog List */}
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow-md p-4 overflow-hidden"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt="blog"
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
              )}

              <p className="text-gray-800 text-sm mb-2">{blog.content}</p>

              <div className="text-blue-600 font-medium text-sm flex items-center gap-2">
                <span className="text-xl">👍</span> {blog.likes.length} likes
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
