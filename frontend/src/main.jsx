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

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LayoutWithNavbar />}>
                            <Route path="/" element={<App />}></Route>
                            <Route
                                path="/profile"
                                element={<ProfilePageLayout />}
                            ></Route>
                            <Route
                                path="/products"
                                element={<ProductsPage />}
                            />
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
