import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithRefresh } from "../utils/fetchwithrefresh";

export default function EditBlog() {
  const { id: blogid } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("blogid", blogid);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      const res = await fetchWithRefresh(
        "https://blogbackend-3-l6mp.onrender.com/api/blog/editpost",
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        navigate("/profile");
      } else {
        setError(data.message);
        console.error(data.err)
      }
    } catch (err) {
      setError("Error updating blog");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">✏️ Edit Blog</h1>

        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleUpdate} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🖼 Upload New Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mt-2 rounded max-h-48 mx-auto"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📝 Blog Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your updated blog content..."
              required
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              ✅ Update Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
