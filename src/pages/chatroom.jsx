import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWithRefresh } from '../utils/fetchwithrefresh';

export default function Chatroom() {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
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
        setChat(Array.isArray(data.messages) ? data.messages : []);
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

  useEffect(() => {
    accessChat();
    // optionally: polling or sockets
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col h-[90vh] border rounded-xl shadow bg-white">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Chatroom</h2>

      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto px-2 space-y-3">
        { chat.length > 0 ? (
          chat.map((msg) => (
            <div
              key={msg._id}
              className={`max-w-[75%] px-4 py-2 rounded-xl text-sm ${
                msg.isSender
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-100 text-gray-900 self-start mr-auto"
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
          ))
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
          onKeyPress={handleKeyPress}
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
