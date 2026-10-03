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
import ResponsiveBillRow from "@/Components/ResponsiveBillRows";

export default function Dashboard({ tenant }) {
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
    const unpaid_bills_count = booking.unpaid_bills.length || 0;
    const unpaid_bills_keyword = unpaid_bills_count > 1 ? 'bills' : 'bill';
    const deposit_count = booking.deposits.length || 0;
    const deposit_keyword = deposit_count > 1 ? 'deposits' : 'deposit';

    const cards = [
        {
            color: "blue",
            icon: House,
            badge: booking.status,
            label: "CURRENT BOARDING HOUSE",
            title: house?.name,
            footer: `Room# ${room?.room_number}`,
        },
        {
            color: "red",
            icon: Wallet,
            badge: booking.status,
            label: "OUTSTANDING BALANCE",
            title: pesoFormatter(booking?.balance),
            footer: unpaid_bills_count > 0 ? `${unpaid_bills_count} unpaid ${unpaid_bills_keyword}` : 'No Unpaid Bill',
        },
        {
            color: "green",
            icon: PiggyBank,
            badge: booking.status,
            label: "REMAINING DEPOSIT",
            title: pesoFormatter(booking?.total_deposit),
            footer: deposit_count > 0 ? `${deposit_count} ${deposit_keyword}` : 'No Deposit',
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




