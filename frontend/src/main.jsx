import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import LayoutWithNavbar from "./layout/LayoutWithNavbar.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./provider/userProvider.jsx";
import ProfilePageLayout from "./layout/ProfileLayout.jsx";
const queryClient = new QueryClient();
import ProductsPage from "./pages/ProductsPage.jsx";
import { ProductFilterProvider } from "./provider/ProductFilterProvider.jsx";
import AccountPage from "./pages/profile/accountPage.jsx";
import OrderHistory from "./pages/profile/orderHistory.jsx";
import AdminPage from "./pages/admin/adminPage.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import ChangePasswordPage from "./pages/profile/changePassword.jsx";
import AdminPageLayout from "./layout/AdminPageLayout.jsx";
import ProductCreatePage from "./pages/admin/createProductPage.jsx";
import ProductUpdatePage from "./pages/admin/updateProductPage.jsx";
import CreateCategoryPage from "./pages/admin/createCategoryPage.jsx";
import AdminProductSearch from "./pages/admin/adminProductSearch.jsx";
import DeleteProductSearch from "./pages/admin/deleteProductSearch.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LayoutWithNavbar />}>
              <Route path="/" element={<App />}></Route>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPageLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="" element={<AdminPage />}></Route>
                <Route
                  path="create-product"
                  element={<ProductCreatePage />}
                ></Route>
                <Route
                  path="update-product"
                  element={<AdminProductSearch />}
                ></Route>
                <Route
                  path="update-product/:id"
                  element={<ProductUpdatePage />}
                ></Route>
                <Route
                  path="delete-product"
                  element={<DeleteProductSearch />}
                ></Route>
                <Route
                  path="create-category"
                  element={<CreateCategoryPage />}
                ></Route>
              </Route>
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePageLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="account" element={<AccountPage />}></Route>
                <Route path="order-history" element={<OrderHistory />}></Route>
                <Route
                  path="account/change-password"
                  element={<ChangePasswordPage />}
                ></Route>
              </Route>
              <Route
                path="/products"
                element={
                  <ProductFilterProvider>
                    <ProductsPage />
                  </ProductFilterProvider>
                }
              />
              <Route path="/auth/login" element={<LoginPage />}></Route>
              <Route path="/auth/register" element={<RegisterPage />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);
