"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVenues: 0,
    confirmedVenues: 0,
    unconfirmedVenues: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalOwners: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [venuesRes, bookingsRes, usersRes, ownersRes] = await Promise.all([
        api.get("/admin/venues"),
        api.get("/admin/bookings"),
        api.get("/admin/users"),
        api.get("/admin/owners"),
      ]);

      const venues = venuesRes.data;
      const confirmedVenues = venues.filter(
        (v) => v.status === "confirmed"
      ).length;
      const unconfirmedVenues = venues.filter(
        (v) => v.status === "unconfirmed"
      ).length;

      setStats({
        totalVenues: venues.length,
        confirmedVenues,
        unconfirmedVenues,
        totalBookings: bookingsRes.data.length,
        totalUsers: usersRes.data.length,
        totalOwners: ownersRes.data.length,
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
          Admin Dashboard
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
                      Jami To'yxonalar
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
                      Kutilayotgan
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
                    <span className="text-white font-bold">U</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Foydalanuvchilar
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalUsers}
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
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">O</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      To'yxona Egalari
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalOwners}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tezkor havolalar */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Tezkor Amallar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/admin/venues/add"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center transition-colors"
              >
                Yangi To'yxona Qo'shish
              </Link>
              <Link
                to="/admin/venues"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-center transition-colors"
              >
                To'yxonalarni Ko'rish
              </Link>
              <Link
                to="/admin/owners"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-center transition-colors"
              >
                Egalarni Boshqarish
              </Link>
              <Link
                to="/admin/bookings"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-center transition-colors"
              >
                Bronlarni Ko'rish
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
