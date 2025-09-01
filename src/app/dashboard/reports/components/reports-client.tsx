
"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts";

export const salesData = [
    { date: "2023-05-01", sales: 2500 },
    { date: "2023-05-02", sales: 2800 },
    { date: "2023-05-03", sales: 2200 },
    { date: "2023-05-04", sales: 3100 },
    { date: "2023-05-05", sales: 3500 },
    { date: "2023-05-06", sales: 3000 },
    { date: "2023-05-07", sales: 4000 },
    { date: "2023-05-08", sales: 4200 },
    { date: "2023-05-09", sales: 3800 },
    { date: "2023-05-10", sales: 4500 },
];

export const topProductsData = [
  { name: "Cloud Service", sales: 150 },
  { name: "API Development", sales: 120 },
  { name: "Maintenance", sales: 90 },
  { name: "UX/UI Design", sales: 80 },
  { name: "Consulting", sales: 110 },
];

const lineChartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
};

const barChartConfig = {
  sales: {
    label: "Sales Count",
    color: "hsl(var(--chart-2))",
  },
};

export function ReportsClient() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2023, 4, 1),
    to: addDays(new Date(2023, 4, 1), 9),
  });

  return (
    <>
      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₹35,231.89</div>
            <p className="text-xs text-muted-foreground">+10.1% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">573</div>
             <p className="text-xs text-muted-foreground">+21 from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Invoice Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₹61.50</div>
             <p className="text-xs text-muted-foreground">-5.2% from last period</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Selling Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline truncate">Cloud Service</div>
             <p className="text-xs text-muted-foreground">150 units sold</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Sales Revenue</CardTitle>
            <CardDescription>Revenue over the selected date range.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={lineChartConfig} className="h-[300px] w-full">
              <LineChart accessibilityLayer data={salesData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => format(new Date(value), "MMM dd")}
                />
                 <YAxis
                    tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Line
                  dataKey="sales"
                  type="monotone"
                  stroke="var(--color-sales)"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Top Selling Products</CardTitle>
            <CardDescription>
              Products with the most sales in the period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={topProductsData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  className="w-20"
                />
                <XAxis dataKey="sales" type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="sales" layout="vertical" fill="var(--color-sales)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
