"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

const VenueBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [numberOfSeats, setNumberOfSeats] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingCreated, setBookingCreated] = useState(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  useEffect(() => {
    fetchVenue();
    // eslint-disable-next-line
  }, [id]);

  const fetchVenue = async () => {
    try {
      const response = await api.get(`/user/venues/${id}`);
      setVenue(response.data);
    } catch (error) {
      console.error("To'yxona ma'lumotlarini yuklashda xatolik:", error);
      navigate("/user/venues");
    } finally {
      setLoading(false);
    }
  };

  const getBookedDates = () => {
    if (!venue || !venue.bookings) return [];
    return venue.bookings.map((booking) => {
      const bookingDate = new Date(booking.booking_date);
      return bookingDate.toISOString().split("T")[0];
    });
  };

  const isDateBooked = (dateString) => {
    return getBookedDates().includes(dateString);
  };

  const isDatePast = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateString);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Keyingi 3 oyni ko'rsatish
    const months = [];
    for (let i = 0; i < 3; i++) {
      const month = new Date(currentYear, currentMonth + i, 1);
      months.push(month);
    }

    return months.map((month, monthIndex) => {
      const monthName = month.toLocaleDateString("uz-UZ", {
        month: "long",
        year: "numeric",
      });
      const daysInMonth = new Date(
        month.getFullYear(),
        month.getMonth() + 1,
        0
      ).getDate();
      const firstDayOfMonth = new Date(
        month.getFullYear(),
        month.getMonth(),
        1
      ).getDay();

      const days = [];

      // Bo'sh kunlar (oyning boshida)
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="p-2"></div>);
      }

      // Oyning kunlari
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(month.getFullYear(), month.getMonth(), day);
        const dateString = date.toISOString().split("T")[0];
        const isBooked = isDateBooked(dateString);
        const isPast = isDatePast(dateString);
        const isSelected = selectedDate === dateString;

        let className =
          "p-2 text-center cursor-pointer border rounded transition-colors ";

        if (isPast) {
          className += "bg-gray-200 text-gray-400 cursor-not-allowed ";
        } else if (isBooked) {
          className += "bg-red-200 text-red-800 cursor-not-allowed ";
        } else if (isSelected) {
          className += "bg-blue-600 text-white ";
        } else {
          className += "bg-green-100 text-green-800 hover:bg-green-200 ";
        }

        days.push(
          <div
            key={day}
            className={className}
            onClick={() => {
              if (!isPast && !isBooked) {
                setSelectedDate(dateString);
                setError("");
              }
            }}
            title={
              isPast
                ? "O'tgan kun"
                : isBooked
                ? "Bu kun band"
                : isSelected
                ? "Tanlangan kun"
                : "Mavjud kun"
            }
          >
            {day}
          </div>
        );
      }

      return (
        <div key={monthIndex} className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-center">
            {monthName}
          </h3>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"].map(
              (day) => (
                <div
                  key={day}
                  className="p-2 text-center font-medium text-gray-600"
                >
                  {day}
                </div>
              )
            )}
          </div>
          <div className="grid grid-cols-7 gap-1">{days}</div>
        </div>
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      setError("Iltimos, sanani tanlang");
      return;
    }

    if (!numberOfSeats || numberOfSeats <= 0) {
      setError("Iltimos, odamlar sonini kiriting");
      return;
    }

    if (Number.parseInt(numberOfSeats) > venue.capacity) {
      setError(`Maksimal sig'im: ${venue.capacity} kishi`);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await api.post("/user/bookings", {
        venue_id: Number.parseInt(id),
        booking_date: selectedDate,
        number_of_seats: Number.parseInt(numberOfSeats),
      });

      setBookingCreated(response.data);
      alert("Bron yaratildi! Endi to'lov chekini yuklang.");
    } catch (error) {
      setError(error.response?.data?.error || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingReceipt(true);
    setError("");

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      await api.post(
        `/user/bookings/${bookingCreated.booking_id}/upload-receipt`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(
        "To'lov cheki muvaffaqiyatli yuklandi! To'yxona egasi tomonidan tasdiqlanishini kuting."
      );
      navigate("/user/bookings");
    } catch (error) {
      setError(
        error.response?.data?.error || "Chek yuklashda xatolik yuz berdi"
      );
    } finally {
      setUploadingReceipt(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-red-600">To'yxona topilmadi</p>
        </div>
      </div>
    );
  }

  // Agar bron yaratilgan bo'lsa, to'lov sahifasini ko'rsatish
  if (bookingCreated) {
    const totalAmount = bookingCreated.total_amount;

    return (
      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-green-600 mb-6">
              ✅ Bron muvaffaqiyatli yaratildi!
            </h1>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">
                To'lov ma'lumotlari
              </h2>
              <div className="space-y-2 text-blue-800">
                <p>
                  <strong>To'yxona:</strong> {venue.name}
                </p>
                <p>
                  <strong>Sana:</strong>{" "}
                  {new Date(bookingCreated.booking_date).toLocaleDateString(
                    "uz-UZ"
                  )}
                </p>
                <p>
                  <strong>Odamlar soni:</strong>{" "}
                  {bookingCreated.number_of_seats} kishi
                </p>
                <p>
                  <strong>Jami summa:</strong> {totalAmount.toLocaleString()}{" "}
                  so'm
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                💳 To'lov qilish
              </h3>
              <div className="text-yellow-800">
                <p className="mb-2">
                  <strong>Karta raqami:</strong>{" "}
                  {bookingCreated.owner_card_number}
                </p>
                <p className="mb-2">
                  <strong>To'lov summasi:</strong>{" "}
                  {totalAmount.toLocaleString()} so'm
                </p>
                <p className="text-sm">
                  Yuqoridagi karta raqamiga to'lov qiling va chekni yuklang.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To'lov chekini yuklang
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptUpload}
                  disabled={uploadingReceipt}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              {uploadingReceipt && (
                <div className="text-blue-600 text-sm">Chek yuklanmoqda...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {venue.name} - Bron qilish
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* To'yxona ma'lumotlari */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              To'yxona Ma'lumotlari
            </h2>
            <div className="space-y-3">
              <p>
                <strong>Nomi:</strong> {venue.name}
              </p>
              <p>
                <strong>Manzil:</strong> {venue.district_name} - {venue.address}
              </p>
              <p>
                <strong>Sig'im:</strong> {venue.capacity} kishi
              </p>
              <p>
                <strong>Narx:</strong> {venue.price_per_seat.toLocaleString()}{" "}
                so'm/kishi
              </p>
              <p>
                <strong>Telefon:</strong> {venue.phone_number}
              </p>
              <div className="border-t pt-3 mt-3">
                <p className="text-lg font-bold text-blue-600">
                  Jami narx:{" "}
                  {numberOfSeats
                    ? (numberOfSeats * venue.price_per_seat).toLocaleString()
                    : "0"}{" "}
                  so'm
                </p>
              </div>
            </div>
          </div>

          {/* Bron qilish formasi */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Bron Qilish</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Odamlar soni
                </label>
                <input
                  type="number"
                  value={numberOfSeats}
                  onChange={(e) => setNumberOfSeats(e.target.value)}
                  min="1"
                  max={venue.capacity}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`1 dan ${venue.capacity} gacha`}
                />
              </div>

              {selectedDate && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Tanlangan sana:</strong>{" "}
                    {new Date(selectedDate).toLocaleDateString("uz-UZ")}
                  </p>
                </div>
              )}

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <button
                type="submit"
                disabled={submitting || !selectedDate || !numberOfSeats}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 transition-colors"
              >
                {submitting ? "Saqlanmoqda..." : "Bron qilish"}
              </button>
            </form>
          </div>
        </div>

        {/* Kalendar */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Mavjud Sanalar</h2>
          <div className="mb-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 border rounded mr-2"></div>
              <span>Mavjud</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-200 border rounded mr-2"></div>
              <span>Band</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 border rounded mr-2"></div>
              <span>O'tgan kunlar</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 border rounded mr-2"></div>
              <span>Tanlangan</span>
            </div>
          </div>
          {generateCalendar()}
        </div>
      </div>
    </div>
  );
};

export default VenueBooking;
