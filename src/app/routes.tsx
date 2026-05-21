import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { NotificationsPage } from '../pages/NotificationsPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';

export const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<Navigate to="/notifications" replace />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/portfolio" element={<PlaceholderPage name="Portfolio" />} />
      <Route path="/assets" element={<PlaceholderPage name="Assets" />} />
      <Route path="/deals" element={<PlaceholderPage name="Deals" />} />
      <Route path="/reports" element={<PlaceholderPage name="Reports" />} />
    </Route>
  </Routes>
);
