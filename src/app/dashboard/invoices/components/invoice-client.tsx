
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Invoice } from "@/lib/types";

export function InvoiceClient({
  invoices: initialInvoices,
}: {
  invoices: Invoice[];
}) {
  const [invoices, setInvoices] = React.useState(initialInvoices);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  React.useEffect(() => {
    setInvoices(initialInvoices);
  }, [initialInvoices]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  }

  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(invoice => 
        invoice.id === invoiceId ? { ...invoice, status: "Paid" } : invoice
      )
    );
  };

  const filteredInvoices = invoices
    .filter((invoice) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        invoice.invoiceNumber.toLowerCase().includes(lowerSearchTerm) ||
        invoice.customer.name.toLowerCase().includes(lowerSearchTerm)
      );
    })
    .filter((invoice) => {
      if (activeTab === "all") return true;
      return invoice.status.toLowerCase() === activeTab;
    });

  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  
  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  }
  
  const startInvoice = filteredInvoices.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endInvoice = Math.min(currentPage * rowsPerPage, filteredInvoices.length);


  return (
    <Tabs defaultValue="all" onValueChange={handleTabChange} className="w-full">
      <div className="flex items-center justify-between gap-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
            <div className="relative flex-1 md:grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search invoices..."
                    className="w-full rounded-lg bg-background pl-10 md:w-[200px] lg:w-[336px]"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
          <Button asChild size="sm" className="h-8 gap-1">
            <Link href="/dashboard/invoices/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Create Invoice
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value={activeTab}>
      <Card className="mt-4">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>{invoice.customer.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(invoice.date).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{invoice.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Download PDF</DropdownMenuItem>
                         {invoice.status !== 'Paid' && (
                          <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)}>
                            Mark as Paid
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
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
        <CardFooter>
           <div className="flex items-center justify-between w-full">
              <div className="text-xs text-muted-foreground">
                  Showing <strong>{startInvoice}-{endInvoice}</strong> of{" "}
                  <strong>{filteredInvoices.length}</strong> invoices
              </div>
              <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Rows per page</span>
                      <Select value={String(rowsPerPage)} onValueChange={handleRowsPerPageChange}>
                          <SelectTrigger className="h-8 w-[70px]">
                              <SelectValue placeholder={String(rowsPerPage)} />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="30">30</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="text-xs text-muted-foreground">
                      Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                      <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handlePreviousPage}
                          disabled={currentPage === 1}
                      >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous page</span>
                      </Button>
                      <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                      >
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Next page</span>
                      </Button>
                  </div>
              </div>
          </div>
        </CardFooter>
      </Card>
      </TabsContent>
    </Tabs>
  );
}
