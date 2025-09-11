import { Routes, Route } from "react-router-dom";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import ForgotPassword from "../Auth/Forgotpassword";
import ResetPassword from "../Auth/ResetPassword";
import Dashboard from "../../pages/Dashboard";
import Roomlist from "../Rooms/RoomList";
import RoomDetail from "../Rooms/RoomDetail";
import BookingForm from "../Bookings/bookingForm";
import BookingList from "../Bookings/BookingList";
import Home from "../../pages/Home";
import BookingCalendar from "../Bookings/BookingCalender";
import UserList from "../Admin/UserList";
import RoomForm from "../Rooms/RoomForm";
import FacilityForm from "../Facillities/FacilityForm";
import FacilityList from "../Facillities/FacilityList";
import ProtectedRoute from "../utils/protectedRoute";
import AssignFacility from "../Admin/AssignFacility";
import AdminRoomList from "../Admin/AdminRoomList";
import AdminBookingList from "../Admin/AdminBookingList";
import AdminUserBookings from "../Admin/AdminUserBookings";
import AdminAnalytics from "../Admin/AdminAnalytics";
import AuditLogList from "../Bookings/AuditLogs";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/rooms" element={<Roomlist />} />
      <Route path="/rooms/:id" element={<RoomDetail />} />
      <Route path="/bookings/new" element={<BookingForm />} />
      <Route path="/bookings" element={<BookingList />} />
      <Route path="/calendar" element={<BookingCalendar />} />


      <Route path="/admin/users" element={
        <ProtectedRoute role="admin">
          <UserList />
        </ProtectedRoute>
      } />
      <Route path="/admin/rooms/new" element={
        <ProtectedRoute role="admin">
          <RoomForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/facilities/new" element={
        <ProtectedRoute role="admin">
          <FacilityForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/facilities" element={
        <ProtectedRoute role="admin">
          <FacilityList />
        </ProtectedRoute>
      } />
      <Route path="/admin/assign-facility" element={
        <ProtectedRoute role="admin">
          <AssignFacility />
        </ProtectedRoute>
      } />
      <Route path="/admin/rooms" element={
        <ProtectedRoute role="admin">
          <AdminRoomList />
        </ProtectedRoute>
      } />
      <Route path="/admin/bookings" element={
        <ProtectedRoute role="admin">
          <AdminBookingList />
        </ProtectedRoute>
      } />
      <Route path="/admin/users/:id/bookings" element={
        <ProtectedRoute role="admin">
          <AdminUserBookings />
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute role="admin">
          <AdminAnalytics />
        </ProtectedRoute>
      } />

      <Route path="/users/me/audit-logs" element={
        <ProtectedRoute>
          <AuditLogList />
        </ProtectedRoute>
      } />


      {/* Add other routes later */}
    </Routes>
  );
}