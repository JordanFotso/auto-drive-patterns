import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute"; // Import de ProtectedRoute
import Index from "./pages/Index";
import Login from "./pages/Login"; // Nouvelle page
import Register from "./pages/Register"; // Nouvelle page
import Catalogue from "./pages/Catalogue";
import VehicleDetail from "./pages/VehicleDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout"; // Page de checkout
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import Promotions from "./pages/Promotions";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <AuthProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/vehicule/:id" element={<VehicleDetail />} />
            <Route path="/panier" element={<Cart />} />
            
            {/* Routes protégées */}
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/commande/:id" element={<OrderConfirmation />} />
            <Route path="/mes-commandes" element={<Orders />} />
            <Route path="/promotions" element={<Promotions />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </TooltipProvider>
);

export default App;
