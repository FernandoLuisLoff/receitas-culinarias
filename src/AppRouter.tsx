import { Route, Routes } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { RecipeFormPage } from './pages/admin/RecipeFormPage';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="receitas/:id" element={<RecipeDetailPage />} />
        <Route path="login" element={<LoginPage />} />

        <Route path="admin" element={<ProtectedRoute />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="novo" element={<RecipeFormPage />} />
          <Route path=":id/editar" element={<RecipeFormPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter
