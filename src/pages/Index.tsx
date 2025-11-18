import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Warehouse, Package, BarChart3, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-primary p-2 rounded-lg mr-3">
                <Warehouse className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">WMS Pro</span>
            </div>
            <Button onClick={() => navigate("/auth")}>Get Started</Button>
          </div>
        </div>
      </nav>

      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Professional Warehouse Management
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Streamline your warehouse operations with our comprehensive
              management system. Track inventory, manage stock movements, and
              optimize your warehouse efficiency.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="bg-gradient-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Product Management
              </h3>
              <p className="text-muted-foreground">
                Comprehensive product catalog with SKU tracking and
                categorization
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="bg-gradient-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Warehouse className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Multi-Location
              </h3>
              <p className="text-muted-foreground">
                Manage multiple warehouses, zones, racks, and bin locations
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="bg-gradient-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Real-time Analytics
              </h3>
              <p className="text-muted-foreground">
                Track stock levels, movements, and performance metrics
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="bg-gradient-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Role-Based Access
              </h3>
              <p className="text-muted-foreground">
                Secure user management with admin, manager, staff, and viewer
                roles
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
