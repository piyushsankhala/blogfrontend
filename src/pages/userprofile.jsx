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
          setUsername(data.blogs[0].user.username);
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
      {/* Profile Header */}
      <div className="flex items-center mb-8">
        <div className="w-24 h-24 bg-gray-300 rounded-full mr-6" />
        <div>
          <h2 className="text-2xl font-bold">{username || "User"}</h2>
          <p className="text-gray-600">{blogs.length} Posts</p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
            {blog.image ? (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <div className="p-3 flex flex-col gap-1">
              <h3 className="font-semibold text-sm text-gray-800">
                {blog.title || "Untitled Post"}
              </h3>
              <p className="text-xs text-gray-600">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {blog.content?.length > 100
                  ? blog.content.slice(0, 100) + "..."
                  : blog.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
