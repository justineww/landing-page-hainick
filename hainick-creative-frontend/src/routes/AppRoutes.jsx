import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/public/LandingPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}
