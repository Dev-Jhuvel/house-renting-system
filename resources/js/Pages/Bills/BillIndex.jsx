import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import InputWithLabel from "@/Components/InputWithLabel";
import HouseDialog from "@/Components/Dialogs/HouseDialog";
import AddCard from "@/Components/AddCard";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useForm, Link, router } from "@inertiajs/react";

import {
    ArrowRight,
    EllipsisVertical,
    MapPin,
    PlusCircleIcon,
    PlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import BillDialog from "@/Components/Dialogs/BillDialog";
import DeleteAlert from "@/Components/DeleteAlert";
import TenantColumn from "@/Components/TenantColumn";
import RoomColumn from "@/Components/RoomColumn";
import PaymentDialog from "@/Components/Dialogs/PaymentDialog";
import PaymentHistorySheet from "@/Components/Sheets/PaymentHistorySheet";
import { statusColor, toTitleCase } from "@/utils/general";

export default function BookingIndex({ bills, bookings }) {
    const today = new Date();
    const due_date = new Date(today);
    due_date.setDate(due_date.getDate() + 10);

    // Bills Process and variable
    const [openBill, setOpenBill] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    const {
        data: billData,
        setData: setBillData,
        post: postBill,
        put: putBill,
        processing: billProcessing,
        errors: billErrors,
        reset: resetBill,
    } = useForm({
        booking_id: "",
        title: "",
        type: "",
        amount: "",
        previous_reading: "",
        current_reading: "",
        rate_used: "",
        bill_date: today.toISOString().slice(0, 10),
        due_date: due_date.toISOString().slice(0, 10),
        notes: "",
    });

    function handleOpenBillCreate() {
        resetBill();
        setSelectedBill(null);
        setOpenBill(true);
    }

    function handleOpenBillEdit(bill) {
        setBillData({
            booking_id: bill.booking_id,
            title: bill.title,
            type: bill.type,
            amount: bill.amount,
            previous_reading: bill.previous_reading,
            current_reading: bill.current_reading,
            rate_used: bill.rate_used,
            bill_date: bill.bill_date,
            due_date: bill.due_date,
            notes: bill.notes,
            status: bill.status,
        });
        setSelectedBill(bill);
        setOpenBill(true);
    }

    function handleSubmitBill(e) {
        e.preventDefault();
        if (selectedBill) {
            putBill(route("bills.update", selectedBill.id), {
                onSuccess: () => {
                    resetBill();
                    setOpenBill(false);
                    setSelectedBill(null);
                },
            });
        } else {
            postBill(route("bills.store"), {
                onSuccess: () => {
                    resetBill();
                    setOpenBill(false);
                },
            });
        }
    }

    function handleBillChange(e) {
        const { name, type, value } = e.target;
        setBillData((prev) => ({
            ...prev,
            [name]:
                type === "number" && value !== ""
                    ? parseFloat(value) || 0
                    : value,
        }));
    }

    function handleDeleteBill(bill_id) {
        router.delete(route("bills.destroy", bill_id));
    }

    const BillActions = (bill) => {
        const {
            status,
            payments,
        } = bill;
        const hasPayments = payments.length > 0;

        // # think of when I can do this action
        return {
            canEdit: !hasPayments,
            canDelete: !hasPayments,
            canRecordPayment: status !== "paid",
            canViewPayment: payments && hasPayments,
        };
    };

    useEffect(() => {
        if (!billData.booking_id || !billData.type || selectedBill) return;

        const booking = bookings.find((b) => b.value === billData.booking_id);
        if (!booking) return;

        const month_year = new Date(billData.bill_date).toLocaleDateString(
            "default",
            {
                month: "long",
                year: "numeric",
            },
        );

        const type_label =
            billData.type.charAt(0).toUpperCase() + billData.type.slice(1);
        const bl_parts = booking.label.split(" - ");
        setBillData(
            "title",
            `${bl_parts[0]} - ${type_label} Bill - ${month_year}`,
        );
    }, [billData.booking_id, billData.type, billData.bill_date]);

    useEffect(() => {
        if (billData.type === "rent") return;

        const prev = parseFloat(billData.previous_reading);
        const curr = parseFloat(billData.current_reading);
        const rate = parseFloat(billData.rate_used);

        if (!isNaN(prev) && !isNaN(curr) && !isNaN(rate) && curr > prev) {
            setBillData("amount", ((curr - prev) * rate).toFixed(2));
        }
    }, [
        billData.previous_reading,
        billData.current_reading,
        billData.rate_used,
    ]);

    useEffect(() => {
        if(selectedBill) return;
        if(!billData.booking_id || !['electric', 'water'].includes(billData.type)) return;

        const lastBillOfType = bills.find(
            (b) => b.booking_id === billData.booking_id && b.type === billData.type
        );

        setBillData('previous_reading', lastBillOfType ? lastBillOfType.current_reading : "");

    }, [billData.booking_id, billData.type]);

    // Payments Process and variable
    const [openPayment, setOpenPayment] = useState(false);
    const [openPaymentHistory, setOpenPaymentHistory] = useState(false);
    const [selectedBillForPayment, setSelectedBillForPayment] = useState(null);
    const [selectedBillForPaymentHistory, setSelectedBillForPaymentHistory] =
        useState(null);
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

    function handleOpenPayment(bill) {
        resetPayment();
        setSelectedBillForPayment(bill);
        setOpenPayment(true);
    }

    function handleSubmitPayment(e) {
        e.preventDefault();
        postPayment(route("bills.payments.store", selectedBillForPayment.id), {
            onSuccess: () => {
                resetPayment();
                setOpenPayment(false);
                setSelectedBillForPayment(null);
            },
        });
    }

    function handleOpenPaymentHistory(bill) {
        resetBill();
        setSelectedBillForPaymentHistory(bill);
        setOpenPaymentHistory(true);
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

    function handleDeletePayment(payment_id) {
        router.delete(
            route("bills.payments.destroy", {
                bill: selectedBillForPaymentHistory.id,
                payment: payment_id,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    const updatedPayments =
                        selectedBillForPaymentHistory.payments.filter(
                            (p) => p.id !== payment_id,
                        );

                    setSelectedBillForPaymentHistory((prev) => ({
                        ...prev,
                        payments: updatedPayments,
                    }));
                },
            },
        );
    }

    return (
        <div className="flex flex-col p-4 bg-gray-200">
            <BillDialog
                setOpen={setOpenBill}
                open={openBill}
                form={billData}
                errors={billErrors}
                handleSubmit={handleSubmitBill}
                handleChange={handleBillChange}
                processing={billProcessing}
                bookings={bookings}
                method={selectedBill ? "Update" : "Create"}
            />
            <PaymentDialog
                setOpen={setOpenPayment}
                open={openPayment}
                form={paymentData}
                errors={paymentErrors}
                handleSubmit={handleSubmitPayment}
                handleChange={handlePaymentChange}
                processing={paymentProcessing}
                bill={selectedBillForPayment}
                method={selectedBillForPayment ? "Update" : "Create"}
            />
            <PaymentHistorySheet
                open={openPaymentHistory}
                setOpen={setOpenPaymentHistory}
                bill={selectedBillForPaymentHistory}
                handleDeletePayment={handleDeletePayment}
            />
            <div className="flex mb-4">
                <div className="flex-grow">
                    <h1 className="text-2xl">Tenant's Bills</h1>
                    <p>Manage tenant bills</p>
                </div>
                <div className="flex items-end px-4">
                    <Button
                        className="px-3 py-1 flex items-center"
                        onClick={handleOpenBillCreate}
                    >
                        <PlusIcon className="hover:text-primary" size={32} />
                        Add Bill
                    </Button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="gap-8 py-4 px-3 overflow-scroll pb-5 h-full">
                    <Table>
                        <TableCaption>A list of your tenants.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="">Tenant Name</TableHead>
                                <TableHead className="">
                                    Property/Room
                                </TableHead>
                                <TableHead className="">Type</TableHead>
                                <TableHead className="">Amount</TableHead>
                                <TableHead className="">Balance</TableHead>
                                <TableHead className="">Bill Date</TableHead>
                                <TableHead className="">Due Date</TableHead>
                                <TableHead className="">Status</TableHead>
                                <TableHead className="">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bills.map((bill, key) => {
                                const status = bill.status;
                                const user = bill.booking?.tenant.user;
                                const room = bill.booking?.room;
                                const house = room?.house;
                                const actions = BillActions(bill);
                                return (
                                    <TableRow key={key}>
                                        <TableCell className="flex items-center gap-x-2">
                                            <TenantColumn
                                                name={user.name}
                                                email={user.email}
                                            />
                                        </TableCell>
                                        <TableCell className="">
                                            <RoomColumn
                                                room_number={room?.room_number}
                                                house_name={house?.name}
                                            />
                                        </TableCell>
                                        <TableCell className="">
                                            {toTitleCase(bill.type)}
                                        </TableCell>
                                        <TableCell className="">
                                            ₱{bill.amount}
                                        </TableCell>
                                        <TableCell className="">
                                            ₱{bill.remaining_balance}
                                        </TableCell>
                                        <TableCell className="">
                                            {bill.bill_date}
                                        </TableCell>
                                        <TableCell className="">
                                            {bill.due_date}
                                        </TableCell>
                                        <TableCell className="">
                                            <span
                                                className={`px-2 py-1 rounded-md font-semibold ${statusColor(status)}`}
                                            >
                                                {status
                                                    ? toTitleCase(status)
                                                    : "-"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="px-3 py-1">
                                                        <EllipsisVertical
                                                            className="hover:text-primary"
                                                            size={18}
                                                        />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        disabled={!actions.canEdit}
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            handleOpenBillEdit(
                                                                bill,
                                                            );
                                                        }}
                                                    >
                                                        Edit Booking
                                                    </DropdownMenuItem>
                                                    <DeleteAlert
                                                        handleDelete={() =>
                                                            handleDeleteBill(
                                                                bill.id,
                                                            )
                                                        }
                                                        message="Are you sure to Delete this bill?"
                                                    >
                                                        <DropdownMenuItem
                                                            disabled={!actions.canDelete}
                                                            onSelect={(e) =>
                                                                e.preventDefault()
                                                            }
                                                        >
                                                            Delete Booking
                                                        </DropdownMenuItem>
                                                    </DeleteAlert>

                                                    <DropdownMenuItem
                                                        disabled={!actions.canRecordPayment}
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            handleOpenPayment(
                                                                bill,
                                                            );
                                                        }}
                                                    >
                                                        Record Payment
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        disabled={!actions.canViewPayment}
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            handleOpenPaymentHistory(
                                                                bill,
                                                            );
                                                        }}
                                                    >
                                                        View Payment History
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
