import { useState } from "react";
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
const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    {
      id: "P001",
      name: "Product Alpha",
      category: "Electronics",
      stock: 450,
      minStock: 100,
      status: "In Stock",
    },
    {
      id: "P002",
      name: "Product Beta",
      category: "Furniture",
      stock: 23,
      minStock: 50,
      status: "Low Stock",
    },
    {
      id: "P003",
      name: "Product Gamma",
      category: "Tools",
      stock: 0,
      minStock: 75,
      status: "Out of Stock",
    },
    {
      id: "P004",
      name: "Product Delta",
      category: "Electronics",
      stock: 850,
      minStock: 200,
      status: "In Stock",
    },
    {
      id: "P005",
      name: "Product Epsilon",
      category: "Supplies",
      stock: 320,
      minStock: 150,
      status: "In Stock",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return (
          <Badge variant="default" className="bg-success">
            In Stock
          </Badge>
        );
      case "Low Stock":
        return (
          <Badge variant="default" className="bg-warning">
            Low Stock
          </Badge>
        );
      case "Out of Stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  const navigate = useNavigate();

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
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.minStock}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
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
                        <DropdownMenuItem className="text-destructive">
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
