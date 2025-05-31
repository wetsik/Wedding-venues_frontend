"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [activeTab, setActiveTab] = useState("user");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (showRegister) {
        if (activeTab === "admin") {
          setError("Admin ro'yxatdan o'ta olmaydi");
          setLoading(false);
          return;
        }

        const result = await register(formData, activeTab);
        if (result.success) {
          setShowRegister(false);
          setFormData({});
          alert("Muvaffaqiyatli ro'yxatdan o'tdingiz! Endi login qiling.");
        } else {
          setError(result.error);
        }
      } else {
        const result = await login(formData, activeTab);
        if (result.success) {
          navigate(`/${activeTab}`);
        } else {
          setError(result.error);
        }
      }
    } catch {
      setError("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (showRegister) {
      switch (activeTab) {
        case "admin":
          // Bu qismni butunlay o'chirish kerak:
          return null; // Admin register yo'q

        case "owner":
          return (
            <>
              <input
                type="text"
                name="first_name"
                placeholder="Ism"
                value={formData.first_name || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Familiya"
                value={formData.last_name || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Parol"
                value={formData.password || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="card_number"
                placeholder="Karta raqami (8600 1234 5678 9012)"
                value={formData.card_number || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </>
          );
        case "user":
          return (
            <>
              <input
                type="text"
                name="first_name"
                placeholder="Ism"
                value={formData.first_name || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Familiya"
                value={formData.last_name || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                name="phone_number"
                placeholder="Telefon raqam"
                value={formData.phone_number || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </>
          );
      }
    } else {
      // Login form
      switch (activeTab) {
        case "admin":
        case "owner":
          return (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Parol"
                value={formData.password || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </>
          );
        case "user":
          return (
            <input
              type="tel"
              name="phone_number"
              placeholder="Telefon raqam"
              value={formData.phone_number || ""}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          );
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            To'yxona Bron Tizimi
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {showRegister ? "Ro'yxatdan o'tish" : "Tizimga kirish"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
          {[
            { key: "user", label: "Foydalanuvchi" },
            { key: "owner", label: "To'yxona egasi" },
            { key: "admin", label: "Admin" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setFormData({});
                setError("");
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">{renderForm()}</div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading
                ? "Yuklanmoqda..."
                : showRegister
                ? "Ro'yxatdan o'tish"
                : "Kirish"}
            </button>
          </div>

          <div className="text-center">
            {activeTab !== "admin" && (
              <button
                type="button"
                onClick={() => {
                  setShowRegister(!showRegister);
                  setFormData({});
                  setError("");
                }}
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                {showRegister
                  ? "Allaqachon hisobingiz bormi? Kirish"
                  : "Hisobingiz yo'qmi? Ro'yxatdan o'tish"}
              </button>
            )}
            {activeTab === "admin" && showRegister && (
              <p className="text-red-600 text-sm">
                Admin hisobi yaratish mumkin emas. Mavjud admin hisobingiz bilan
                kiring.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
