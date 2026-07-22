import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getTimeOfDay, statusColor, toTitleCase } from "@/utils/general";
import { Link, router, usePage } from "@inertiajs/react";
import {
    CreditCard,
    Droplets,
    House,
    MessageSquareTextIcon,
    PiggyBank,
    Scroll,
    Wallet,
    Zap,
} from "lucide-react";

export default function TenantDashboard({ tenant }) {
    console.log(tenant);
    const user = usePage().props.auth.user;
    const booking = tenant?.booking;
    const bills = tenant?.booking?.bills;
    const room = tenant?.booking?.room;
    const house = tenant?.booking?.room?.house;
    const cards = [
        {
            color: "blue",
            icon: House,
            badge: house.status,
            label: "CURRENT BOARDING HOUSE",
            title: house?.name,
            footer: `Room# ${room?.room_number}`,
        },
        {
            color: "red",
            icon: Wallet,
            badge: house.status,
            label: "OUTSTANDING BALANCE",
            title: `₱${booking?.balance.toFixed(2)}`,
            footer: `Room# ${room?.room_number}`,
        },
        {
            color: "green",
            icon: PiggyBank,
            badge: house.status,
            label: "REMAINING DEPOSIT",
            title: `₱${booking?.total_deposit.toFixed(2)}`,
            footer: `Room# ${room?.room_number}`,
        },
    ];
    return (
        <div className="py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mb-4">
                    <h1 className="text-3xl font-bold">
                        {getTimeOfDay()}, {user.name}!
                    </h1>
                    {tenant.booking && (
                        <p>
                            Here’s what’s happening with your stay at{" "}
                            {tenant.booking.room.house.name}.
                        </p>
                    )}
                </div>
                <div className="grid grid-cols-8 gap-4">
                    {cards.map((card) => (
                        <DashboardCard card={card} />
                    ))}
                    <QuickActionCard />
                </div>
                <div className="grid grid-cols-8 my-4">
                    <div className="col-span-5">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold">Recent Bills</h3>
                            <Button variant="link">View All bills</Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {bills.splice(0, 3).map((bill, key) => (
                                <BillRow bill={bill} key={key} />
                            ))}
                        </div>
                    </div>
                    <div className="col-span-3"></div>
                </div>
            </div>
        </div>
    );
}

function DashboardCard({ card }) {
    const Icon = card.icon;
    const iconBgColor = `bg-${card.color}-200`;
    const textColor = `text-${card.color}-500`;
    return (
        <Card className="col-span-2">
            <div className="flex flex-col h-full">
                <CardHeader className="flex-1">
                    <div className="flex justify-between">
                        <div
                            className={`rounded-md p-2 ${iconBgColor} ${textColor}`}
                        >
                            <Icon />
                        </div>
                        <Badge
                            variant="ghost"
                            className={`${textColor} border-none`}
                        >
                            {toTitleCase(card.badge)}
                        </Badge>
                    </div>
                    <h3 className="font-bold text-gray-500">{card.label}</h3>
                    <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardFooter>
                    <p className={`font-extrabold ${textColor}`}>
                        {card.footer}
                    </p>
                </CardFooter>
            </div>
        </Card>
    );
}

function QuickActionCard() {
    return (
        <Card className="col-span-2 bg-primary">
            <CardHeader>
                <CardTitle className="text-white text-xl text-center font-bold">
                    Quick Action
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <Button variant="outline" className="text-primary">
                    <CreditCard /> Pay Bill
                </Button>
                <Button variant="ghost" className="text-white bg-red-500">
                    <MessageSquareTextIcon /> Landlord
                </Button>
            </CardContent>
        </Card>
    );
}

function BillRow({ bill }) {
    let Icon;
    let color;
    switch (bill.type) {
        case "rent":
            Icon = House;
            color = "green";
            break;
        case "water":
            Icon = Droplets;
            color = "blue";
            break;
        case "electric":
            Icon = Zap;
            color = "yellow";
            break;
        case "repair":
            Icon = Hammer;
            color = "gray";
            break;
        case "other":
            Icon = Scroll;
            color = "orange";
            break;
    }
    const bgColor = `bg-${color}-200`;
    const textColor = `text-${color}-500`;
    const statusTextColor = statusColor(bill.status, true);
    return (
        <Card className="col-span-2 border">
            <CardContent className="flex flex-row items-center p-2 pr-12 gap-2">
                <div className={`${bgColor} ${textColor} rounded-full p-2`}>
                    <Icon />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-bold">{bill.title}</h3>
                    <p className="text-gray-500">{bill.due_date}</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold">₱{bill.amount}</h3>
                    <p
                        className={`text-xs font-semibold text-right ${statusTextColor}`}
                    >
                        {bill.status.toUpperCase()}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
