import {
  LayoutDashboard,
  Package,
  Warehouse,
  ArrowDownUp,
  BarChart3,
  ClipboardCheck,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Sidebar = () => {
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/products", icon: Package, label: "Products" },
    { to: "/warehouses", icon: Warehouse, label: "Warehouses" },
    { to: "/stock-operations", icon: ArrowDownUp, label: "Stock Operations" },
    { to: "/inventory-count", icon: ClipboardCheck, label: "Inventory Count" },
    { to: "/reports", icon: BarChart3, label: "Reports" },
  ];

  const adminItems = [
    { to: "/user-management", icon: Users, label: "User Management" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">
              InvenTrack
            </h1>
            <p className="text-xs text-sidebar-foreground/60">
              Inventory Manager
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium"
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <Separator className="my-4 bg-sidebar-border" />

        {adminItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium"
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-semibold text-white">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              Admin
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              dphuongthuy7@gmail.com
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
