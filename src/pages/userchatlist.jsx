import React, { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchwithrefresh";
import { useNavigate } from "react-router-dom";

export default function UserChatList() {
  const [userlist, setUserlist] = useState([]);
  const navigate = useNavigate();

  const fetchUserList = async () => {
    try {
      const res = await fetchWithRefresh("https://blogbackend-3-l6mp.onrender.com/api/user/getchatusers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setUserlist(data.validUsers);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error fetching chat users:", err);
    }
  };
  

  useEffect(() => {
    fetchUserList();
    const interval = setInterval(() => 
      fetchUserList(),2000)
     return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">💬 Chats</h1>
        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm"
        >
          My Profile
        </button>
      </div>

      {/* User List */}
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
        {userlist.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No chat users found.</p>
        ) : (
          userlist.map((user) => (
            <div
              key={user._id}
              onClick={() => navigate(`/chatroom/${user._id}`)}
              className="flex items-center gap-4 bg-white shadow-sm rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="relative">
                <img
                  src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.username}`}
                  alt="User"
                  className="w-12 h-12 rounded-full"
                />
                {user.messageindicator && (
                  <span className="absolute top-0 right-0 block w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  {user.username}
                  {user.messageindicator && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-500">Tap to chat</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
