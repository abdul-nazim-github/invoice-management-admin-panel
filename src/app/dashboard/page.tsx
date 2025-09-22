
"use client";

import * as React from 'react';
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  IndianRupee,
  Users,
  FileText,
  ArrowRight,
  Package,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { invoices, products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { capitalizeWords } from '@/lib/helpers/forms';
import { DashboardApiResponseTypes, DashboardStatsTypes } from '@/lib/types/dashboard';
import { getRequest } from '@/lib/helpers/axios/RequestService';
import { handleApiError } from '@/lib/helpers/axios/errorHandler';
import { useToast } from '@/hooks/use-toast';
import { InvoiceApiResponseTypes, InvoiceDataTypes } from '@/lib/types/invoices';

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--primary))",
  },
};

export default function DashboardPage() {
  const { toast } = useToast();
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<DashboardStatsTypes>()
  const [invoices, setInvoices] = React.useState<InvoiceDataTypes[]>([]);
  const [statsLoading, setStatsLoading] = React.useState(true)
  const [invoiceLoading, setInvoiceLoading] = React.useState(true)

  const getInvoices = async () => {
      setInvoiceLoading(true);
      try {
        const response: InvoiceApiResponseTypes<InvoiceDataTypes[]> = await getRequest({
          url: "/api/invoices",
          params: {
            page: 1,
            limit: 10,
            recent: true,
          },
        });
        setInvoices(response.data.results || []);
      } catch (err: any) {
        const parsed = handleApiError(err);
        toast({
          title: parsed.title,
          description: parsed.description,
          variant: "destructive",
        });
      } finally {
        setInvoiceLoading(false);
      }
    };

  const getStats = async () => {
    setStatsLoading(true);
    try {
      const response: DashboardApiResponseTypes<DashboardStatsTypes> = await getRequest({
        url: "/api/dashboard/stats"
      });
      setStats(response.data.results);
    } catch (err: any) {
      const parsed = handleApiError(err);
      toast({
        title: parsed.title,
        description: parsed.description,
        variant: "destructive",
      });
    } finally {
      setStatsLoading(false);
    }
  };

  React.useEffect(() => {
    // This should be done on the client side to avoid hydration errors.
    getStats()
    getInvoices()
    setChartData([
      { month: "January", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "February", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "March", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "April", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "May", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "June", total: Math.floor(Math.random() * 5000) + 1000 },
    ]);
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Link href="/dashboard/reports">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline"><IndianRupee className="h-5 w-5" />{stats?.total_revenue}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.revenue_change_percent}% from last month
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/customers">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{stats?.total_customers}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.customers_change_percent}% from last month
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/invoices">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{stats?.pending_invoices}</div>
              <p className="text-xs text-muted-foreground">
                from a total of {stats?.total_invoices}
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/products">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{stats?.total_products}</div>
              <p className="text-xs text-muted-foreground">
                Across all categories
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Sales Performance</CardTitle>
            <CardDescription>
              Your sales performance over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recent Invoices</CardTitle>
            <CardDescription>
              A list of your most recent invoices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="font-medium">{capitalizeWords(invoice.customer_full_name)}</div>
                      <div className="text-sm text-muted-foreground">
                        {invoice.customer_full_name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>₹{invoice.total_amount}</div>
                      {invoice.status !== 'Paid' && (
                        <div className="text-xs text-muted-foreground">
                          Due: ₹{invoice.due_amount}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          invoice.status === "Paid"
                            ? "default"
                            : invoice.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="capitalize"
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/invoices">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
