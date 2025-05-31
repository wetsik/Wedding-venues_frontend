"use client";

import { useState, useEffect } from "react";
import { api, districts } from "../../services/api";

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date: "",
    venue_id: "",
    district_id: "",
    status: "",
    sort_by: "",
  });

  useEffect(() => {
    fetchBookings();
    fetchVenues();
// eslint-disable-next-line
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/admin/bookings?${params}`);
      setBookings(response.data);
    } catch (error) {
      console.error("Bronlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await api.get("/admin/venues");
      setVenues(response.data);
    } catch (error) {
      console.error("To'yxonalarni yuklashda xatolik:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Haqiqatan ham bu bronni bekor qilmoqchimisiz?")) {
      try {
        await api.delete(`/admin/bookings/${bookingId}`);
        fetchBookings();
        alert("Bron muvaffaqiyatli bekor qilindi!");
      } catch (error) {
        alert(
          "Xatolik yuz berdi: " +
            (error.response?.data?.error || "Noma'lum xatolik")
        );
      }
    }
  };

  const getStatusText = (booking) => {
    const bookingDate = new Date(booking.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return { text: "Bo'lib o'tgan", color: "bg-gray-100 text-gray-800" };
    } else {
      return { text: "Endi bo'ladigan", color: "bg-green-100 text-green-800" };
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Barcha Bronlar
        </h1>

        {/* Filterlar */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filters.venue_id}
              onChange={(e) => handleFilterChange("venue_id", e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Barcha to'yxonalar</option>
              {venues.map((venue) => (
                <option key={venue.venue_id} value={venue.venue_id}>
                  {venue.name}
                </option>
              ))}
            </select>

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
              <option value="upcoming">Endi bo'ladigan</option>
              <option value="past">Bo'lib o'tgan</option>
            </select>

            <select
              value={filters.sort_by}
              onChange={(e) => handleFilterChange("sort_by", e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tartiblash</option>
              <option value="date">Sana bo'yicha</option>
            </select>
          </div>
        </div>

        {/* Bronlar jadvali */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bron ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To'yxona
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sana
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Odamlar soni
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mijoz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => {
                    const status = getStatusText(booking);
                    const canCancel =
                      new Date(booking.booking_date) > new Date();

                    return (
                      <tr key={booking.booking_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.booking_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              {booking.venue_name}
                            </div>
                            <div className="text-gray-500">
                              {booking.district_name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(booking.booking_date).toLocaleDateString(
                            "uz-UZ"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.number_of_seats}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              {booking.first_name} {booking.last_name}
                            </div>
                            <div className="text-gray-500">
                              {booking.phone_number}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}
                          >
                            {status.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {canCancel && (
                            <button
                              onClick={() =>
                                handleCancelBooking(booking.booking_id)
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              Bekor qilish
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {bookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Hech qanday bron topilmadi
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsList;
