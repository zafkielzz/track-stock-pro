import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Send, Check, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type CountStatus = "draft" | "in_progress" | "review" | "completed";

interface CountItem {
  id: string;
  product_id: string;
  product_name: string;
  location: string;
  system_qty: number | null;
  actual_qty: number;
}

const InventoryCountDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<CountStatus>("draft");

  // Mock data
  const [items, setItems] = useState<CountItem[]>([
    {
      id: "1",
      product_id: "P001",
      product_name: "Product Alpha",
      location: "A-01-05",
      system_qty: null,
      actual_qty: 0,
    },
    {
      id: "2",
      product_id: "P002",
      product_name: "Product Beta",
      location: "A-02-10",
      system_qty: null,
      actual_qty: 0,
    },
    {
      id: "3",
      product_id: "P003",
      product_name: "Product Gamma",
      location: "B-01-03",
      system_qty: null,
      actual_qty: 0,
    },
  ]);

  const handleStartCounting = () => {
    // Simulate freezing stock and capturing system_qty
    const updatedItems = items.map((item) => ({
      ...item,
      system_qty: Math.floor(Math.random() * 500) + 50, // Mock current stock
    }));
    setItems(updatedItems);
    setStatus("in_progress");
    toast.success("Counting started! System quantities captured.");
  };

  const handleSubmit = () => {
    if (items.some((item) => item.actual_qty === 0)) {
      toast.error("Please count all products before submitting.");
      return;
    }
    setStatus("review");
    toast.success("Count submitted for review.");
  };

  const handleApprove = () => {
    setStatus("completed");
    toast.success("Count approved! Inventory updated successfully.");
  };

  const handleActualQtyChange = (itemId: string, value: string) => {
    const qty = parseInt(value) || 0;
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, actual_qty: qty } : item
      )
    );
  };

  const calculateDifference = (item: CountItem) => {
    if (item.system_qty === null) return 0;
    return item.actual_qty - item.system_qty;
  };

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

  const canEdit = status === "in_progress";
  const showSystemQty = status !== "draft";

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/inventory-count")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">IC-2024-{id}</h1>
            {getStatusBadge(status)}
          </div>
          <p className="text-muted-foreground">
            Main Warehouse • Created on Jan 18, 2024
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {status === "draft" && (
            <Button onClick={handleStartCounting} className="gap-2">
              <Play className="w-4 h-4" />
              Start Counting
            </Button>
          )}
          {status === "in_progress" && (
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="w-4 h-4" />
              Submit for Review
            </Button>
          )}
          {status === "review" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="gap-2">
                  <Check className="w-4 h-4" />
                  Approve Count
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approve Inventory Count?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will update the main inventory with the counted
                    quantities. All differences will be logged as adjustments.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleApprove}>
                    Approve
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Instructions */}
      {status === "in_progress" && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-primary">
            <strong>Instructions:</strong> Enter the actual quantity counted for
            each product. The difference will be calculated automatically. Red
            values indicate discrepancies.
          </p>
        </div>
      )}

      {/* Add Product Button */}
      {canEdit && (
        <div className="mb-4">
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product to Count
          </Button>
        </div>
      )}

      {/* Counting Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground w-24">
                Product ID
              </TableHead>
              <TableHead className="text-muted-foreground">
                Product Name
              </TableHead>
              <TableHead className="text-muted-foreground w-32">
                Location
              </TableHead>
              {showSystemQty && (
                <TableHead className="text-muted-foreground w-32 text-right">
                  System Qty
                </TableHead>
              )}
              <TableHead className="text-muted-foreground w-32 text-right">
                Actual Qty
              </TableHead>
              {showSystemQty && (
                <TableHead className="text-muted-foreground w-32 text-right">
                  Difference
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const diff = calculateDifference(item);
              return (
                <TableRow key={item.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    {item.product_id}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {item.product_name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.location}
                  </TableCell>
                  {showSystemQty && (
                    <TableCell className="text-right text-foreground font-medium">
                      {item.system_qty}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    {canEdit ? (
                      <Input
                        type="number"
                        min="0"
                        value={item.actual_qty || ""}
                        onChange={(e) =>
                          handleActualQtyChange(item.id, e.target.value)
                        }
                        className="text-right"
                      />
                    ) : (
                      <span className="text-foreground font-medium">
                        {item.actual_qty}
                      </span>
                    )}
                  </TableCell>
                  {showSystemQty && (
                    <TableCell className="text-right">
                      <span
                        className={
                          diff !== 0
                            ? "text-destructive font-bold"
                            : "text-muted-foreground"
                        }
                      >
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      {status === "review" || status === "completed" ? (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Products</p>
            <p className="text-2xl font-bold text-foreground">{items.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">
              Products with Differences
            </p>
            <p className="text-2xl font-bold text-destructive">
              {items.filter((item) => calculateDifference(item) !== 0).length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">
              Total Adjustment
            </p>
            <p className="text-2xl font-bold text-foreground">
              {items.reduce(
                (sum, item) => sum + Math.abs(calculateDifference(item)),
                0
              )}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InventoryCountDetail;
