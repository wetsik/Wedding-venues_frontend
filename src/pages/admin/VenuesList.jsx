"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, districts } from "../../services/api";

const VenuesList = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    district_id: "",
    status: "",
    sort_by: "",
    order: "asc",
  });

  useEffect(() => {
    fetchVenues();
    // eslint-disable-next-line
  }, [filters]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/admin/venues?${params}`);
      setVenues(response.data);
    } catch (error) {
      console.error("To'yxonalarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleConfirmVenue = async (venueId) => {
    try {
      await api.put(`/admin/venues/${venueId}/confirm`);
      fetchVenues();
      alert("To'yxona muvaffaqiyatli tasdiqlandi!");
    } catch (error) {
      alert(
        "Xatolik yuz berdi: " +
          (error.response?.data?.error || "Noma'lum xatolik")
      );
    }
  };

  const handleDeleteVenue = async (venueId) => {
    if (window.confirm("Haqiqatan ham bu to'yxonani o'chirmoqchimisiz?")) {
      try {
        await api.delete(`/admin/venues/${venueId}`);
        fetchVenues();
        alert("To'yxona muvaffaqiyatli o'chirildi!");
      } catch (error) {
        alert(
          "Xatolik yuz berdi: " +
            (error.response?.data?.error || "Noma'lum xatolik")
        );
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">To'yxonalar</h1>
          <Link
            to="/admin/venues/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Yangi To'yxona Qo'shish
          </Link>
        </div>

        {/* Filterlar */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="To'yxona nomini qidirish..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filters.district_id}
              onChange={(e) =>
                handleFilterChange("district_id", e.target.value)
              }
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Barcha rayonlar</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Barcha statuslar</option>
              <option value="confirmed">Tasdiqlangan</option>
              <option value="unconfirmed">Tasdiqlanmagan</option>
            </select>

            <select
              value={filters.sort_by}
              onChange={(e) => handleFilterChange("sort_by", e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tartiblash</option>
              <option value="price_per_seat">Narx bo'yicha</option>
              <option value="capacity">Sig'im bo'yicha</option>
            </select>

            <select
              value={filters.order}
              onChange={(e) => handleFilterChange("order", e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">O'sish tartibida</option>
              <option value="desc">Kamayish tartibida</option>
            </select>
          </div>
        </div>

        {/* To'yxonalar ro'yxati */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {venues.map((venue) => (
                <li key={venue.venue_id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-blue-600 truncate">
                            {venue.name}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                venue.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {venue.status === "confirmed"
                                ? "Tasdiqlangan"
                                : "Kutilayotgan"}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              📍 {venue.district_name} - {venue.address}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              👥 {venue.capacity} kishi | 💰{" "}
                              {venue.price_per_seat.toLocaleString()} so'm/kishi
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <p>📞 {venue.phone_number}</p>
                        </div>
                      </div>
                      <div className="ml-4 flex space-x-2">
                        <Link
                          to={`/admin/venues/${venue.venue_id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Ko'rish
                        </Link>
                        {venue.status === "unconfirmed" && (
                          <button
                            onClick={() => handleConfirmVenue(venue.venue_id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Tasdiqlash
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteVenue(venue.venue_id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          O'chirish
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {venues.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Hech qanday to'yxona topilmadi
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VenuesList;
