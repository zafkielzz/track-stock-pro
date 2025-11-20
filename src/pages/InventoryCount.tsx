import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, MoreVertical, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

type CountStatus = "draft" | "in_progress" | "review" | "completed";

interface InventoryCount {
  id: string;
  count_number: string;
  warehouse: string;
  created_by: string;
  created_at: string;
  status: CountStatus;
  products_count: number;
  differences: number;
}

const InventoryCount = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const counts: InventoryCount[] = [
    {
      id: "1",
      count_number: "IC-2024-001",
      warehouse: "Main Warehouse",
      created_by: "Admin User",
      created_at: "2024-01-15",
      status: "completed",
      products_count: 45,
      differences: 3,
    },
    {
      id: "2",
      count_number: "IC-2024-002",
      warehouse: "North Distribution Center",
      created_by: "John Doe",
      created_at: "2024-01-16",
      status: "in_progress",
      products_count: 32,
      differences: 0,
    },
    {
      id: "3",
      count_number: "IC-2024-003",
      warehouse: "South Storage Facility",
      created_by: "Jane Smith",
      created_at: "2024-01-17",
      status: "review",
      products_count: 28,
      differences: 5,
    },
    {
      id: "4",
      count_number: "IC-2024-004",
      warehouse: "Main Warehouse",
      created_by: "Admin User",
      created_at: "2024-01-18",
      status: "draft",
      products_count: 15,
      differences: 0,
    },
  ];

  const getStatusBadge = (status: CountStatus) => {
    const variants = {
      draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
      in_progress: {
        label: "In Progress",
        className: "bg-primary/20 text-primary",
      },
      review: { label: "Review", className: "bg-warning/20 text-warning" },
      completed: {
        label: "Completed",
        className: "bg-success/20 text-success",
      },
    };

    const variant = variants[status];
    return (
      <Badge className={variant.className} variant="secondary">
        {variant.label}
      </Badge>
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Inventory Count
          </h1>
          <p className="text-muted-foreground">
            Manage inventory counting sessions
          </p>
        </div>
        <Button
          onClick={() => navigate("/inventory-count/new")}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Count
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search counts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">
                Count Number
              </TableHead>
              <TableHead className="text-muted-foreground">Warehouse</TableHead>
              <TableHead className="text-muted-foreground">
                Created By
              </TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">Products</TableHead>
              <TableHead className="text-muted-foreground">
                Differences
              </TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {counts.map((count) => (
              <TableRow key={count.id} className="border-border">
                <TableCell className="font-medium text-foreground">
                  {count.count_number}
                </TableCell>
                <TableCell className="text-foreground">
                  {count.warehouse}
                </TableCell>
                <TableCell className="text-foreground">
                  {count.created_by}
                </TableCell>
                <TableCell className="text-foreground">
                  {count.created_at}
                </TableCell>
                <TableCell className="text-foreground">
                  {count.products_count}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      count.differences > 0
                        ? "text-destructive font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {count.differences}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(count.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigate(`/inventory-count/${count.id}`)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryCount;
