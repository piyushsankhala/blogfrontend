import React, { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchwithrefresh";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const navigate = useNavigate();
  const getuser = async()=>{
      const res = await fetchWithRefresh("https://blogbackend-3-l6mp.onrender.com/api/user/getuser",{
        method:"POST",
        headers:{"Content-Type" : "application/json"},
        body :JSON.stringify({userid}),
      })
    
      const data = await res.json()
      if(res.ok){
        setUsername(data.user.username)
      }
      else{
        alert("User not found")
      }
    }
    useEffect(()=>{getuser()},[])
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
        "https://blogbackend-3-l6mp.onrender.com/api/user/unreadcount",
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

  const handleDelete = async (blogid) => {
    const confirmed = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmed) return;

    try {
      const res = await fetchWithRefresh(
        "https://blogbackend-3-l6mp.onrender.com/api/blog/deletepost",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ blogid }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b._id !== blogid));
      } else {
        console.error("Delete error:", data.message);
      }
    } catch (error) {
      console.error("Delete fetch error:", error);
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
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition text-sm"
          >
            📄 View All Blogs
          </button>
          <button
            onClick={() => navigate("/userchatlist")}
            className="relative bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition text-sm"
          >
            💬 Messages
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition text-sm"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* 📝 Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {blogs.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-lg">
            No blogs found.
          </p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-lg shadow border border-gray-200 relative overflow-visible flex flex-col cursor-pointer hover:shadow-md transition"
            >
              {/* Blog Image */}
              {blog.image ? (
                <img
                  src={blog.image}
                  alt="Blog"
                  className="w-full object-contain bg-black"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              {/* ⋮ Button */}
              <button
                onClick={() =>
                  setMenuOpenId((prev) => (prev === blog._id ? null : blog._id))
                }
                className="absolute top-2 right-2 bg-white text-gray-700 hover:text-black hover:bg-gray-100 p-1.5 rounded-full z-50 shadow-sm"
              >
                <span className="text-xl leading-none">⋮</span>
              </button>

              {/* Dropdown Menu */}
              {menuOpenId === blog._id && (
                <div className="absolute top-12 right-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 transition-all duration-200 ease-out">
                  <button
                    onClick={() => {
                      navigate(`/editblog/${blog._id}`);
                      setMenuOpenId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(blog._id);
                      setMenuOpenId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              )}

              {/* Blog Info */}
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <span className="text-xl">❤️</span>
                  {blog.likes.length} like{blog.likes.length !== 1 ? "s" : ""}
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(blog.createdAt).toLocaleString()}
                </p>
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
