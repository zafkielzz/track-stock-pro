import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Calendar } from "lucide-react";

const Reports = () => {
  const reportTypes = [
    { id: "inventory", name: "Inventory Report", description: "Current stock levels by product and location" },
    { id: "stock-in", name: "Stock In History", description: "All receiving transactions" },
    { id: "stock-out", name: "Stock Out History", description: "All dispatch transactions" },
    { id: "transfer", name: "Transfer History", description: "All stock transfer records" },
    { id: "audit", name: "User Activity Log", description: "Complete audit trail of user actions" },
    { id: "low-stock", name: "Low Stock Alert", description: "Products below threshold" },
    { id: "expiring", name: "Expiring Products", description: "Products nearing expiry date" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
        <p className="text-muted-foreground">Generate and export various inventory reports</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Select report type and date range</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select report" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((report) => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input type="date" className="bg-transparent outline-none w-full" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input type="date" className="bg-transparent outline-none w-full" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {report.name}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                Quick Generate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
