"use client";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Xush kelibsiz, {user.first_name} {user.last_name}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* To'yxonalarni ko'rish */}
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
                    To'yxonalarni Ko'rish
                  </h3>
                  <p className="text-sm text-gray-500">
                    Barcha mavjud to'yxonalarni ko'ring va bron qiling
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/user/venues"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors inline-block text-center"
                >
                  To'yxonalarni Ko'rish
                </Link>
              </div>
            </div>
          </div>

          {/* Bronlarni ko'rish */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-xl">📋</span>
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Mening Bronlarim
                  </h3>
                  <p className="text-sm text-gray-500">
                    O'zingiz qilgan bronlarni ko'ring va boshqaring
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/user/bookings"
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors inline-block text-center"
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
            To'yxona Bron Qilish Haqida
          </h3>
          <p className="text-blue-700">
            Bizning platformamiz orqali siz Toshkent shahrining eng yaxshi
            to'yxonalarini ko'rishingiz va online bron qilishingiz mumkin. Har
            bir to'yxona haqida batafsil ma'lumot, narxlar va mavjudlik
            kalendari mavjud.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
    