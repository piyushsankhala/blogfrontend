import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Otp() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email] = useState(location.state?.email || "");
  const [password] = useState(location.state?.password || "");
  const [username] = useState(location.state?.username||"")
  const [otp, setOtp] = useState("");

  const verifyAndRegister = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Verify OTP
      const verifyRes = await fetch("https://blogbackend-3-l6mp.onrender.com/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });

      const verifyData = await verifyRes.json();
      console.log(verifyData)

      if (!verifyRes.ok) {
        return alert("❌ " + verifyData.message);
      }

      // Step 2: Register user
      const regRes = await fetch("https://blogbackend-3-l6mp.onrender.com/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password,username }),
      });

      const regData = await regRes.json();
      console.log(regData)

      if (regRes.status === 201) {
        alert("✅ Registration successful! You can now log in.");
        navigate("/login");
      } else {
        alert("❌ " + regData.error);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Enter OTP to Verify
        </h2>

        <form onSubmit={verifyAndRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}
