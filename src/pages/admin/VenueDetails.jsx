"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, districts } from "../../services/api";

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [assigningOwner, setAssigningOwner] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState("");
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchVenue();
    fetchOwners();
    // eslint-disable-next-line
  }, [id]);

  const fetchVenue = async () => {
    try {
      const response = await api.get(`/admin/venues/${id}`);
      setVenue(response.data);
      setEditForm(response.data);
    } catch (error) {
      console.error("To'yxona ma'lumotlarini yuklashda xatolik:", error);
      navigate("/admin/venues");
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await api.get("/admin/owners");
      setOwners(response.data);
    } catch (error) {
      console.error("Egalarni yuklashda xatolik:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/venues/${id}`, {
        name: editForm.name,
        district_id: Number.parseInt(editForm.district_id),
        address: editForm.address,
        capacity: Number.parseInt(editForm.capacity),
        price_per_seat: Number.parseInt(editForm.price_per_seat),
        phone_number: editForm.phone_number,
      });
      setEditing(false);
      fetchVenue();
      alert("To'yxona ma'lumotlari muvaffaqiyatli yangilandi!");
    } catch (error) {
      alert(
        "Xatolik yuz berdi: " +
          (error.response?.data?.error || "Noma'lum xatolik")
      );
    }
  };

  const handleAssignOwner = async () => {
    if (!selectedOwnerId) {
      alert("Iltimos, egani tanlang");
      return;
    }

    try {
      await api.put(`/admin/venues/${id}/assign-owner`, {
        owner_id: Number.parseInt(selectedOwnerId),
      });
      setAssigningOwner(false);
      setSelectedOwnerId("");
      fetchVenue();
      alert("Ega muvaffaqiyatli biriktirildi!");
    } catch (error) {
      alert(
        "Xatolik yuz berdi: " +
          (error.response?.data?.error || "Noma'lum xatolik")
      );
    }
  };

  const handleConfirmVenue = async () => {
    try {
      await api.put(`/admin/venues/${id}/confirm`);
      fetchVenue();
      alert("To'yxona muvaffaqiyatli tasdiqlandi!");
    } catch (error) {
      alert(
        "Xatolik yuz berdi: " +
          (error.response?.data?.error || "Noma'lum xatolik")
      );
    }
  };

  const handleDeleteVenue = async () => {
    if (window.confirm("Haqiqatan ham bu to'yxonani o'chirmoqchimisiz?")) {
      try {
        await api.delete(`/admin/venues/${id}`);
        alert("To'yxona muvaffaqiyatli o'chirildi!");
        navigate("/admin/venues");
      } catch (error) {
        alert(
          "Xatolik yuz berdi: " +
            (error.response?.data?.error || "Noma'lum xatolik")
        );
      }
    }
  };

  const generateCalendar = () => {
    if (!venue || !venue.bookings) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Vaqtni 00:00:00 ga o'rnatish
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Keyingi 3 oyni ko'rsatish
    const months = [];
    for (let i = 0; i < 3; i++) {
      const month = new Date(currentYear, currentMonth + i, 1);
      months.push(month);
    }

    // Bron qilingan sanalarni to'g'ri formatda olish
    const bookedDates = venue.bookings.map((booking) => {
      const bookingDate = new Date(booking.booking_date);
      return bookingDate.toISOString().split("T")[0];
    });

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
        date.setHours(0, 0, 0, 0); // Vaqtni 00:00:00 ga o'rnatish
        const dateString = date.toISOString().split("T")[0];
        const isBooked = bookedDates.includes(dateString);
        const isPast = date < today;

        let className = "p-2 text-center border rounded text-sm ";

        if (isPast) {
          className += "bg-gray-200 text-gray-500 ";
        } else if (isBooked) {
          className +=
            "bg-red-200 text-red-800 cursor-pointer hover:bg-red-300 ";
        } else {
          className += "bg-green-100 text-green-800 ";
        }

        const booking = venue.bookings.find((b) => {
          const bookingDate = new Date(b.booking_date);
          return bookingDate.toISOString().split("T")[0] === dateString;
        });

        days.push(
          <div
            key={day}
            className={className}
            title={
              booking
                ? `Bron qilingan: ${booking.first_name} ${booking.last_name} - ${booking.number_of_seats} kishi`
                : isPast
                ? "O'tgan kun"
                : "Bo'sh"
            }
            onClick={() => {
              if (booking) {
                alert(
                  `Bron ma'lumotlari:\nSana: ${new Date(
                    booking.booking_date
                  ).toLocaleDateString("uz-UZ")}\nMijoz: ${
                    booking.first_name
                  } ${booking.last_name}\nTelefon: ${
                    booking.phone_number
                  }\nOdamlar soni: ${booking.number_of_seats}`
                );
              }
            }}
          >
            {day}
          </div>
        );
      }

      return (
        <div key={monthIndex} className="mb-6">
          <h4 className="text-lg font-semibold mb-3 text-center">
            {monthName}
          </h4>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"].map(
              (day) => (
                <div
                  key={day}
                  className="p-2 text-center font-medium text-gray-600 text-sm"
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

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{venue.name}</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate("/admin/venues")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Orqaga
            </button>
            {venue.status === "unconfirmed" && (
              <button
                onClick={handleConfirmVenue}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Tasdiqlash
              </button>
            )}
            <button
              onClick={() => setEditing(!editing)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              {editing ? "Bekor qilish" : "Tahrirlash"}
            </button>
            <button
              onClick={handleDeleteVenue}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              O'chirish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* To'yxona ma'lumotlari */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              To'yxona Ma'lumotlari
            </h2>

            {editing ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nomi
                  </label>
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rayon
                  </label>
                  <select
                    value={editForm.district_id || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, district_id: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
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
                    value={editForm.address || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, address: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sig'im
                  </label>
                  <input
                    type="number"
                    value={editForm.capacity || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, capacity: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Narx (so'm/kishi)
                  </label>
                  <input
                    type="number"
                    value={editForm.price_per_seat || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        price_per_seat: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone_number || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone_number: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Saqlash
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Bekor qilish
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      venue.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {venue.status === "confirmed"
                      ? "Tasdiqlangan"
                      : "Kutilayotgan"}
                  </span>
                </p>
                <p>
                  <strong>Rayon:</strong> {venue.district_name}
                </p>
                <p>
                  <strong>Manzil:</strong> {venue.address}
                </p>
                <p>
                  <strong>Sig'im:</strong> {venue.capacity} kishi
                </p>
                <p>
                  <strong>Narx:</strong>{" "}
                  {venue.price_per_seat?.toLocaleString()} so'm/kishi
                </p>
                <p>
                  <strong>Jami narx:</strong>{" "}
                  {(venue.capacity * venue.price_per_seat)?.toLocaleString()}{" "}
                  so'm
                </p>
                <p>
                  <strong>Telefon:</strong> {venue.phone_number}
                </p>
                <p>
                  <strong>Ega:</strong>{" "}
                  {venue.owner_id ? "Biriktirilgan" : "Biriktirilmagan"}
                </p>
              </div>
            )}

            {/* Ega biriktirish */}
            {!venue.owner_id && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-medium mb-3">Ega Biriktirish</h3>
                {assigningOwner ? (
                  <div className="space-y-3">
                    <select
                      value={selectedOwnerId}
                      onChange={(e) => setSelectedOwnerId(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Egani tanlang</option>
                      {owners.map((owner) => (
                        <option key={owner.owner_id} value={owner.owner_id}>
                          {owner.first_name} {owner.last_name} ({owner.username}
                          )
                        </option>
                      ))}
                    </select>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAssignOwner}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Biriktirish
                      </button>
                      <button
                        onClick={() => setAssigningOwner(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Bekor qilish
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAssigningOwner(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Ega Biriktirish
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Kalendar */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Bron Kalendari</h2>
            <div className="mb-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 border rounded mr-2"></div>
                <span>Bo'sh</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-200 border rounded mr-2"></div>
                <span>Bron qilingan</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 border rounded mr-2"></div>
                <span>O'tgan kunlar</span>
              </div>
            </div>
            {generateCalendar()}
          </div>
        </div>

        {/* Bronlar ro'yxati */}
        {venue.bookings && venue.bookings.length > 0 && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Bronlar Ro'yxati</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sana
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mijoz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Odamlar soni
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {venue.bookings.map((booking) => {
                    const bookingDate = new Date(booking.booking_date);
                    const today = new Date();
                    const isPast = bookingDate < today;

                    return (
                      <tr key={booking.booking_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bookingDate.toLocaleDateString("uz-UZ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.first_name} {booking.last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.phone_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.number_of_seats}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              isPast
                                ? "bg-gray-100 text-gray-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {isPast ? "Bo'lib o'tgan" : "Endi bo'ladigan"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueDetails;
