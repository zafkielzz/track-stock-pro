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
import productService from "../services/productService";
interface Product {
  id: string;
  name: string;
  category: string;
  storage_unit: number;
  min_stock: number;
}

const ProductsNew = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>({
    id: "",
    name: "",
    category: "",
    storage_unit: 0,
    min_stock: 0,
  });
  const fields = [
    {
      id: "id",
      label: "Product ID",
      placeholder: "A001",
      type: "text",
    },
    {
      id: "name",
      label: "Product Name",
      placeholder: "Product A",
      type: "text",
    },

    {
      id: "storage_unit",
      label: "Storage Unit",
      placeholder: "1",
      type: "number",
    },
    { id: "min_stock", label: "Min Stock", placeholder: "10", type: "number" },
  ];
  const handleAddProduct = () => {
    if (!product.id) {
      toast.error("Please enter Product ID");
      return;
    }
    if (!product.name) {
      toast.error("Please enter Product name");
      return;
    }
    if (!product.category) {
      toast.error("Please choose category");
      return;
    }

    if (isNaN(product.min_stock)) {
      toast.error("Please enter valid min stock");
      return;
    }
    if (isNaN(product.storage_unit) || product.storage_unit >= 1000) {
      toast.error("Please enter valid storage unit");
      return;
    }
    productService.create(product);
    setProduct({
      id: "",
      name: "",
      category: "",
      storage_unit: 0,
      min_stock: 0,
    });
    toast.success("Add new product successfully!");
    navigate("/products");
  };
  console.log(product);
  return (
    <div className="p-8 ">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Add new product
          </h1>
          <p className="text-muted-foreground">
            Add new products to the inventory
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Product Information
          </h2>
          {fields.map((f) => (
            <div key={f.id}>
              <Label htmlFor={f.id}>{f.label}</Label>
              <Input
                id={f.id}
                placeholder={f.placeholder}
                onChange={(e) => {
                  const value = e.target.value;
                  setProduct({
                    ...product,
                    [f.id]:
                      f.type === "number"
                        ? Number(value.replace(/\s+/g, ""))
                        : value,
                  });
                }}
              />
            </div>
          ))}
          <Label> Category</Label>
          <Select
            value={product.category}
            onValueChange={(value) =>
              setProduct({ ...product, category: value })
            }
          >
            <SelectTrigger id="type" className="mt-1.5">
              <SelectValue placeholder="Select product category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="c001">Electronics</SelectItem>
              <SelectItem value="c002">Furniture</SelectItem>
              <SelectItem value="c003">Tools</SelectItem>
              <SelectItem value="c004">Supplies</SelectItem>
            </SelectContent>
          </Select>
          <div className="space-y-4"></div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => navigate("/products")}>
            Cancel
          </Button>
          <Button onClick={handleAddProduct}>Add product</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductsNew;
