import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { NotificationsPage } from '../pages/NotificationsPage';
import { MasterDataPage } from '../pages/MasterDataPage';

export const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<Navigate to="/master-data" replace />} />
      <Route path="/master-data" element={<MasterDataPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Route>
  </Routes>
);
