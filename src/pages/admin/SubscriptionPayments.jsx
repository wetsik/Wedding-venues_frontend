"use client";

import { useState, useEffect } from "react";
import { api } from "../../services/api";

const SubscriptionPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
  });
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, [filters]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/admin/subscription-payments?${params}`);
      setPayments(response.data);
    } catch (error) {
      console.error("Obuna to'lovlarini yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePaymentAction = async (paymentId, action) => {
    const actionText = action === "confirm" ? "tasdiqlash" : "rad etish";
    if (
      window.confirm(
        `Haqiqatan ham bu obuna to'lovini ${actionText}ni xohlaysizmi?`
      )
    ) {
      try {
        await api.put(`/admin/subscription-payments/${paymentId}/${action}`);

        if (action === "confirm") {
          alert(
            "Obuna to'lovi tasdiqlandi! To'yxona egasining obunasi uzaytirildi."
          );
        } else {
          alert("Obuna to'lovi rad etildi!");
        }

        fetchPayments();
      } catch (error) {
        alert(
          "Xatolik yuz berdi: " +
            (error.response?.data?.error || "Noma'lum xatolik")
        );
      }
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return { text: "Kutilmoqda", color: "bg-yellow-100 text-yellow-800" };
      case "paid":
        return { text: "To'lov yuklandi", color: "bg-blue-100 text-blue-800" };
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
          Oylik Obuna To'lovlari
        </h1>

        {/* Filterlar */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Barcha statuslar</option>
              <option value="pending">Kutilmoqda</option>
              <option value="paid">To'lov yuklandi</option>
              <option value="confirmed">Tasdiqlangan</option>
              <option value="rejected">Rad etilgan</option>
            </select>
          </div>
        </div>

        {/* To'lovlar jadvali */}
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
                      Obuna ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To'yxona egasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Oy/Yil
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bronlar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sig'im
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Summa
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
                  {payments.map((payment) => {
                    const status = getStatusText(payment.status);

                    return (
                      <tr key={payment.subscription_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.subscription_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              {payment.owner_first_name}{" "}
                              {payment.owner_last_name}
                            </div>
                            <div className="text-gray-500">
                              @{payment.owner_username}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.month}/{payment.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.total_bookings}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.total_capacity} kishi
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.subscription_amount.toLocaleString()} so'm
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}
                          >
                            {status.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {payment.receipt_url && (
                            <button
                              onClick={() =>
                                setSelectedReceipt(
                                  `http://localhost:8000${payment.receipt_url}`
                                )
                              }
                              className="text-blue-600 hover:text-blue-900 mr-2"
                            >
                              Chekni ko'rish
                            </button>
                          )}
                          {payment.status === "paid" && payment.receipt_url && (
                            <>
                              <button
                                onClick={() =>
                                  handlePaymentAction(
                                    payment.subscription_id,
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
                                    payment.subscription_id,
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
            {payments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Hech qanday obuna to'lovi topilmadi
              </div>
            )}
          </div>
        )}

        {/* Chek ko'rish modali */}
        {selectedReceipt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Obuna to'lov cheki</h3>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <img
                src={selectedReceipt || "/placeholder.svg"}
                alt="Obuna to'lov cheki"
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

export default SubscriptionPayments;
