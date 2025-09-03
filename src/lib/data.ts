import type { Customer, Product, Invoice } from "./types";

export const customers: Customer[] = [
  {
    id: "1",
    name: "Innovate Inc.",
    email: "contact@innovateinc.com",
    phone: "123-456-7890",
    address: "123 Tech Park, Silicon Valley, CA",
    gstin: "29AABCU9567R1Z5",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    name: "Quantum Solutions",
    email: "support@quantum.com",
    phone: "234-567-8901",
    address: "456 Future Ave, Metropolis, NY",
    gstin: "07AABCS1234G1Z2",
    createdAt: new Date("2023-02-20"),
  },
  {
    id: "3",
    name: "Synergy Group",
    email: "hello@synergy.co",
    phone: "345-678-9012",
    address: "789 Enterprise Rd, Star City, TX",
    gstin: "36AAACS5678H1Z9",
    createdAt: new Date("2023-03-10"),
  },
  {
    id: "4",
    name: "Apex Enterprises",
    email: "info@apex.net",
    phone: "456-789-0123",
    address: "101 Peak Plaza, Gotham, NJ",
    gstin: "24AADCE2345F1Z8",
    createdAt: new Date("2023-04-05"),
  },
  {
    id: "5",
    name: "Nexus Hub",
    email: "admin@nexushub.io",
    phone: "567-890-1234",
    address: "210 Connector Way, Central City, CO",
    gstin: "08AACDN8765K1Z3",
    createdAt: new Date("2023-05-25"),
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Cloud Service Subscription",
    description: "1-year basic tier cloud service.",
    price: 1200.0,
    stock: 100,
  },
  {
    id: "2",
    name: "API Development",
    description: "Custom API integration service.",
    price: 5000.0,
    stock: 50,
  },
  {
    id: "3",
    name: "Website Maintenance",
    description: "Monthly website support package.",
    price: 300.0,
    stock: 200,
  },
  {
    id: "4",
    name: "UX/UI Design Package",
    description: "Complete design for a new application.",
    price: 8000.0,
    stock: 20,
  },
  {
    id: "5",
    name: "Consulting Hours",
    description: "10-hour block of technical consulting.",
    price: 1500.0,
    stock: 150,
  },
];

export const invoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    customer: customers[0],
    items: [
      { product: products[0], quantity: 1 },
      { product: products[2], quantity: 3 },
    ],
    date: new Date("2023-06-01"),
    subtotal: 2100,
    tax: 378,
    discount: 100,
    total: 2378,
    amountPaid: 2378,
    status: "Paid",
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    customer: customers[1],
    items: [{ product: products[1], quantity: 1 }],
    date: new Date("2023-06-05"),
    subtotal: 5000,
    tax: 900,
    discount: 0,
    total: 5900,
    amountPaid: 2000,
    status: "Pending",
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    customer: customers[2],
    items: [
      { product: products[3], quantity: 1 },
      { product: products[4], quantity: 2 },
    ],
    date: new Date("2023-05-10"),
    subtotal: 11000,
    tax: 1980,
    discount: 500,
    total: 12480,
    amountPaid: 10000,
    status: "Overdue",
  },
  {
    id: "4",
    invoiceNumber: "INV-004",
    customer: customers[3],
    items: [{ product: products[2], quantity: 12 }],
    date: new Date("2023-06-15"),
    subtotal: 3600,
    tax: 648,
    discount: 0,
    total: 4248,
    amountPaid: 4248,
    status: "Paid",
  },
  {
    id: "5",
    invoiceNumber: "INV-005",
    customer: customers[4],
    items: [{ product: products[0], quantity: 2 }],
    date: new Date("2023-06-20"),
    subtotal: 2400,
    tax: 432,
    discount: 200,
    total: 2632,
    amountPaid: 0,
    status: "Pending",
  },
];

function getCustomerStatus(customerId: string): "Paid" | "Pending" | "Overdue" {
  const customerInvoices = invoices.filter(
    (invoice) => invoice.customer.id === customerId
  );

  if (customerInvoices.length === 0) {
    return "Paid"; 
  }

  const hasOverdue = customerInvoices.some(
    (invoice) => invoice.status === "Overdue"
  );
  if (hasOverdue) {
    return "Overdue";
  }

  const hasPending = customerInvoices.some(
    (invoice) => invoice.status === "Pending" || invoice.amountPaid < invoice.total
  );
  if (hasPending) {
    return "Pending";
  }
  
  return "Paid";
}


customers.forEach(customer => {
    customer.status = getCustomerStatus(customer.id);
});

    