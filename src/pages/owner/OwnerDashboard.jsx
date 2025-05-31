"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVenues: 0,
    confirmedVenues: 0,
    unconfirmedVenues: 0,
    totalBookings: 0,
    upcomingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [venuesRes, bookingsRes] = await Promise.all([
        api.get("/owner/venues"), // Owner'ning o'z endpoint'i
        api.get("/owner/bookings"),
      ]);

      const venues = venuesRes.data;
      const confirmedVenues = venues.filter(
        (v) => v.status === "confirmed"
      ).length;
      const unconfirmedVenues = venues.filter(
        (v) => v.status === "unconfirmed"
      ).length;

      const bookings = bookingsRes.data;
      const upcomingBookings = bookings.filter(
        (b) => new Date(b.booking_date) > new Date()
      ).length;

      setStats({
        totalVenues: venues.length,
        confirmedVenues,
        unconfirmedVenues,
        totalBookings: bookings.length,
        upcomingBookings,
      });
    } catch (error) {
      console.error("Statistikalarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
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
          Xush kelibsiz, {user.first_name} {user.last_name}!
        </h1>

        {/* Statistikalar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">T</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Jami To'yxonalarim
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalVenues}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tasdiqlangan
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.confirmedVenues}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">⏳</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tasdiq kutilmoqda
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.unconfirmedVenues}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">B</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Jami Bronlar
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalBookings}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">📅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Kelayotgan Bronlar
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.upcomingBookings}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tezkor havolalar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* To'yxonalarni boshqarish */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-xl">🏛️</span>
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    To'yxonalarim
                  </h3>
                  <p className="text-sm text-gray-500">
                    To'yxonalaringizni ko'ring va boshqaring
                  </p>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <Link
                  to="/owner/venues"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Ko'rish
                </Link>
                <Link
                  to="/owner/venues/add"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Yangi Qo'shish
                </Link>
              </div>
            </div>
          </div>

          {/* Bronlarni ko'rish */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-xl">📋</span>
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Bronlar</h3>
                  <p className="text-sm text-gray-500">
                    To'yxonalaringizga qilingan bronlarni ko'ring
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/owner/bookings"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Bronlarni Ko'rish
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Qo'shimcha ma'lumot */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            To'yxona Egasi Sifatida
          </h3>
          <p className="text-blue-700">
            Siz o'zingizning to'yxonalaringizni platformaga qo'shishingiz,
            ularni boshqarishingiz va mijozlarning bronlarini kuzatishingiz
            mumkin. Yangi qo'shilgan to'yxonalar admin tomonidan tasdiqlanishi
            kerak.
          </p>
          {stats.unconfirmedVenues > 0 && (
            <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded">
              <p className="text-yellow-800">
                ⚠️ Sizda {stats.unconfirmedVenues} ta tasdiqlanmagan to'yxona
                bor. Admin tomonidan tasdiqlanishini kuting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
