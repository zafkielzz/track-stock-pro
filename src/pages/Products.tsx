import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Filter, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import productService from "../services/productService";

// --- LOGIC PHÂN TRANG ---
const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
  if (currentPage >= totalPages - 2)
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];

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

type ProductForm = {
  name: string;
  category: string;
  storage_unit: number;
  min_stock: number;
};

const normalizeProduct = (p: any): IProduct => ({
  ...p,
  stock: p.stock ?? 0,
  storage_unit: p.storage_unit ?? 1,
  min_stock: p.min_stock ?? 10,
});

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [loading, setLoading] = useState(false);
  const CATEGORY_OPTIONS = ["c001", "c002", "c003", "c004", "c005"];
  const MAP_CATEGORY = {
    c001: "Electronics",
    c002: "Furniture",
    c003: "Tools",
    c004: "Supplies",
    c005: "Other",
  };

  // Dialog edit
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    category: "",
    storage_unit: 1,
    min_stock: 10,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAll();
        const list = (response.data ?? []).map(normalizeProduct);
        setProducts(list);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) => {
      const categoryName =
        (MAP_CATEGORY as any)[p.category]?.toLowerCase() ?? "";

      return (
        (p.id ?? "").toLowerCase().includes(q) ||
        (p.name ?? "").toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q) ||
        categoryName.includes(q)
      );
    });
  }, [products, searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const currentPageProducts = filteredProducts.slice(start, end);
  console.log(formData);
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
      const pageNumber = parseInt(inputVal, 10);
      if (
        !Number.isNaN(pageNumber) &&
        pageNumber >= 1 &&
        pageNumber <= totalPages
      ) {
        onPageChange(pageNumber);
        setInputVal("");
      }
    };

    return (
      <div className="flex flex-col items-end gap-2 w-full">
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

  const openEdit = (product: IProduct) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name ?? "",
      category: product.category ?? "",
      storage_unit: product.storage_unit ?? 1,
      min_stock: product.min_stock ?? 10,
    });
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setSelectedProduct(null);
    setFormData({ name: "", category: "", storage_unit: 1, min_stock: 10 });
    setSaving(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "storage_unit" || name === "min_stock" ? Number(value) : value,
    }));
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        storage_unit: Number(formData.storage_unit) || 1,
        min_stock: Number(formData.min_stock) || 10,
      };

      const res = await productService.update(selectedProduct.id, payload);
      const updatedFromServer = normalizeProduct(res.data);

      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? updatedFromServer : p))
      );

      closeEdit();
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  return (
    <div className="p-8 h-[calc(100vh-100px)] flex flex-col space-y-6">
      {/* Header */}
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

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => (open ? setIsEditOpen(true) : closeEdit())}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
            <DialogDescription>
              {selectedProduct
                ? `Editing ID: ${selectedProduct.id}`
                : "Select a product to edit."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitEdit} className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Product name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                minLength={3}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>

              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {MAP_CATEGORY[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Unit</label>
              <Input
                name="storage_unit"
                type="number"
                value={formData.storage_unit}
                onChange={handleFormChange}
                min={1}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Min stock
              </label>
              <Input
                name="min_stock"
                type="number"
                value={formData.min_stock}
                onChange={handleFormChange}
                min={0}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeEdit}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving || !selectedProduct}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Main Card */}
      <Card className="flex flex-col flex-1 overflow-hidden shadow-md">
        <CardHeader className="border-b py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

        <CardContent className="flex-1 overflow-y-auto p-0">
          <Table>
            <TableHeader className="sticky top-0 z-10 shadow-sm">
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : currentPageProducts.length > 0 ? (
                currentPageProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{MAP_CATEGORY[product.category]}</TableCell>
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
                          <DropdownMenuItem onClick={() => openEdit(product)}>
                            Edit
                          </DropdownMenuItem>
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
                {filteredProducts.length === 0 ? 0 : start + 1}-
                {Math.min(end, filteredProducts.length)}
              </strong>{" "}
              of <strong>{filteredProducts.length}</strong> products
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
