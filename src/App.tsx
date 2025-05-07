
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import AboutPage from "./pages/AboutPage";
import OrderPage from "./pages/OrderPage";
import NotFound from "./pages/NotFound";
import TestimonialDetailPage from "./pages/TestimonialDetailPage";
import AdminPage from "./pages/AdminPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import MenuItemDetailPage from "./pages/MenuItemDetailPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import TrackOrderPage from "./pages/TrackOrderPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Wrapper component to handle location changes for AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="menu/:id" element={<MenuItemDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="order/:orderId" element={<OrderConfirmationPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="track" element={<TrackOrderPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="testimonial/:id" element={<TestimonialDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin-dashboard/login" element={<AdminLoginPage />} />
        <Route path="/admin-dashboard" element={<AdminPage />} />
        <Route path="/admin-dashboard/orders" element={<AdminOrdersPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
