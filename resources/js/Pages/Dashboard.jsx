import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/Components/ui/badge";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    BanknoteIcon,
    BanknoteX,
    DollarSign,
    DoorClosed,
    HandCoins,
    HouseIcon,
    TrendingUpIcon,
    Users,
} from "lucide-react";

export default function Dashboard({data}) {
    const cards_data = [
        {
            title: "Occupied Rooms",
            icon: DoorClosed,
            badge: (
                <Badge
                    variant="outline"
                    className="flex gap-1 rounded-lg text-xs"
                >
                    <TrendingUpIcon className="size-3" />
                    +{data.rooms.occupancy_rate}%
                </Badge>
            ),
            content: (
                <div className="">
                    <div className="flex items-center">
                        <span className="text-2xl text-primary font-bold">
                            {data.rooms.occupied_rooms}/
                        </span>
                        <span className="text-lg text-gray-500">{data.rooms.total_rooms}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "Active Tenants",
            icon: Users,
            badge: (
                <Badge
                    variant="outline"
                    className="flex gap-1 rounded-lg text-xs"
                >
                    <TrendingUpIcon className="size-3" />
                    +{data.tenants.occupancy_rate}%
                </Badge>
            ),
            content: (
                <div className="">
                    <div className="flex items-center">
                        <span className="text-2xl text-primary font-bold">
                            {data.tenants.active_tenants}/
                        </span>
                        <span className="text-lg text-gray-500">{data.tenants.total_tenants}</span>
                    </div>
                </div>
            ),
        },
         {
            title: "Revenue",
            icon: BanknoteIcon,
            badge: (
                <Badge
                    variant="outline"
                    className="flex gap-1 rounded-lg text-xs"
                >
                    <TrendingUpIcon className="size-3" />
                    +12.5%
                </Badge>
            ),
            content: (
                <div className="">
                    <div className="">
                        <span className="text-3xl font-bold text-green-500">₱ {data.total_revenue}</span>
                    </div>
                </div>
            ),
        },
         {
            title: "Unpaid Bills",
            icon: HandCoins,
            badge: (
                <Badge
                    variant="outline"
                    className="flex gap-1 rounded-lg text-xs"
                >
                    <TrendingUpIcon className="size-3" />
                    +12.5%
                </Badge>
            ),
            content: (
                <div className="">
                    <div className="">
                        <span className="text-3xl font-bold text-red-500">₱ {data.total_unpaid_bills}</span>
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div className="py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border">
                    <div className="p-6 text-gray-900 border">
                        <h1 className="text-3xl font-bold ">
                            Dashboard Overview
                        </h1>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {cards_data.map((data, key) => (
                            <DashboardCard key={key} data={data} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardCard({ data }) {
    const Icon = data.icon
    return (
        <Card className="@container/card flex flex-col shadow-md">
            <CardHeader className="flex-grow relative">
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums flex justify-between items-center mt-3">
                    {data.title}
                    <Icon className="size-16"/>
                </CardTitle>
                <div className="absolute right-2 top-0">{data.badge}</div>
            </CardHeader>
            <CardContent className="flex-col items-start gap-1 text-sm">
                {data.content}
            </CardContent>
        </Card>
    );
}
