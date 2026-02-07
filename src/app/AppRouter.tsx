import { Routes, Route } from "react-router";

import RegisterPage from "@features/authentication/pages/RegisterPage";
import Dashboard from "@features/dashboard/pages/Dashboard";
import Settings from "@features/settings/pages/Settings";

import CommonLayout from "@app/CommonLayout";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<CommonLayout />}>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/dashboard" element={<RegisterPage />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
