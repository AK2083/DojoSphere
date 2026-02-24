import { Routes, Route } from "react-router";

import CommonLayout from "@app/components/common-layout";
import RegisterPage from "@features/authentication/pages/register-page";
import SuccessPage from "@features/authentication/pages/success-page";
import Dashboard from "@features/dashboard/pages/dashboard";
import Settings from "@features/settings/pages/settings";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<CommonLayout />}>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/dashboard" element={<RegisterPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/register-success" element={<SuccessPage />} />
      </Route>
    </Routes>
  );
}
