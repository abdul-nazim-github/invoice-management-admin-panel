
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
  DropdownMenuSeparator,
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
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  MessageSquareQuote,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Customer } from "@/lib/types";
import { CustomerForm } from "./customer-form";
import { InsightsDialog } from "./insights-dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export function CustomerClient({ customers: initialCustomers }: { customers: Customer[] }) {
  const router = useRouter();
  const [customers, setCustomers] = React.useState(initialCustomers);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [activeTab, setActiveTab] = React.useState("all");
  const [selectedCustomerIds, setSelectedCustomerIds] = React.useState<string[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    setSelectedCustomerIds([]);
  }

  const handleDelete = (customerId: string) => {
    setCustomers(customers.filter((customer) => customer.id !== customerId));
  };
  
  const handleBulkDelete = () => {
    setCustomers(customers.filter(customer => !selectedCustomerIds.includes(customer.id)));
    setSelectedCustomerIds([]);
  }

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
  
  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      const allCustomerIdsOnPage = paginatedCustomers.map(c => c.id);
      setSelectedCustomerIds(Array.from(new Set([...selectedCustomerIds, ...allCustomerIdsOnPage])));
    } else {
      const pageCustomerIds = paginatedCustomers.map(c => c.id);
      setSelectedCustomerIds(selectedCustomerIds.filter(id => !pageCustomerIds.includes(id)));
    }
  }

  const handleSelectOne = (customerId: string, checked: boolean) => {
    if(checked) {
        setSelectedCustomerIds([...selectedCustomerIds, customerId]);
    } else {
        setSelectedCustomerIds(selectedCustomerIds.filter(id => id !== customerId));
    }
  }
  
  const isAllOnPageSelected = paginatedCustomers.length > 0 && paginatedCustomers.every(c => selectedCustomerIds.includes(c.id));
  const isSomeOnPageSelected = paginatedCustomers.length > 0 && paginatedCustomers.some(c => selectedCustomerIds.includes(c.id));
  const selectAllCheckedState = isAllOnPageSelected ? true : (isSomeOnPageSelected ? 'indeterminate' : false);


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
  
  const handleFormSave = (customer: Customer | null) => {
    setIsFormOpen(false);
    if(customer) {
        if(selectedCustomer) {
            setCustomers(customers.map(c => c.id === customer.id ? customer : c));
        } else {
            setCustomers([customer, ...customers]);
        }
    }
    setSelectedCustomer(null);
  }

  return (
    <>
      <Tabs defaultValue="all" onValueChange={handleTabChange}>
         <div className="flex items-center justify-between gap-4">
            <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
                 {selectedCustomerIds.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="outline" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                           Delete ({selectedCustomerIds.length})
                       </Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                       <AlertDialogHeader>
                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                         <AlertDialogDescription>
                           This action cannot be undone. This will permanently delete the selected customers and all their associated data.
                         </AlertDialogDescription>
                       </AlertDialogHeader>
                       <AlertDialogFooter>
                         <AlertDialogCancel>Cancel</AlertDialogCancel>
                         <AlertDialogAction onClick={handleBulkDelete}>
                           Continue
                         </AlertDialogAction>
                       </AlertDialogFooter>
                     </AlertDialogContent>
                   </AlertDialog>
                )}
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
                    <CustomerForm customer={selectedCustomer} onSave={handleFormSave} />
                </DialogContent>
                </Dialog>
            </div>
        </div>
        <TabsContent value={activeTab}>
            {paginatedCustomers.length > 0 ? (
                <Card className="mt-4">
                <CardContent className="p-0">
                    <Table>
                    <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectAllCheckedState}
                              onCheckedChange={handleSelectAll}
                              aria-label="Select all"
                            />
                          </TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead className="hidden md:table-cell">Email</TableHead>
                          <TableHead className="hidden sm:table-cell">Status</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCustomers.map((customer) => (
                        <TableRow 
                            key={customer.id} 
                            className="cursor-pointer" 
                            data-state={selectedCustomerIds.includes(customer.id) ? "selected" : ""}
                        >
                            <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={selectedCustomerIds.includes(customer.id)}
                                    onCheckedChange={(checked) => handleSelectOne(customer.id, !!checked)}
                                    aria-label="Select row"
                                />
                            </TableCell>
                            <TableCell onClick={() => router.push(`/dashboard/customers/${customer.id}`)}>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground md:hidden">
                                {customer.email}
                            </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell" onClick={() => router.push(`/dashboard/customers/${customer.id}`)}>
                            {customer.email}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell" onClick={() => router.push(`/dashboard/customers/${customer.id}`)}>
                            <Badge
                                variant={
                                    customer.status === "Paid"
                                    ? "default"
                                    : customer.status === "New" 
                                    ? "outline"
                                    : customer.status === "Pending"
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="capitalize"
                                >
                                {customer.status}
                                </Badge>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={() => router.push(`/dashboard/customers/${customer.id}`)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleEdit(customer)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Customer
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleGetInsights(customer)}>
                                    <MessageSquareQuote className="mr-2 h-4 w-4" />
                                    Get AI Insights
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                        className="text-destructive"
                                        onSelect={(e) => e.preventDefault()}
                                        >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Customer
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete this
                                            customer and all associated invoices.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(customer.id)}>
                                            Continue
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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
                                {selectedCustomerIds.length > 0
                                ? `${selectedCustomerIds.length} of ${customers.length} customer(s) selected.`
                                : `Showing ${startCustomer}-${endCustomer} of ${filteredCustomers.length} customers`}
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
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-24 text-center mt-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                        <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col gap-1 text-center">
                        <h3 className="text-2xl font-semibold tracking-tight font-headline">
                            No customers found
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            It looks like you haven&apos;t added any customers yet.
                        </p>
                    </div>
                     <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                             <Button onClick={handleAddNew}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Customer
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
                            <CustomerForm customer={selectedCustomer} onSave={handleFormSave} />
                        </DialogContent>
                    </Dialog>
                </div>
            )}
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

    

    