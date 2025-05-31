"use client";

import { useState, useEffect } from "react";
import { api } from "../../services/api";

const OwnerSubscription = () => {
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchSubscriptionInfo();
    fetchSubscriptions();
  }, []);

  const fetchSubscriptionInfo = async () => {
    try {
      const response = await api.get("/owner/subscription-info");
      setSubscriptionInfo(response.data);
    } catch (error) {
      console.error("Obuna ma'lumotlarini yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get("/owner/subscriptions");
      setSubscriptions(response.data);
    } catch (error) {
      console.error("Obuna to'lovlarini yuklashda xatolik:", error);
    }
  };

  const handleCreateSubscription = async () => {
    setCreating(true);
    try {
      await api.post("/owner/create-subscription");
      alert("Oylik obuna yaratildi! Endi to'lov qiling.");
      fetchSubscriptionInfo();
      fetchSubscriptions();
    } catch (error) {
      alert("Xatolik: " + (error.response?.data?.error || "Noma'lum xatolik"));
    } finally {
      setCreating(false);
    }
  };

  const handleReceiptUpload = async (subscriptionId, file) => {
    const formData = new FormData();
    formData.append("receipt", file);

    try {
      await api.post(
        `/owner/subscription/${subscriptionId}/upload-receipt`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("To'lov cheki muvaffaqiyatli yuklandi!");
      fetchSubscriptions();
    } catch (error) {
      alert(
        "Chek yuklashda xatolik: " +
          (error.response?.data?.error || "Noma'lum xatolik")
      );
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "To'lov kutilmoqda",
          color: "bg-yellow-100 text-yellow-800",
        };
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Oylik Obuna</h1>

        {/* Obuna holati */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Obuna Holati</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                <p>
                  <strong>Obuna tugash sanasi:</strong>{" "}
                  {subscriptionInfo?.subscription_expires_at
                    ? new Date(
                        subscriptionInfo.subscription_expires_at
                      ).toLocaleDateString("uz-UZ")
                    : "Noma'lum"}
                </p>
                <p>
                  <strong>Holat:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      subscriptionInfo?.is_expired
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {subscriptionInfo?.is_expired ? "Tugagan" : "Faol"}
                  </span>
                </p>
                <p>
                  <strong>Joriy oy:</strong> {subscriptionInfo?.current_month}/
                  {subscriptionInfo?.current_year}
                </p>
              </div>
            </div>

            <div>
              <div className="space-y-3">
                <p>
                  <strong>Joriy oylik bronlar:</strong>{" "}
                  {subscriptionInfo?.booking_count || 0} ta
                </p>
                <p>
                  <strong>Jami sig'im:</strong>{" "}
                  {subscriptionInfo?.total_capacity || 0} kishi
                </p>
                <p>
                  <strong>Admin foizi:</strong>{" "}
                  {subscriptionInfo?.admin_rate || 0}%
                </p>
                <p>
                  <strong>Oylik to'lov:</strong>{" "}
                  <span className="text-lg font-bold text-blue-600">
                    {subscriptionInfo?.subscription_amount?.toLocaleString() ||
                      0}{" "}
                    so'm
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Obuna yaratish */}
          {subscriptionInfo &&
            !subscriptionInfo.current_subscription &&
            subscriptionInfo.subscription_amount > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-900 mb-2">
                  Oylik obuna to'lovi
                </h3>
                <p className="text-yellow-800 mb-4">
                  Joriy oy uchun obuna to'lovingiz:{" "}
                  <strong>
                    {subscriptionInfo.subscription_amount.toLocaleString()}
                  </strong>{" "}
                  so'm
                </p>
                <button
                  onClick={handleCreateSubscription}
                  disabled={creating}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md disabled:opacity-50 transition-colors"
                >
                  {creating ? "Yaratilmoqda..." : "Obuna to'lovini yaratish"}
                </button>
              </div>
            )}

          {subscriptionInfo?.subscription_amount === 0 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                ✅ Joriy oyda bronlar yo'q yoki obuna to'lovi 0 so'm. To'lov
                talab qilinmaydi.
              </p>
            </div>
          )}
        </div>

        {/* Obuna to'lovlari tarixi */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Obuna To'lovlari Tarixi
          </h2>

          {subscriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Obuna to'lovlari yo'q
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((subscription) => {
                const status = getStatusText(subscription.status);

                return (
                  <div
                    key={subscription.subscription_id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-medium">
                          {subscription.month}/{subscription.year} - Oylik obuna
                        </h3>
                        <p className="text-sm text-gray-600">
                          Yaratilgan:{" "}
                          {new Date(subscription.created_at).toLocaleDateString(
                            "uz-UZ"
                          )}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}
                      >
                        {status.text}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <p>
                          <strong>Bronlar soni:</strong>{" "}
                          {subscription.total_bookings}
                        </p>
                        <p>
                          <strong>Jami sig'im:</strong>{" "}
                          {subscription.total_capacity} kishi
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>To'lov summasi:</strong>{" "}
                          {subscription.subscription_amount.toLocaleString()}{" "}
                          so'm
                        </p>
                        <p>
                          <strong>Admin karta:</strong>{" "}
                          {subscription.admin_card_number}
                        </p>
                      </div>
                    </div>

                    {subscription.status === "pending" &&
                      !subscription.receipt_url && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Obuna to'lov chekini yuklang
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                handleReceiptUpload(
                                  subscription.subscription_id,
                                  file
                                );
                              }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>
                      )}

                    {subscription.receipt_url && (
                      <div>
                        <a
                          href={`http://localhost:8000${subscription.receipt_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          Yuklangan chekni ko'rish
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerSubscription;
