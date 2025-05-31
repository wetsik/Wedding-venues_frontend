"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, districts } from "../../services/api";

const AddOwnerVenue = () => {
  const [formData, setFormData] = useState({
    name: "",
    district_id: "",
    address: "",
    capacity: "",
    price_per_seat: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      await api.post("/owner/venues", {
        ...formData,
        capacity: Number.parseInt(formData.capacity),
        price_per_seat: Number.parseInt(formData.price_per_seat),
        district_id: Number.parseInt(formData.district_id),
      });

      alert(
        "To'yxona muvaffaqiyatli qo'shildi! Admin tomonidan tasdiqlanishini kuting."
      );
      navigate("/owner/venues");
    } catch (error) {
      setError(error.response?.data?.error || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Yangi To'yxona Qo'shish
        </h1>

        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                To'yxona nomi
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rayon
              </label>
              <select
                name="district_id"
                value={formData.district_id}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Rayonni tanlang</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Manzil
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sig'im (o'rindiqlar soni)
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                required
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Narx (1 o'rindiq uchun, so'm)
              </label>
              <input
                type="number"
                name="price_per_seat"
                value={formData.price_per_seat}
                onChange={handleInputChange}
                required
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefon raqam
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/owner/venues")}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            <strong>Eslatma:</strong> Qo'shilgan to'yxona admin tomonidan
            tasdiqlanishi kerak. Tasdiqlangandan so'ng foydalanuvchilar uni
            ko'rishlari va bron qilishlari mumkin bo'ladi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddOwnerVenue;
