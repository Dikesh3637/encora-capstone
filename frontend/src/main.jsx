import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import LayoutWithNavbar from "./layout/LayoutWithNavbar.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./provider/userProvider.jsx";
import ProfilePageLayout from "./layout/ProfileLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProfileLayout from "./pages/ProfileLayout.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import EditPasswordPage from "./pages/EditPasswordPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
const queryClient = new QueryClient();
import ProductsPage from "./pages/ProductsPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ProductDescriptionPage from "./pages/ProductDescriptionPage.jsx";
import { ProductFilterProvider } from "./provider/ProductFilterProvider.jsx";
import ProfileOverview from "./pages/profile/ProfileOverview.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LayoutWithNavbar />}>
                            <Route path="/" element={<App />}></Route>
                            <Route path="/test-product" element={<ProductDescriptionPage />} />
                            <Route path="/test-checkout" element={<CheckoutPage />} />
                            <Route
                                path="/products"
                                element={
                                    <ProductFilterProvider>
                                        <ProductsPage />
                                    </ProductFilterProvider>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProfileLayout />
                                }
                                >
                                    <Route index element={<ProfileOverview />} />
                                    <Route path="account" element={<AccountPage />} />
                                    <Route path="account/editpassword" element={<EditPasswordPage />} />
                                    <Route path="orderhistory" element={<OrderHistoryPage />} />
                                </Route>

                        
                           
                            
                            <Route
                                path="/auth/login"
                                element={<LoginPage />}
                            ></Route>
                            <Route
                                path="/auth/register"
                                element={<RegisterPage />}
                            ></Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </QueryClientProvider>
    </StrictMode>,
);
