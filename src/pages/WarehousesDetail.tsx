import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  Plus,
  AlertTriangle,
  Box,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const MOCK_WAREHOUSE = {
  id: "WH001",
  code: "WH-HN-01",
  name: "Main Distribution Center Hanoi",
  address: "Khu Công Nghiệp Thăng Long, Hà Nội",
  manager: "Nguyễn Văn Quản Lý",
  status: "ACTIVE",
  capacity: {
    max: 10000,
    current: 7250,
  },
  // Cấu trúc kho
  zones: [
    {
      id: "Z01",
      name: "Zone A - Electronics",
      racks: [
        { id: "R01", name: "Rack A-01", usage: 80 },
        { id: "R02", name: "Rack A-02", usage: 45 },
      ],
    },
    {
      id: "Z02",
      name: "Zone B - General Goods",
      racks: [{ id: "R03", name: "Rack B-01", usage: 10 }],
    },
  ],
};

const WarehouseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL

  // State giả lập (Thực tế bạn sẽ dùng API để load và update)
  const [warehouse, setWarehouse] = useState(MOCK_WAREHOUSE);
  const [newZoneName, setNewZoneName] = useState("");
  const [isAddZoneOpen, setIsAddZoneOpen] = useState(false);

  // Tính toán Logic Capacity
  const usagePercent =
    (warehouse.capacity.current / warehouse.capacity.max) * 100;
  const available = warehouse.capacity.max - warehouse.capacity.current;

  // Hàm chọn màu cho Progress Bar
  const getProgressColor = (percent: number) => {
    if (percent >= 90) return "bg-red-600";
    if (percent >= 70) return "bg-yellow-500";
    return "bg-blue-600";
  };

  // Hàm giả lập thêm Zone
  const handleAddZone = () => {
    if (!newZoneName) return;
    const newZone = {
      id: `Z${Math.random().toString(36).substr(2, 4)}`, // Random ID
      name: newZoneName,
      racks: [],
    };
    setWarehouse({
      ...warehouse,
      zones: [...warehouse.zones, newZone],
    });
    setNewZoneName("");
    setIsAddZoneOpen(false);
  };

  return (
    <div className="p-8 min-h-screen  space-y-6">
      {/* 1. HEADER & NAVIGATION */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {warehouse.name}
            </h1>
            <Badge
              className={
                warehouse.status === "ACTIVE" ? "bg-green-600" : "bg-gray-500"
              }
            >
              {warehouse.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <Box className="h-4 w-4" /> {warehouse.code}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {warehouse.address}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" /> {warehouse.manager}
            </span>
          </div>
        </div>
        <Button variant="outline">Edit Warehouse</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 2. CAPACITY WIDGET (QUAN TRỌNG NHẤT) */}
        <Card className="md:col-span-2 shadow-md border-t-4 border-t-blue-600">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Capacity Overview</span>
              <span className="text-sm font-normal text-slate-500">
                Hybrid Units
              </span>
            </CardTitle>
            <CardDescription>
              Real-time utilization based on storage points.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span>Usage: {usagePercent.toFixed(1)}%</span>
                <span
                  className={
                    usagePercent > 90 ? "text-red-600" : "text-slate-600"
                  }
                >
                  {warehouse.capacity.current.toLocaleString()} /{" "}
                  {warehouse.capacity.max.toLocaleString()} Units
                </span>
              </div>
              {/* Custom Progress Bar Color */}
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getProgressColor(
                    usagePercent
                  )}`}
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase">Max Capacity</p>
                <p className="text-xl font-bold text-slate-500">
                  {warehouse.capacity.max.toLocaleString()}
                </p>
              </div>
              <div className="text-center border-l">
                <p className="text-xs text-slate-500 uppercase">Current Load</p>
                <p className="text-xl font-bold text-blue-600">
                  {warehouse.capacity.current.toLocaleString()}
                </p>
              </div>
              <div className="text-center border-l">
                <p className="text-xs text-slate-500 uppercase">Available</p>
                <p className="text-xl font-bold text-green-600">
                  {available.toLocaleString()}
                </p>
              </div>
            </div>

            {usagePercent > 90 && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                <AlertTriangle className="h-4 w-4" />
                Warning: Warehouse is almost full! Consider moving stock or
                optimizing.
              </div>
            )}
          </CardContent>
        </Card>

        {/* STATS NHỎ BÊN PHẢI */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Total Zones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{warehouse.zones.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Total Racks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {warehouse.zones.reduce((acc, z) => acc + z.racks.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. STRUCTURE MANAGEMENT (ZONES & RACKS) */}
      <Tabs defaultValue="structure" className="w-full">
        <TabsList>
          <TabsTrigger value="structure">Structure & Layout</TabsTrigger>
          <TabsTrigger value="inventory">Inventory List</TabsTrigger>
          <TabsTrigger value="history">Stock History</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold ">Warehouse Layout</h3>

            {/* MODAL ADD ZONE */}
            <Dialog open={isAddZoneOpen} onOpenChange={setIsAddZoneOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Add Zone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Zone</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="e.g. Zone C - Cold Storage"
                    value={newZoneName}
                    onChange={(e) => setNewZoneName(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleAddZone}>Create Zone</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* LIST CÁC ZONE */}
          <div className="space-y-4">
            {warehouse.zones.map((zone) => (
              <Card key={zone.id} className="overflow-hidden">
                <div className=" p-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 " />
                    <span className="font-semibold ">{zone.name}</span>
                    <Badge variant="outline">{zone.racks.length} Racks</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    Add Rack
                  </Button>
                </div>

                {/* LIST CÁC RACK TRONG ZONE */}
                <div className="p-4  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {zone.racks.length > 0 ? (
                    zone.racks.map((rack) => (
                      <div
                        key={rack.id}
                        className="border rounded-md p-3 hover:border-blue-400 transition cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium group-hover:text-blue-600">
                            {rack.name}
                          </span>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              rack.usage > 90
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {rack.usage}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              rack.usage > 90 ? "bg-red-500" : "bg-green-500"
                            }`}
                            style={{ width: `${rack.usage}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-4 text-center py-8 text-slate-400 text-sm border-2 border-dashed rounded-lg">
                      No racks in this zone yet.
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="p-12 text-center text-slate-500 border rounded-lg bg-white">
            Inventory List component will go here...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WarehouseDetail;
