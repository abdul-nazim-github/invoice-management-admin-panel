
"use client";

import * as React from "react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  MessageSquareQuote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Customer } from "@/lib/types";
import { CustomerForm } from "./customer-form";
import { InsightsDialog } from "./insights-dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export function CustomerClient({ customers: initialCustomers }: { customers: Customer[] }) {
  const [customers, setCustomers] = React.useState(initialCustomers);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [activeTab, setActiveTab] = React.useState("all");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  }

  const handleMarkAsPaid = (customerId: string) => {
    setCustomers(prevCustomers => 
      prevCustomers.map(customer => 
        customer.id === customerId ? { ...customer, status: "Paid" } : customer
      )
    );
  };

  const filteredCustomers = customers
    .filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((customer) => {
      if (activeTab === "all") return true;
      return customer.status?.toLowerCase() === activeTab;
    });


  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
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
  };

  const startCustomer = filteredCustomers.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endCustomer = Math.min(currentPage * rowsPerPage, filteredCustomers.length);

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleGetInsights = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsInsightsOpen(true);
  };

  return (
    <>
      <Tabs defaultValue="all" onValueChange={handleTabChange}>
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
                        placeholder="Search customers..."
                        className="w-full rounded-lg bg-background pl-10 md:w-[200px] lg:w-[336px]"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                    <Button onClick={handleAddNew} size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                     <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Customer
                    </span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                    <DialogTitle className="font-headline">
                        {selectedCustomer ? "Edit Customer" : "Add New Customer"}
                    </DialogTitle>
                    <DialogDescription>
                        {selectedCustomer ? "Update the details of your customer." : "Fill in the details to add a new customer."}
                    </DialogDescription>
                    </DialogHeader>
                    <CustomerForm customer={selectedCustomer} onSave={() => setIsFormOpen(false)} />
                </DialogContent>
                </Dialog>
            </div>
        </div>
        <TabsContent value={activeTab}>
            <Card className="mt-4">
              <CardContent className="p-0">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="hidden sm:table-cell">GSTIN</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                        <TableCell>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {customer.email}
                        </div>
                        </TableCell>
                        <TableCell>
                        {customer.phone}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                        <Badge variant="secondary">{customer.gstin}</Badge>
                        </TableCell>
                        <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => handleEdit(customer)}>
                                Edit
                            </DropdownMenuItem>
                            {customer.status !== 'Paid' && (
                                <DropdownMenuItem onClick={() => handleMarkAsPaid(customer.id)}>
                                Mark as Paid
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onSelect={() => handleGetInsights(customer)}>
                                <MessageSquareQuote className="mr-2 h-4 w-4" />
                                Get Insights
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive"
                                onSelect={() => alert(`Deleting ${customer.name}`)}
                            >
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
                            Showing <strong>{startCustomer}-{endCustomer}</strong> of{" "}
                            <strong>{filteredCustomers.length}</strong> customers
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
      
      <InsightsDialog 
        isOpen={isInsightsOpen} 
        onOpenChange={setIsInsightsOpen} 
        customer={selectedCustomer} 
      />
    </>
  );
}
