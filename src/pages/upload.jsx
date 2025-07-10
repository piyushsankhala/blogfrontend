import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithRefresh } from "../utils/fetchwithrefresh";

export default function UploadPost() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [uploadedPost, setUploadedPost] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const res = await fetchWithRefresh("https://blogbackend-3-l6mp.onrender.com/api/blog/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setUploadedPost(data.blog); 
        console.log(uploadedPost)// <-- Show this below
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 flex flex-col items-center">
      {!uploadedPost ? (
        <form
          onSubmit={handleUpload}
          className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Create New Post
          </h2>

          <textarea
            placeholder="Write a caption..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Upload
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mt-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Post Uploaded 🎉</h2>

          {uploadedPost.image && (
            <img
              src={uploadedPost.image}
              alt="Uploaded"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}

          <p className="text-gray-800 text-sm mb-2">{uploadedPost.content}</p>

          <div className="text-blue-600 font-medium text-sm flex items-center gap-2 mb-4">
            <span className="text-lg">👍</span> {uploadedPost.likes?.length || 0} likes
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Go to Profile
          </button>
        </div>
      )}
    </div>
  );
}
