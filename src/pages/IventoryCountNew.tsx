import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface SelectedProduct {
  id: string;
  product_id: string;
  product_name: string;
  location: string;
}

const InventoryCountNew = () => {
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );

  // Mock products
  const availableProducts = [
    { id: "1", product_id: "P001", name: "Product Alpha", location: "A-01-05" },
    { id: "2", product_id: "P002", name: "Product Beta", location: "A-02-10" },
    { id: "3", product_id: "P003", name: "Product Gamma", location: "B-01-03" },
    { id: "4", product_id: "P004", name: "Product Delta", location: "B-02-07" },
    {
      id: "5",
      product_id: "P005",
      name: "Product Epsilon",
      location: "C-01-02",
    },
  ];

  const handleAddProduct = (productId: string) => {
    const product = availableProducts.find((p) => p.id === productId);
    if (product && !selectedProducts.find((p) => p.id === productId)) {
      setSelectedProducts([
        ...selectedProducts,
        {
          id: product.id,
          product_id: product.product_id,
          product_name: product.name,
          location: product.location,
        },
      ]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const handleCreateDraft = () => {
    if (!warehouse) {
      toast.error("Please select a warehouse");
      return;
    }
    if (selectedProducts.length === 0) {
      toast.error("Please add at least one product to count");
      return;
    }

    toast.success("Draft count created successfully!");
    // In real app, this would save to database and redirect to the detail page
    navigate("/inventory-count");
  };

  return (
    // <div className="flex min-h-screen bg-background">
    <div className="p-8 ">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/inventory-count")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            New Inventory Count
          </h1>
          <p className="text-muted-foreground">Create a new counting session</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Warehouse Selection */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="warehouse">Warehouse</Label>
              <Select value={warehouse} onValueChange={setWarehouse}>
                <SelectTrigger id="warehouse" className="mt-1.5">
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wh001">Main Warehouse</SelectItem>
                  <SelectItem value="wh002">
                    North Distribution Center
                  </SelectItem>
                  <SelectItem value="wh003">South Storage Facility</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Product Selection */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Products to Count
          </h2>

          {/* Add Product Dropdown */}
          <div className="mb-4">
            <Label>Add Product</Label>
            <Select onValueChange={handleAddProduct}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select product to add" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts
                  .filter((p) => !selectedProducts.find((sp) => sp.id === p.id))
                  .map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.product_id} - {product.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Products List */}
          <div className="space-y-2">
            {selectedProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No products added yet. Select products from the dropdown above.
              </div>
            ) : (
              selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between bg-secondary/50 border border-border rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {product.product_id} - {product.product_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Location: {product.location}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveProduct(product.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => navigate("/inventory-count")}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateDraft}>Create Draft</Button>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default InventoryCountNew;
