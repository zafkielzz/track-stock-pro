import { Package, Warehouse, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Products",
      value: "1,234",
      change: "+12.5%",
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Total Stock",
      value: "45,678",
      change: "+8.2%",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Warehouses",
      value: "8",
      change: "+2",
      icon: Warehouse,
      color: "text-accent",
    },
    {
      title: "Low Stock Alerts",
      value: "23",
      change: "-5",
      icon: AlertTriangle,
      color: "text-warning",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your inventory overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="transition-shadow hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.change.startsWith("+") ? "text-success" : "text-destructive"}>
                    {stat.change}
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { product: "Product A", type: "Stock In", qty: "+150", time: "2 hours ago" },
                { product: "Product B", type: "Stock Out", qty: "-75", time: "4 hours ago" },
                { product: "Product C", type: "Transfer", qty: "50", time: "6 hours ago" },
              ].map((movement, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{movement.product}</p>
                    <p className="text-sm text-muted-foreground">{movement.type}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${movement.qty.startsWith("+") ? "text-success" : movement.qty.startsWith("-") ? "text-destructive" : "text-primary"}`}>
                      {movement.qty}
                    </p>
                    <p className="text-xs text-muted-foreground">{movement.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Product X", current: 15, min: 50, percent: 30 },
                { name: "Product Y", current: 8, min: 25, percent: 32 },
                { name: "Product Z", current: 22, min: 100, percent: 22 },
              ].map((product, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {product.current}/{product.min}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-warning rounded-full h-2 transition-all"
                      style={{ width: `${product.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
