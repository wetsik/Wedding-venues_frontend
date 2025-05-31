import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VenuesList from "./pages/admin/VenuesList";
import AddVenue from "./pages/admin/AddVenue";
import VenueDetails from "./pages/admin/VenueDetails";
import OwnersList from "./pages/admin/OwnersList";
import BookingsList from "./pages/admin/BookingsList";
import UsersList from "./pages/admin/UsersList";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerVenues from "./pages/owner/OwnerVenues";
import AddOwnerVenue from "./pages/owner/AddOwnerVenue";
import OwnerVenueDetails from "./pages/owner/OwnerVenueDetails";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerSubscription from "./pages/owner/OwnerSubscription";
import UserDashboard from "./pages/user/UserDashboard";
import UserVenues from "./pages/user/UserVenues";
import VenueBooking from "./pages/user/VenueBooking";
import UserBookings from "./pages/user/UserBookings";
import CommissionPayments from "./pages/admin/CommissionPayments";
import SubscriptionPayments from "./pages/admin/SubscriptionPayments";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/venues"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <VenuesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/venues/add"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AddVenue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/venues/:id"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <VenueDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/owners"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <OwnersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <BookingsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UsersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/commission-payments"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CommissionPayments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/subscription-payments"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SubscriptionPayments />
                </ProtectedRoute>
              }
            />

            {/* Owner Routes */}
            <Route
              path="/owner"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/venues"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerVenues />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/venues/add"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <AddOwnerVenue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/venues/:id"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerVenueDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/bookings"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/subscription"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerSubscription />
                </ProtectedRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/venues"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserVenues />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/venues/:id/book"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <VenueBooking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/bookings"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserBookings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
