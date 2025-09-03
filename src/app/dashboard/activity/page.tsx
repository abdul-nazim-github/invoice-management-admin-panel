
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Users,
    FileText,
    CircleDollarSign,
    Package
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";


const activities = [
    {
        icon: FileText,
        title: "Invoice INV-005 sent",
        description: "Sent to Nexus Hub.",
        time: "2 hours ago",
        variant: "secondary"
    },
    {
        icon: Users,
        title: "New customer added",
        description: "Apex Enterprises is now a customer.",
        time: "1 day ago",
        variant: "outline"
    },
    {
        icon: CircleDollarSign,
        title: "Payment received",
        description: "₹2,378.00 from Innovate Inc. for INV-001.",
        time: "2 days ago",
        variant: "default"
    },
    {
        icon: Package,
        title: "Product updated",
        description: "Cloud Service Subscription details were updated.",
        time: "3 days ago",
        variant: "outline"
    },
    {
        icon: FileText,
        title: "Invoice INV-004 created",
        description: "For Synergy Group.",
        time: "4 days ago",
        variant: "secondary"
    },
    {
        icon: Users,
        title: "Customer details updated",
        description: "Updated contact info for Quantum Solutions.",
        time: "5 days ago",
        variant: "outline"
    }
];

export default function ActivityPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-2xl font-bold font-headline tracking-tight">
          Activity Feed
        </h1>
        <p className="text-muted-foreground">
          A log of recent activities in your account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Activities</CardTitle>
          <CardDescription>
            Here is what has happened in your account recently.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flow-root">
                <ul role="list" className="-mb-8">
                    {activities.map((activity, activityIdx) => (
                    <li key={activityIdx}>
                        <div className="relative pb-8">
                        {activityIdx !== activities.length - 1 ? (
                            <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex items-start space-x-4">
                            <div>
                                <div className="relative px-1">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted ring-8 ring-background">
                                    <activity.icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                    </div>
                                </div>
                            </div>
                            <div className="min-w-0 flex-1 py-3">
                                <div className="text-sm font-medium text-foreground">
                                    {activity.title}
                                </div>
                                <p className="mt-0.5 text-sm text-muted-foreground">{activity.description}</p>
                            </div>
                            <div className="flex-shrink-0 self-center">
                                <Badge variant={activity.variant as any}>{activity.time}</Badge>
                            </div>
                        </div>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </CardContent>
      </Card>
    </main>
  );
}
