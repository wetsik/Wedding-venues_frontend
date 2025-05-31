"use client";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const getNavLinks = () => {
    switch (user.role) {
      case "admin":
        return [
          { to: "/admin", label: "Bosh sahifa" },
          { to: "/admin/venues", label: "To'yxonalar" },
          { to: "/admin/owners", label: "Egalar" },
          { to: "/admin/bookings", label: "Bronlar" },
          { to: "/admin/commission-payments", label: "Komissiya to'lovlari" },
          { to: "/admin/subscription-payments", label: "Obuna to'lovlari" },
          { to: "/admin/users", label: "Foydalanuvchilar" },
        ];
      case "owner":
        return [
          { to: "/owner", label: "Bosh sahifa" },
          { to: "/owner/venues", label: "Mening to'yxonalarim" },
          { to: "/owner/bookings", label: "Bronlar" },
          { to: "/owner/subscription", label: "Obuna" },
        ];
      case "user":
        return [
          { to: "/user", label: "Bosh sahifa" },
          { to: "/user/venues", label: "To'yxonalar" },
          { to: "/user/bookings", label: "Mening bronlarim" },
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">To'yxona Bron</h1>
            <div className="hidden md:flex space-x-4">
              {getNavLinks().map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {user.first_name || user.username} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition-colors"
            >
              Chiqish
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
