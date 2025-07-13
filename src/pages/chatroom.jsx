import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWithRefresh } from '../utils/fetchwithrefresh';

export default function Chatroom() {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null); // will be set to string ID
  const { id: recieverId } = useParams();
  const messagesEndRef = useRef(null);

  const accessChat = async () => {
    try {
      const res = await fetchWithRefresh("https://blogbackend-3-l6mp.onrender.com/api/chat/acesschat", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recieverid: recieverId }),
      });
      const data = await res.json();
      if (res.ok) {
        setChat(data.data.messages);
        scrollToBottom();
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await fetchWithRefresh("https://blogbackend-3-l6mp.onrender.com/api/message/send", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message, recieverId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('');
        accessChat();
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetchWithRefresh("https://blogbackend-3-l6mp.onrender.com/api/user/currentuser", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.currentuserid);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
  };
  useEffect(() => {
    fetchCurrentUser(); // 🔑 get user first
  }, []);
  
  

  useEffect(() => {
    if (user) {
      accessChat(); // ⏳ only after user is set
      const interval = setInterval(() => accessChat(), 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col h-[90vh] border rounded-xl shadow bg-white">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Chatroom</h2>

      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto px-2 space-y-3">
        {!user ? (
          <p className="text-center text-gray-400 mt-10">Loading...</p>
        ) : chat.length > 0 ? (
          chat.map((msg) => {
            const isSender = msg.sender === user;
            return (
              <div key={msg._id} className="flex w-full">
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-xl text-sm mb-1 ${
                    isSender
                      ? "ml-auto bg-blue-600 text-white rounded-br-none"
                      : "mr-auto bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                  <div className="text-[10px] text-gray-400 text-right mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400 mt-10">No messages found.</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

