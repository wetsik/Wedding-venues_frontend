"use client";

import { useState, useEffect } from "react";
import { api } from "../../services/api";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/user/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Bronlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Haqiqatan ham bu bronni bekor qilmoqchimisiz?")) {
      try {
        await api.delete(`/user/bookings/${bookingId}`);
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

  const getPaymentStatusText = (paymentStatus) => {
    switch (paymentStatus) {
      case "pending":
        return {
          text: "To'lov kutilmoqda",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "paid":
        return { text: "To'lov yuklandi", color: "bg-blue-100 text-blue-800" };
      case "confirmed":
        return {
          text: "To'lov tasdiqlandi",
          color: "bg-green-100 text-green-800",
        };
      case "rejected":
        return { text: "To'lov rad etildi", color: "bg-red-100 text-red-800" };
      default:
        return { text: "Noma'lum", color: "bg-gray-100 text-gray-800" };
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Mening Bronlarim
        </h1>

        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Sizda hali bronlar yo'q</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {bookings.map((booking) => {
                const status = getStatusText(booking);
                const paymentStatus = getPaymentStatusText(
                  booking.payment_status
                );
                const canCancel =
                  new Date(booking.booking_date) > new Date() &&
                  ["pending", "paid"].includes(booking.payment_status);
                const totalAmount =
                  booking.number_of_seats * booking.price_per_seat;

                return (
                  <li key={booking.booking_id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-medium text-blue-600 truncate">
                              {booking.venue_name}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex space-x-2">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}
                              >
                                {status.text}
                              </span>
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatus.color}`}
                              >
                                {paymentStatus.text}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                📍 {booking.district_name}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>
                                📅{" "}
                                {new Date(
                                  booking.booking_date
                                ).toLocaleDateString("uz-UZ")}{" "}
                                | 👥 {booking.number_of_seats} kishi | 💰{" "}
                                {totalAmount.toLocaleString()} so'm
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <p>🆔 Bron ID: {booking.booking_id}</p>
                          </div>

                          {/* To'lov holati bo'yicha qo'shimcha ma'lumot */}
                          {booking.payment_status === "pending" && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                              ⏳ To'lov chekini yuklash uchun bron qilish
                              sahifasiga o'ting
                            </div>
                          )}
                          {booking.payment_status === "paid" && (
                            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                              📄 To'lov cheki yuklandi. To'yxona egasi tomonidan
                              tasdiqlanishini kuting.
                            </div>
                          )}
                          {booking.payment_status === "rejected" && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                              ❌ To'lov rad etildi. Iltimos, qayta to'lov qiling
                              yoki admin bilan bog'laning.
                            </div>
                          )}
                        </div>
                        {canCancel && (
                          <div className="ml-4">
                            <button
                              onClick={() =>
                                handleCancelBooking(booking.booking_id)
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Bekor qilish
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;
