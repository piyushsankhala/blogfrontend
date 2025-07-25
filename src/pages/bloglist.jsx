import React, { useState, useEffect, useRef } from "react";
import { fetchWithRefresh } from "../utils/fetchwithrefresh";
import { useNavigate } from "react-router-dom";

export default function BlogList() {
  const [bloglist, setBloglist] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [User, setUser] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [likedUsers, setLikedUsers] = useState([]);
  const [likesid, setLikesid] = useState(null)
  const searchBoxRef = useRef();
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
    } catch (error) {
      console.error("Unread count fetch error:", error);
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

  const fetchCurrentUser = async () => {
    try {
      const res = await fetchWithRefresh(
        "https://blogbackend-3-l6mp.onrender.com/api/user/currentuser",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUser(data.currentuserid);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetchWithRefresh(
        "https://blogbackend-3-l6mp.onrender.com/api/user/allusers",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setAllUsers(data.users || []);
      } else {
        console.error("User fetch error:", data.message);
      }
    } catch (err) {
      console.error("Failed to fetch all users:", err);
    }
  };

  const getsearchusers = () => {
    const searchusers = allUsers.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(searchusers);
  };

  

  useEffect(() => {
    fetchAllBlogs();
    fetchUnreadCount();
    fetchCurrentUser();

    const interval = setInterval(() => {
      fetchAllBlogs();
      fetchUnreadCount();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => getsearchusers(), [searchQuery]);

  useEffect(() => {
    fetchAllUsers();
    const interval = setInterval(fetchAllUsers, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setFilteredUsers([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 max-w-3xl mx-auto gap-2 relative">
        <h1 className="text-3xl font-bold text-gray-800">📸 InstaBlog</h1>

        {/* Search Input */}
        <div className="relative w-full sm:w-64" ref={searchBoxRef}>
          <input
            type="text"
            placeholder="Search user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && filteredUsers.length > 0 && (
            <ul className="absolute z-10 top-full left-0 right-0 bg-white shadow-md border rounded-lg mt-1 max-h-48 overflow-y-auto">
              {filteredUsers.map((user) => (
                <li
                  key={user._id}
                  onClick={() => {
                    navigate(
                      user._id === User
                        ? "/profile"
                        : `/userprofile/${user._id}`
                    );
                    setSearchQuery("");
                    setFilteredUsers([]);
                  }}
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  <img
                    src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.username}`}
                    alt="User Avatar"
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{user.username}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigate("/userchatlist")}
            className="relative bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition text-sm"
          >
            💬 Messages
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
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
                  onClick={() =>
                    blog.user._id === User
                      ? navigate("/profile")
                      : navigate(`/userprofile/${blog.user._id}`)
                  }
                />
                <div>
                  <h3
                    onClick={() =>
                      blog.user._id === User
                        ? navigate("/profile")
                        : navigate(`/userprofile/${blog.user._id}`)
                    }
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
                  <span
                    className="text-sm text-gray-700 cursor-pointer hover:underline"
                    onClick={()=>setLikesid((prev)=>(prev ===blog._id?null:blog._id))}
                  >
                    {blog.likes?.length || 0} like
                    {blog.likes?.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {likesid===blog._id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-80 max-h-[80vh] rounded-xl shadow-lg p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Liked by</h2>
              <button
                onClick={()=>{setLikesid(null)}}
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                ×
              </button>
            </div>
            {blog.likes.length === 0 ? (
              <p className="text-sm text-gray-500">No likes yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {blog.likes.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md"
                    onClick={() => {
                      setLikesid(null)
                      navigate(
                        user._id === User ? "/profile" : `/userprofile/${user._id}`
                      );
                    }}
                  >
                    <img
                      src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.username}`}
                      alt="Avatar"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-800">{user.username}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

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

      {/* Likes Modal */}
      
    </div>
  );
}
