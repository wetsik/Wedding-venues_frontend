"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, districts } from "../../services/api";

const UserVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    district_id: "",
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

      const response = await api.get(`/user/venues?${params}`);
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

  const getVenueStatusBadge = (venue) => {
    switch (venue.venue_status) {
      case "active":
        return { text: "Mavjud", color: "bg-green-100 text-green-800" };
      case "user_booked":
        return { text: "Sizda bron bor", color: "bg-blue-100 text-blue-800" };
      case "inactive":
        return {
          text: "Vaqtincha mavjud emas",
          color: "bg-yellow-100 text-yellow-800",
        };
      default:
        return { text: "Noma'lum", color: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">To'yxonalar</h1>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => {
              const statusBadge = getVenueStatusBadge(venue);
              const canBook = venue.venue_status === "active";

              return (
                <div
                  key={venue.venue_id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {venue.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}
                      >
                        {statusBadge.text}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        📍 {venue.district_name} - {venue.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        👥 Sig'im: {venue.capacity} kishi
                      </p>
                      <p className="text-sm text-gray-600">
                        💰 Narx: {venue.price_per_seat.toLocaleString()}{" "}
                        so'm/kishi
                      </p>
                      <p className="text-sm text-gray-600">
                        📞 {venue.phone_number}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold text-blue-600">
                        Jami:{" "}
                        {(
                          venue.capacity * venue.price_per_seat
                        ).toLocaleString()}{" "}
                        so'm
                      </div>
                      {canBook ? (
                        <Link
                          to={`/user/venues/${venue.venue_id}/book`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                          Bron qilish
                        </Link>
                      ) : venue.venue_status === "user_booked" ? (
                        <span className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed">
                          Yangi bron mumkin emas
                        </span>
                      ) : (
                        <span className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed">
                          Mavjud emas
                        </span>
                      )}
                    </div>

                    {venue.venue_status === "user_booked" && (
                      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                        ℹ️ Sizda bu to'yxonada mavjud bron bor. To'yxona
                        egasining obunasi tugaganligi sababli yangi bron qilish
                        mumkin emas.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {venues.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            Hech qanday to'yxona topilmadi
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVenues;
