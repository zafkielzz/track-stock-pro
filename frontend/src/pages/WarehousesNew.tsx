import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface Warehouse {
  warehouse_id: string;
  warehouse_name: string;
  address: string;
  manager: string;
  type: string;
  max_capacity: number;
}

const WarehousesNew = () => {
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState<Warehouse>({
    warehouse_id: "",
    warehouse_name: "",
    address: "",
    manager: "",
    type: "",
    max_capacity: 0,
  });

  const handleAddWarehouse = () => {
    if (!warehouse.warehouse_id) {
      toast.error("Please enter Warehouse ID");
      return;
    }
    if (!warehouse.warehouse_name) {
      toast.error("Please enter Warehouse name");
      return;
    }
    if (!warehouse.address) {
      toast.error("Please enter address of warehouse");
      return;
    }
    if (!warehouse.manager) {
      toast.error("Please choose warehouse manager");
      return;
    }
    if (
      !warehouse.max_capacity ||
      isNaN(warehouse.max_capacity) ||
      warehouse.max_capacity < 100
    ) {
      toast.error("Please enter valid max capacity");
      return;
    }
    if (!warehouse.type) {
      toast.error("Please choose warehouse type");
      return;
    }

    toast.success("Add new product successfully!");
    navigate("/warehouses");
  };
  console.log(warehouse);
  return (
    <div className="p-8 ">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/warehouses")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Add new warehouse
          </h1>
          <p className="text-muted-foreground">
            Add new products to the inventory
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Warehouse Information
          </h2>
          <div>
            <Label>Warehouse ID</Label>
            <Input
              placeholder="WH001"
              onChange={(e) => {
                const value = e.target.value;
                setWarehouse({
                  ...warehouse,
                  warehouse_id: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <Label>Warehouse name</Label>
            <Input
              placeholder="ABC"
              onChange={(e) => {
                const value = e.target.value;
                setWarehouse({
                  ...warehouse,
                  warehouse_name: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <Label> Address (sẽ update dùng API tỉnh huyện xã )</Label>
            <Input
              placeholder="Thanh hoa"
              onChange={(e) => {
                const value = e.target.value;
                setWarehouse({
                  ...warehouse,
                  address: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <Label>
              Manager (sẽ update 1 thanh searchable và tìm tất cả các manager)
            </Label>
            <Input
              placeholder="Anh do cao bang"
              onChange={(e) => {
                const value = e.target.value;
                setWarehouse({
                  ...warehouse,
                  manager: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <Label>Max Capacity </Label>
            <Input
              placeholder="1000"
              onChange={(e) => {
                const value = e.target.value;

                setWarehouse({
                  ...warehouse,
                  max_capacity: Number(value.replace(/\s+/g, "")),
                });
              }}
            />
          </div>
          <div>
            <Label>Type</Label>
            <Select
              value={warehouse.type}
              onValueChange={(value) =>
                setWarehouse({ ...warehouse, type: value })
              }
            >
              <SelectTrigger id="type" className="mt-1.5">
                <SelectValue placeholder="Select warehouse type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="t001">General Warehouse</SelectItem>
                <SelectItem value="t002">Cold Storage</SelectItem>
                <SelectItem value="t003">Bonded Warehouse</SelectItem>
                <SelectItem value="t004">Distribution Center</SelectItem>
                <SelectItem value="t005">Raw Materials Warehouse</SelectItem>
                <SelectItem value="t006">Finished Goods Warehouse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4"></div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => navigate("/warehouses")}>
            Cancel
          </Button>
          <Button onClick={handleAddWarehouse}>Add product</Button>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default WarehousesNew;
