import { Routes, Route } from "react-router-dom";

// PERBAIKAN: Import dari lokasi file yang sebenarnya
// Naik satu folder (../), masuk ke pages, lalu public
import LandingPage from "../pages/public/LandingPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}
