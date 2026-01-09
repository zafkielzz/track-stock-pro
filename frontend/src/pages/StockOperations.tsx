import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight } from "lucide-react";

const StockOperations = () => {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Stock Operations</h1>
        <p className="text-muted-foreground">Manage stock in, out, and transfers</p>
      </div>

      <Tabs defaultValue="stock-in" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="stock-in" className="gap-2">
            <ArrowDownToLine className="h-4 w-4" />
            Stock In
          </TabsTrigger>
          <TabsTrigger value="stock-out" className="gap-2">
            <ArrowUpFromLine className="h-4 w-4" />
            Stock Out
          </TabsTrigger>
          <TabsTrigger value="transfer" className="gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            Transfer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stock-in">
          <Card>
            <CardHeader>
              <CardTitle>Stock In</CardTitle>
              <CardDescription>Record incoming stock to your warehouse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product</Label>
                  <Select>
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="p1">Product Alpha</SelectItem>
                      <SelectItem value="p2">Product Beta</SelectItem>
                      <SelectItem value="p3">Product Gamma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="Enter quantity" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="warehouse">Warehouse</Label>
                  <Select>
                    <SelectTrigger id="warehouse">
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="w1">Main Warehouse</SelectItem>
                      <SelectItem value="w2">North Distribution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="l1">Zone A - Rack 1 - Bin 01</SelectItem>
                      <SelectItem value="l2">Zone A - Rack 1 - Bin 02</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Select>
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="return">Customer Return</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Submit Stock In</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock-out">
          <Card>
            <CardHeader>
              <CardTitle>Stock Out</CardTitle>
              <CardDescription>Record outgoing stock from your warehouse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-out">Product</Label>
                  <Select>
                    <SelectTrigger id="product-out">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="p1">Product Alpha</SelectItem>
                      <SelectItem value="p2">Product Beta</SelectItem>
                      <SelectItem value="p3">Product Gamma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity-out">Quantity</Label>
                  <Input id="quantity-out" type="number" placeholder="Enter quantity" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="warehouse-out">Warehouse</Label>
                  <Select>
                    <SelectTrigger id="warehouse-out">
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="w1">Main Warehouse</SelectItem>
                      <SelectItem value="w2">North Distribution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location-out">From Location</Label>
                  <Select>
                    <SelectTrigger id="location-out">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="l1">Zone A - Rack 1 - Bin 01</SelectItem>
                      <SelectItem value="l2">Zone A - Rack 1 - Bin 02</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason-out">Reason</Label>
                <Select>
                  <SelectTrigger id="reason-out">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                    <SelectItem value="return">Return to Supplier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Submit Stock Out</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer">
          <Card>
            <CardHeader>
              <CardTitle>Stock Transfer</CardTitle>
              <CardDescription>Transfer stock between warehouses or locations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-transfer">Product</Label>
                  <Select>
                    <SelectTrigger id="product-transfer">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="p1">Product Alpha</SelectItem>
                      <SelectItem value="p2">Product Beta</SelectItem>
                      <SelectItem value="p3">Product Gamma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity-transfer">Quantity</Label>
                  <Input id="quantity-transfer" type="number" placeholder="Enter quantity" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>From</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="w1">Main Warehouse</SelectItem>
                      <SelectItem value="w2">North Distribution</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="l1">Zone A - Rack 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>To</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="w1">Main Warehouse</SelectItem>
                      <SelectItem value="w2">North Distribution</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="l1">Zone B - Rack 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="w-full">Submit Transfer</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockOperations;
