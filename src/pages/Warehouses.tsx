import { Plus, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
const Warehouses = () => {
  const warehouses = [
    {
      id: "WH001",
      name: "Main Warehouse",
      location: "123 Industrial Ave, City",
      zones: 12,
      racks: 48,
      capacity: "95%",
      status: "Active",
    },
    {
      id: "WH002",
      name: "North Distribution Center",
      location: "456 Commerce St, Town",
      zones: 8,
      racks: 32,
      capacity: "72%",
      status: "Active",
    },
    {
      id: "WH003",
      name: "South Storage Facility",
      location: "789 Logistics Rd, Village",
      zones: 6,
      racks: 24,
      capacity: "45%",
      status: "Active",
    },
  ];
  const navigate = useNavigate();
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Warehouses</h1>
          <p className="text-muted-foreground">Manage your warehouse </p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/warehouses/new")}>
          <Plus className="h-4 w-4" />
          Add Warehouse
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => (
          <Card
            key={warehouse.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {warehouse.id}
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="bg-success">
                  {warehouse.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">
                  {warehouse.location}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Zones</p>
                  <p className="text-2xl font-bold">{warehouse.zones}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Racks</p>
                  <p className="text-2xl font-bold">{warehouse.racks}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    Capacity
                  </span>
                  <span className="text-sm font-semibold">
                    {warehouse.capacity}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-gradient-primary rounded-full h-2 transition-all"
                    style={{ width: warehouse.capacity }}
                  />
                </div>
              </div>

              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Warehouses;
