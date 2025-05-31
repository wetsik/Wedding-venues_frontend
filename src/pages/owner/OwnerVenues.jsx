"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

const OwnerVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sort_by: "",
    order: "desc",
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

      // Owner'ning o'z endpoint'idan foydalanish
      const response = await api.get(`/owner/venues?${params}`);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Mening To'yxonalarim
          </h1>
          <Link
            to="/owner/venues/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Yangi To'yxona Qo'shish
          </Link>
        </div>

        {/* Filterlar */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="To'yxona nomini qidirish..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

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
              <option value="created_at">Yaratilgan vaqt</option>
              <option value="price_per_seat">Narx bo'yicha</option>
              <option value="capacity">Sig'im bo'yicha</option>
            </select>

            <select
              value={filters.order}
              onChange={(e) => handleFilterChange("order", e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Yangi birinchi</option>
              <option value="asc">Eski birinchi</option>
            </select>
          </div>
        </div>

        {venues.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg mb-4">
              Sizda hali to'yxonalar yo'q
            </p>
            <Link
              to="/owner/venues/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Birinchi To'yxonani Qo'shish
            </Link>
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
                                : "Tasdiq kutilmoqda"}
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
                              {venue.price_per_seat?.toLocaleString()}{" "}
                              so'm/kishi
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <p>📞 {venue.phone_number}</p>
                          <span className="mx-2">•</span>
                          <p>
                            📅{" "}
                            {new Date(venue.created_at).toLocaleDateString(
                              "uz-UZ"
                            )}
                          </p>
                        </div>
                        {venue.status === "unconfirmed" && (
                          <div className="mt-2">
                            <p className="text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                              ⏳ Admin tomonidan tasdiqlanishini kutmoqda
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex space-x-2">
                        <Link
                          to={`/owner/venues/${venue.venue_id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Ko'rish
                        </Link>
                        {venue.status === "confirmed" && (
                          <Link
                            to={`/owner/venues/${venue.venue_id}/edit`}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Tahrirlash
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerVenues;
