import { useEffect, useState } from "react";
import { Plus, Search, Filter, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import productService from "../services/productService";
interface IProduct {
  id: string;
  name: string;
  category: string;
  stock: number;
  storage_unit: number;
  min_stock: number;
}
const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([
    {
      id: "",
      name: "",
      category: "",
      stock: 0,
      storage_unit: 1,
      min_stock: 10,
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll();
        const productsWithDefaultStock = response.data.map((p: IProduct) => ({
          ...p,
          stock: p.stock ?? 0,
          storage_unit: (p.storage_unit ?? 0) || 1,
          min_stock: (p.min_stock ?? 0) || 10,
        }));
        setProducts(productsWithDefaultStock);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const getStatusBadge = (variance: number) => {
    if (variance > 10) {
      return (
        <Badge variant="default" className="bg-success">
          In Stock
        </Badge>
      );
    } else if (variance > 0) {
      return (
        <Badge variant="default" className="bg-warning">
          Low Stock
        </Badge>
      );
    } else {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
  };
  const navigate = useNavigate();
  const handleDelete = async (id: string) => {
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/products/new")}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Storage Unit</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.storage_unit}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.min_stock}</TableCell>
                  <TableCell>
                    {getStatusBadge(product.stock - product.min_stock)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Print Barcode</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
