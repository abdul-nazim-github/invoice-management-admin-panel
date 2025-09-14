import { getRequest } from "@/lib/helpers/axios/RequestService";
import { CustomerDataTypes } from "@/lib/types/customers";
import { CustomerClient } from "./components/customer-client";

export default async function CustomersPage() {
  const customers: CustomerDataTypes[] =
    ((await getRequest({url: "/api/customers"})).data.results) || [];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-2xl font-bold font-headline tracking-tight">
          Customers
        </h1>
        <p className="text-muted-foreground">
          Manage your customers and view their details.
        </p>
      </div>
      <CustomerClient customers={customers} />
    </main>
  );
}
