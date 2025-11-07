import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Plus, Check, X, AlertTriangle } from "lucide-react";

const InventoryCount = () => {
  const activeSessions = [
    { id: "IC-001", warehouse: "Main Warehouse", zone: "Zone A", status: "in-progress", items: 45, discrepancies: 3 },
    { id: "IC-002", warehouse: "Main Warehouse", zone: "Zone B", status: "pending-approval", items: 62, discrepancies: 8 },
  ];

  const countItems = [
    { id: 1, product: "Product A", sku: "SKU-001", location: "A1-R1-B1", systemQty: 100, physicalQty: 98, variance: -2 },
    { id: 2, product: "Product B", sku: "SKU-002", location: "A1-R1-B2", systemQty: 50, physicalQty: 50, variance: 0 },
    { id: 3, product: "Product C", sku: "SKU-003", location: "A1-R2-B1", systemQty: 75, physicalQty: 80, variance: 5 },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Inventory Count</h1>
          <p className="text-muted-foreground">Physical stock verification and discrepancy management</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Count Session
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Sessions</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="new">New Count</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Count Sessions</CardTitle>
              <CardDescription>Ongoing physical inventory verification</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session ID</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Discrepancies</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.id}</TableCell>
                      <TableCell>{session.warehouse}</TableCell>
                      <TableCell>{session.zone}</TableCell>
                      <TableCell>{session.items}</TableCell>
                      <TableCell>
                        {session.discrepancies > 0 ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {session.discrepancies}
                          </Badge>
                        ) : (
                          <Badge variant="outline">0</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={session.status === "in-progress" ? "default" : "secondary"}>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          {session.status === "pending-approval" && (
                            <>
                              <Button variant="default" size="sm" className="gap-1">
                                <Check className="h-3 w-3" />
                                Approve
                              </Button>
                              <Button variant="destructive" size="sm" className="gap-1">
                                <X className="h-3 w-3" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Count History</CardTitle>
              <CardDescription>Completed inventory count sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">No completed sessions yet</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Count Session</CardTitle>
              <CardDescription>Start a new physical inventory count</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Warehouse</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wh1">Main Warehouse</SelectItem>
                      <SelectItem value="wh2">Secondary Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Zone</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="za">Zone A</SelectItem>
                      <SelectItem value="zb">Zone B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Start Count Session</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Count Entry</CardTitle>
              <CardDescription>Record physical quantities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>System Qty</TableHead>
                    <TableHead>Physical Qty</TableHead>
                    <TableHead>Variance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.product}</div>
                          <div className="text-sm text-muted-foreground">{item.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.systemQty}</TableCell>
                      <TableCell>
                        <Input type="number" defaultValue={item.physicalQty} className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.variance === 0 ? "outline" : item.variance > 0 ? "default" : "destructive"}>
                          {item.variance > 0 ? '+' : ''}{item.variance}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex gap-2">
                <Button>Save & Submit for Approval</Button>
                <Button variant="outline">Save Draft</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryCount;
