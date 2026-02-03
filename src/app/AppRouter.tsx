// router.tsx
import { Routes, Route } from "react-router";

import Dashboard from "@features/dashboard/pages/test-dashboard";
import Settings from "@features/settings/pages/Settings";

import CommonLayout from "@app/CommonLayout";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<CommonLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
