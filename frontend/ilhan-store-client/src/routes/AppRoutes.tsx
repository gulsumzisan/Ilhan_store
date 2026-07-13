import { Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ProtectedRoute } from './ProtectedRoute'

import { HomePage } from '@/pages/Home'
import { ProductsPage } from '@/pages/Products'
import { ProductDetailPage } from '@/pages/ProductDetail'
import { CategoriesPage } from '@/pages/Categories'
import { CartPage } from '@/pages/Cart'
import { CheckoutPage } from '@/pages/Checkout'
import { OrdersPage } from '@/pages/Orders'
import { OrderDetailPage } from '@/pages/Orders/OrderDetail'
import { FavoritesPage } from '@/pages/Favorites'
import { ProfilePage } from '@/pages/Profile'
import { LoginPage } from '@/pages/Login'
import { RegisterPage } from '@/pages/Register'
import { NotFoundPage } from '@/pages/NotFound'
import { AdminDashboardPage } from '@/pages/Admin'
import { AdminProductsPage } from '@/pages/Admin/AdminProducts'
import { AdminCategoriesPage } from '@/pages/Admin/AdminCategories'
import { AdminOrdersPage } from '@/pages/Admin/AdminOrders'

export function AppRoutes() {
  return (
    <Routes>
      {/* Giriş / Kayıt – navbar yok */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Genel (herkese açık) sayfalar */}
      <Route element={<MainLayout />}>
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="categories" element={<CategoriesPage />} />

        {/* Giriş gerektiren sayfalar */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<HomePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Yönetim paneli (sadece Admin) */}
      <Route element={<ProtectedRoute requireAdmin />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
