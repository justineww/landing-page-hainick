import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/public/LandingPage";

// Admin (uncomment setelah siap):
// import AdminLayout from "../layouts/AdminLayout";
// import Dashboard from "../pages/admin/panel/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<LandingPage />} />

      {/* ADMIN
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
      */}
    </Routes>
  );
}
