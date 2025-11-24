import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Warehouse {
  warehouse_id: string;
  warehouse_name: string;
  address: string;
  manager: string;
  type: string;
  capacity: number;
}

const WarehousesNew = () => {
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState<Warehouse>({
    warehouse_id: "",
    warehouse_name: "",
    address: "",
    manager: "",
    type: "",
    capacity: 0,
  });

  const handleAddWarehouse = () => {
    if (!warehouse.warehouse_id) {
      toast.error("Please enter Warehouse ID");
      return;
    }
    // if (!warehouse.address) {
    //   toast.error("Please enter Product name");
    //   return;
    // }
    // if (!product.category) {
    //   toast.error("Please enter category");
    //   return;
    // }

    // if (!product.min_stock || isNaN(product.min_stock)) {
    //   toast.error("Please enter valid min stock");
    //   return;
    // }

    toast.success("Add new product successfully!");
    navigate("/products");
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
          {/* <p className="text-muted-foreground">
            Add new products to the inventory
          </p> */}
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
            <Label> Address</Label>
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
            <Label>Manager</Label>
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
            <Label>Type</Label>
            <Input
              placeholder="36"
              onChange={(e) => {
                const value = e.target.value;
                setWarehouse({
                  ...warehouse,
                  type: e.target.value,
                });
              }}
            />
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
