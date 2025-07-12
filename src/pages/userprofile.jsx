import React, { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchwithrefresh";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const { id: userid } = useParams();
  const [username, setUsername] = useState("");
  const [blogs, setBlogs] = useState([]);

  const getBlogOfUser = async () => {
    try {
      const res = await fetchWithRefresh("https://blogbackend-3-l6mp.onrender.com/api/blog/blogofuser", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid }),
      });

      const data = await res.json();

      if (res.ok) {
        setBlogs(data.blogs);
        if (data.blogs.length > 0) {
          setUsername(data.blogs[0].user.username); // Assuming populated user object
        }
      } else {
        console.error("Error fetching user blogs:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    getBlogOfUser();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="w-24 h-24 bg-gray-300 rounded-full mr-6" />
        <div>
          <h2 className="text-2xl font-bold">{username || "User"}</h2>
          <p className="text-gray-600">{blogs.length} Posts</p>
        </div>
      </div>

      {/* Grid of blogs */}
      <div className="grid grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <div key={blog._id} className="relative group">
            {blog.image ? (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-white text-sm font-semibold">
              {blog.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
