

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, PlusCircle } from "lucide-react";

export function BillingSettings() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Payment Methods</CardTitle>
          <CardDescription>
            Manage your saved payment methods.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <CreditCard className="h-6 w-6" />
              <div>
                <div className="font-medium">Visa ending in 4242</div>
                <div className="text-sm text-muted-foreground">Expires 12/2026</div>
              </div>
            </div>
            <Button variant="outline" size="sm">Remove</Button>
          </div>
           <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <CreditCard className="h-6 w-6" />
              <div>
                <div className="font-medium">Mastercard ending in 8989</div>
                <div className="text-sm text-muted-foreground">Expires 08/2028</div>
              </div>
            </div>
            <Button variant="outline" size="sm">Remove</Button>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Billing Address</CardTitle>
           <CardDescription>Update your billing address.</CardDescription>
        </CardHeader>
        <CardContent>
           <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="billing-name">Name</Label>
                  <Input id="billing-name" defaultValue="John Pilot" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="billing-address">Address</Label>
                  <Input id="billing-address" defaultValue="123 App Street, Dev City" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" defaultValue="Dev City" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" defaultValue="CA" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" defaultValue="90210" />
                    </div>
                 </div>
                 <div className="grid gap-2">
                    <Label htmlFor="gstin">GST Number</Label>
                    <Input id="gstin" defaultValue="29AABCU9567R1Z5" />
                 </div>
              </form>
        </CardContent>
         <CardFooter className="border-t px-6 py-4">
            <Button>Update Billing Address</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Business Details</CardTitle>
           <CardDescription>Update your business contact and payment details.</CardDescription>
        </CardHeader>
        <CardContent>
           <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="upi-id">UPI ID</Label>
                  <Input id="upi-id" placeholder="your-upi-id@okhdfcbank" />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="business-phone">Business Phone</Label>
                  <Input id="business-phone" placeholder="+91 123 456 7890" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="billing-email">Billing Email</Label>
                  <Input id="billing-email" placeholder="billing@pilot.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="whatsapp-number">Billing WhatsApp Number</Label>
                  <Input id="whatsapp-number" placeholder="+911234567890" />
                </div>
              </form>
        </CardContent>
         <CardFooter className="border-t px-6 py-4">
            <Button>Save Business Details</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
