"use client";

import { useState, useEffect } from "react";
import { api } from "../../services/api";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [commissionPayments, setCommissionPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");
  const [filters, setFilters] = useState({
    date: "",
    status: "",
    payment_status: "",
  });
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    if (activeTab === "bookings") {
      fetchBookings();
    } else {
      fetchCommissionPayments();
    }
    // eslint-disable-next-line
  }, [filters, activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/owner/bookings?${params}`);
      setBookings(response.data);
    } catch (error) {
      console.error("Bronlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommissionPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/owner/commission-payments");
      setCommissionPayments(response.data);
    } catch (error) {
      console.error("Komissiya to'lovlarini yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePaymentAction = async (bookingId, action) => {
    const actionText = action === "confirm" ? "tasdiqlash" : "rad etish";
    if (
      window.confirm(`Haqiqatan ham bu to'lovni ${actionText}ni xohlaysizmi?`)
    ) {
      try {
        const response = await api.put(
          `/owner/bookings/${bookingId}/confirm-payment`,
          { action }
        );

        if (action === "confirm") {
          alert(
            `To'lov tasdiqlandi! Komissiya summasi: ${response.data.commission_amount.toLocaleString()} so'm\nAdmin karta raqami: ${
              response.data.admin_card_number
            }`
          );
        } else {
          alert("To'lov rad etildi!");
        }

        fetchBookings();
        fetchCommissionPayments();
      } catch (error) {
        alert(
          "Xatolik yuz berdi: " +
            (error.response?.data?.error || "Noma'lum xatolik")
        );
      }
    }
  };

  const handleCommissionReceiptUpload = async (paymentId, file) => {
    const formData = new FormData();
    formData.append("receipt", file);

    try {
      await api.post(
        `/owner/commission-payments/${paymentId}/upload-receipt`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Komissiya to'lov cheki muvaffaqiyatli yuklandi!");
      fetchCommissionPayments();
    } catch (error) {
      alert(
        "Chek yuklashda xatolik: " +
          (error.response?.data?.error || "Noma'lum xatolik")
      );
    }
  };

  // const getStatusText = (booking) => {
  //   const bookingDate = new Date(booking.booking_date);
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   if (bookingDate < today) {
  //     return { text: "Bo'lib o'tgan", color: "bg-gray-100 text-gray-800" };
  //   } else {
  //     return { text: "Endi bo'ladigan", color: "bg-green-100 text-green-800" };
  //   }
  // };

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

  const getCommissionStatusText = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "To'lov kutilmoqda",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "confirmed":
        return { text: "Tasdiqlandi", color: "bg-green-100 text-green-800" };
      case "rejected":
        return { text: "Rad etildi", color: "bg-red-100 text-red-800" };
      default:
        return { text: "Noma'lum", color: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Bronlar va To'lovlar
        </h1>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "bookings"
                ? "bg-white text-blue-600 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Bronlar
          </button>
          <button
            onClick={() => setActiveTab("commission")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "commission"
                ? "bg-white text-blue-600 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Komissiya To'lovlari
          </button>
        </div>

        {activeTab === "bookings" && (
          <>
            {/* Filterlar */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange("date", e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Barcha statuslar</option>
                  <option value="pending">Kutilayotgan</option>
                  <option value="confirmed">Tasdiqlangan</option>
                  <option value="cancelled">Bekor qilingan</option>
                </select>

                <select
                  value={filters.payment_status}
                  onChange={(e) =>
                    handleFilterChange("payment_status", e.target.value)
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Barcha to'lov statuslari</option>
                  <option value="pending">To'lov kutilmoqda</option>
                  <option value="paid">To'lov yuklandi</option>
                  <option value="confirmed">To'lov tasdiqlandi</option>
                  <option value="rejected">To'lov rad etildi</option>
                </select>
              </div>
            </div>

            {/* Bronlar jadvali */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  Sizning to'yxonalaringiz uchun bronlar yo'q
                </p>
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
                          Mijoz
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Summa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          To'lov holati
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amallar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => {
                        // const status = getStatusText(booking);

                        const paymentStatus = getPaymentStatusText(
                          booking.payment_status
                        );
                        const totalAmount =
                          booking.number_of_seats * booking.price_per_seat;

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
                              {new Date(
                                booking.booking_date
                              ).toLocaleDateString("uz-UZ")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                <div className="font-medium">
                                  {booking.first_name} {booking.last_name}
                                </div>
                                <div className="text-gray-500">
                                  {booking.phone_number}
                                </div>
                                <div className="text-gray-500">
                                  {booking.number_of_seats} kishi
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {totalAmount.toLocaleString()} so'm
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatus.color}`}
                              >
                                {paymentStatus.text}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              {booking.payment_status === "paid" && (
                                <>
                                  {booking.payment_receipt_url && (
                                    <button
                                      onClick={() =>
                                        setSelectedReceipt(
                                          `http://localhost:8000${booking.payment_receipt_url}`
                                        )
                                      }
                                      className="text-blue-600 hover:text-blue-900 mr-2"
                                    >
                                      Chekni ko'rish
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      handlePaymentAction(
                                        booking.booking_id,
                                        "confirm"
                                      )
                                    }
                                    className="text-green-600 hover:text-green-900 mr-2"
                                  >
                                    Tasdiqlash
                                  </button>
                                  <button
                                    onClick={() =>
                                      handlePaymentAction(
                                        booking.booking_id,
                                        "reject"
                                      )
                                    }
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Rad etish
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "commission" && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Komissiya To'lovlari
              </h3>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : commissionPayments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Komissiya to'lovlari yo'q</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {commissionPayments.map((payment) => {
                    const commissionStatus = getCommissionStatusText(
                      payment.status
                    );

                    return (
                      <div
                        key={payment.payment_id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-lg font-medium text-gray-900">
                                Komissiya #{payment.payment_id}
                              </h4>
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${commissionStatus.color}`}
                              >
                                {commissionStatus.text}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <p>
                                  <strong>To'yxona:</strong>{" "}
                                  {payment.venue_name}
                                </p>
                                <p>
                                  <strong>Bron sanasi:</strong>{" "}
                                  {new Date(
                                    payment.booking_date
                                  ).toLocaleDateString("uz-UZ")}
                                </p>
                                <p>
                                  <strong>Mijoz:</strong> {payment.first_name}{" "}
                                  {payment.last_name}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <strong>Komissiya summasi:</strong>{" "}
                                  {payment.amount.toLocaleString()} so'm
                                </p>
                                <p>
                                  <strong>Admin karta raqami:</strong>{" "}
                                  {payment.admin_card_number}
                                </p>
                                <p>
                                  <strong>Yaratilgan:</strong>{" "}
                                  {new Date(
                                    payment.created_at
                                  ).toLocaleDateString("uz-UZ")}
                                </p>
                              </div>
                            </div>

                            {payment.status === "pending" &&
                              !payment.receipt_url && (
                                <div className="mt-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Komissiya to'lov chekini yuklang
                                  </label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        handleCommissionReceiptUpload(
                                          payment.payment_id,
                                          file
                                        );
                                      }
                                    }}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                  />
                                </div>
                              )}

                            {payment.receipt_url && (
                              <div className="mt-4">
                                <button
                                  onClick={() =>
                                    setSelectedReceipt(
                                      `http://localhost:8000${payment.receipt_url}`
                                    )
                                  }
                                  className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                  Yuklangan chekni ko'rish
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chek ko'rish modali */}
        {selectedReceipt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">To'lov cheki</h3>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <img
                src={selectedReceipt || "/placeholder.svg"}
                alt="To'lov cheki"
                className="max-w-full h-auto"
                onError={() => {
                  alert("Chekni yuklashda xatolik yuz berdi");
                  setSelectedReceipt(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerBookings;
