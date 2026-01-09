import { useEffect, useState } from "react";
import { Plus, Search, Filter, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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

// --- LOGIC PHÂN TRANG ) ---
const generatePagination = (currentPage: number, totalPages: number) => {
  // Nếu tổng trang <= 7, hiện tất cả
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Nếu đang ở mấy trang đầu (1, 2, 3)
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  // Nếu đang ở mấy trang cuối
  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // Nếu đang ở giữa
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

interface IProduct {
  id: string;
  name: string;
  category: string;
  stock: number;
  storage_unit: number;
  min_stock: number;
}

const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  // Giả lập nhiều dữ liệu để test scroll
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 10;
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

  const totalPages = Math.ceil(products.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const currentPageProducts = products.slice(start, end);

  const Pagination = ({
    page,
    totalPages,
    onPageChange,
  }: {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
  }) => {
    const pageNumbers = generatePagination(page, totalPages);
    const [inputVal, setInputVal] = useState("");
    const handleGo = () => {
      const pageNumber = parseInt(inputVal);
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        onPageChange(pageNumber);
        setInputVal(""); // Clear after go
      }
    };
    return (
      <div className="flex flex-col items-end gap-2 w-full">
        {/* ⭐ Dòng 1: Pagination */}
        <div className="flex items-center justify-end gap-1 w-full">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>

          {pageNumbers.map((p, index) => (
            <Button
              key={index}
              variant={p === page ? "default" : "outline"}
              size="sm"
              disabled={p === "..."}
              onClick={() => typeof p === "number" && onPageChange(p)}
              className={
                p === "..."
                  ? "cursor-default border-none hover:bg-transparent"
                  : ""
              }
            >
              {p}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>

        {/* ⭐ Dòng 2: Go to (xuống dòng, nằm bên phải) */}
        <div className="flex items-center justify-end gap-2 w-full">
          <p className="text-sm text-muted-foreground">Go to</p>
          <Input
            className="w-16 h-8"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGo()}
          />
        </div>
      </div>
    );
  };

  const getStatusBadge = (variance: number) => {
    if (variance > 10) return <Badge className="bg-green-600">In Stock</Badge>;
    if (variance > 0) return <Badge className="bg-yellow-600">Low Stock</Badge>;
    return <Badge variant="destructive">Out of Stock</Badge>;
  };

  const handleDelete = async (id: string) => {
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    // FIX LAYOUT: set chiều cao cố định cho container cha (ví dụ h-screen trừ đi header)
    // Hoặc set h-[600px] để test
    <div className="p-8 h-[calc(100vh-100px)] flex flex-col space-y-6">
      {/* Header Section (Giữ nguyên chiều cao tự nhiên) */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/products/new")}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* CARD CHÍNH - FIX CSS FLEXBOX */}
      <Card className="flex flex-col flex-1 overflow-hidden shadow-md">
        {/* Header Search (Cố định ở trên) */}
        <CardHeader className="border-b py-4">
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

        {/* Content Table (Tự động co giãn và scroll) */}
        <CardContent className="flex-1 overflow-y-auto p-0">
          <Table>
            <TableHeader className="sticky top-0  z-10 shadow-sm">
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Min</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                currentPageProducts.map((product) => (
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="border-t py-4 flex-shrink-0 flex flex-col gap-3">
          <div className="w-full flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Showing{" "}
              <strong>
                {start + 1}-{Math.min(end, products.length)}
              </strong>{" "}
              of <strong>{products.length}</strong> products
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Products;
