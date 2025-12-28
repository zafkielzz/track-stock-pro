import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Warehouses from "./pages/Warehouses";
import StockOperations from "./pages/StockOperations";
import Reports from "./pages/Reports";
import InventoryCount from "./pages/InventoryCount";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import { ThemeProvider } from "./providers/ThemeProvider";
import InventoryCountNew from "./pages/IventoryCountNew";
import InventoryCountDetail from "./pages/InventoryCountDetail";
import ProductsNew from "./pages/ProductsNew";
import WarehousesNew from "./pages/WarehousesNew";
import WarehousesDetail from "./pages/WarehousesDetail";
import AttendanceCheck from "./pages/AttendanceCheck";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster richColors position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/new" element={<ProductsNew />} />
              <Route path="/warehouses" element={<Warehouses />} />
              <Route path="/warehouses/new" element={<WarehousesNew />} />
              <Route path="/warehouses/:id" element={<WarehousesDetail />} />
              <Route path="/check-in" element={<AttendanceCheck />} />

              <Route path="/stock-operations" element={<StockOperations />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/inventory-count" element={<InventoryCount />} />
              <Route path="/user-management" element={<UserManagement />} />

              <Route
                path="/inventory-count/new"
                element={<InventoryCountNew />}
              />
              <Route
                path="/inventory-count/:id"
                element={<InventoryCountDetail />}
              />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>{" "}
  </QueryClientProvider>
);

export default App;
