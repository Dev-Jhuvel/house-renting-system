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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { getTimeOfDay, pesoFormatter, statusColor, toTitleCase } from "@/utils/general";
import { Link, router, useForm, usePage } from "@inertiajs/react";
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
import MapView from "@/Components/Maps/MapView";
import PaymentDialog from "@/Components/Dialogs/PaymentDialog";
import { useState } from "react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/Components/ui/hover-card";
import { useIsMobile } from "@/hooks/use-mobile";

export default function TenantDashboard({ tenant }) {
    const today = new Date();
    const {
        data: paymentData,
        setData: setPaymentData,
        post: postPayment,
        put: putPayment,
        processing: paymentProcessing,
        errors: paymentErrors,
        reset: resetPayment,
    } = useForm({
        amount_paid: "",
        paid_at: today.toISOString().slice(0, 10),
        method: "",
        reference_number: "",
        notes: "",
    });

    const [openPayment, setOpenPayment] = useState(false);
    const [selectedBillForPayment, setSelectedBillForPayment] = useState(null);
    const [viewAll, setViewAll] = useState(false);
    const max_bill_count = 5;
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
            title: pesoFormatter(booking?.balance),
            footer: `Room# ${room?.room_number}`,
        },
        {
            color: "green",
            icon: PiggyBank,
            badge: house.status,
            label: "REMAINING DEPOSIT",
            title: pesoFormatter(booking?.total_deposit),
            footer: `Room# ${room?.room_number}`,
        },
    ];

    function handleBillRowAction(bill) {
        console.log(bill);
        if (bill.status !== "paid" || bill.amount === bill.total_paid) {
            handleOpenPayment(bill);
        }
    }

    function handleOpenPayment(bill) {
        setOpenPayment(true);
        setSelectedBillForPayment(bill);
        resetPayment();
    }

    function handleSubmitPayment(e) {
        e.preventDefault();
        postPayment(route("bills.payments.submit", selectedBillForPayment.id), {
            onSuccess: () => {
                resetPayment();
                setOpenPayment(false);
                setSelectedBillForPayment(null);
            },
        });
    }

    function handlePaymentChange(e) {
        const { name, type, value } = e.target;
        setPaymentData((prev) => ({
            ...prev,
            [name]:
                type === "number" && value !== ""
                    ? parseFloat(value) || 0
                    : value,
        }));
    }

    return (
        <div className="py-12">
            <PaymentDialog
                setOpen={setOpenPayment}
                open={openPayment}
                form={paymentData}
                errors={paymentErrors}
                handleSubmit={handleSubmitPayment}
                handleChange={handlePaymentChange}
                processing={paymentProcessing}
                bill={selectedBillForPayment}
                method="Submit"
            />
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow-sm sm:rounded-lg mb-4">
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
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                    {cards.map((card) => (
                        <DashboardCard card={card} key={card.label} />
                    ))}
                    <QuickActionCard />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-8 my-4 gap-5 md:h-[400px]">
                    <div className="col-span-5 h-full min-h-0">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold py-1">Recent Bills</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 h-[400px] md:h-[calc(100%-10px)] overflow-y-scroll">
                            {bills.map((bill) => (
                                <ResponsiveBillRow
                                    bill={bill}
                                    key={bill.id}
                                    onClick={() => handleBillRowAction(bill)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className={`col-span-3 relative h-[400px] md:h-full z-0`}>
                        <h3 className="text-xl font-bold py-1">
                            Location/Address
                        </h3>
                        <MapView
                            className="z-10 h-full"
                            latitude={house.latitude}
                            longitude={house.longitude}
                            address={house.address}
                        />
                    </div>
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

function BillRow({ bill, onClick }) {
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
        <Card className="col-span-2 border cursor-pointer" onClick={onClick}>
            <CardContent className="flex flex-row items-center p-2 pr-12 gap-2">
                <div className={`${bgColor} ${textColor} rounded-full p-2`}>
                    <Icon />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-bold">{bill.title}</h3>
                    <p className="text-gray-500">{bill.due_date}</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold">{pesoFormatter(bill.amount)}</h3>
                    <p className={`text-xs font-semibold text-right ${statusTextColor}`} >
                        {bill.status.toUpperCase()}
                    </p>
                     <p className={`text-xs font-semibold text-right text-green-500`} >
                        Payments: {bill.payments.length}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

function ResponsiveBillRow({ bill, onClick }) {
    const isMobile = useIsMobile();

    const Content = ({bill}) => (
        <div>
            <div>
                <h2 className="text-center font-bold">{bill.title}</h2>
            </div>
            {bill.payments.length > 0 && (
                <div>
                    <h3 className="font-bold">Payments</h3>
                    <ul>
                        {bill.payments.map((payment) => (
                            <li key={payment.id}>
                                {toTitleCase(
                                    `${payment.method} - ₱${payment.amount_paid} `,
                                )}
                                {toTitleCase(payment.status)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
    return isMobile ? (
        <Popover>
            <PopoverTrigger asChild>
                <div>
                    <BillRow
                        bill={bill}
                        onClick={onClick}
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <Content bill={bill} />
            </PopoverContent>
        </Popover>
    ) : (
        <HoverCard key={bill.id}>
            <HoverCardTrigger asChild>
                <div>
                    <BillRow
                        bill={bill}
                        onClick={onClick}
                    />
                </div>
            </HoverCardTrigger>
            <HoverCardContent>
                <Content bill={bill} />
            </HoverCardContent>
        </HoverCard>
    );
}
