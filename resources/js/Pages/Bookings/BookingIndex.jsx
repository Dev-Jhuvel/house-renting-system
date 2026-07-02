import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
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
} from "@/Components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

import { useForm, Link, router } from "@inertiajs/react";

import {
    ArrowRight,
    EllipsisVertical,
    MapPin,
    PlusCircleIcon,
    PlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import BookingDialog from "@/Components/Dialogs/BookingDialog";
import DepositDialog from "@/Components/Dialogs/DepositDialog";
import DeleteAlert from "@/Components/DeleteAlert";
import TenantColumn from "@/Components/TenantColumn";
import RoomColumn from "@/Components/RoomColumn";
import DepositHistorySheet from "@/Components/Sheets/DepositHistorySheet";
import { FocusTrapFeatures } from "@headlessui/react";
import { toTitleCase, statusColor } from "@/utils/general";

export default function BookingIndex({ bookings, tenants, rooms }) {
    const today = new Date();
    const next_month = new Date(today);
    next_month.setMonth(next_month.getMonth() + 1);

    // Booking process and variable
    const {
        data: bookingData,
        setData: setBookingData,
        post: postBooking,
        put: putBooking,
        processing: processingBooking,
        errors: bookingErrors,
        reset: resetBll,
    } = useForm({
        tenant_id: "",
        room_id: "",
        move_in_date: today.toISOString().slice(0, 10),
        // move_out_date: next_month.toISOString().slice(0, 10),
        move_out_date: "",
        due_day: "",
        notes: "",
        status: "pending",
    });

    const [openBooking, setOpenBooking] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    function handleOpenBookingCreate() {
        resetBll();
        setSelectedBooking(null);
        setOpenBooking(true);
    }

    function handleOpenBookingEdit(booking) {
        setBookingData({
            tenant_id: booking.tenant_id,
            room_id: booking.room_id,
            move_in_date: booking.move_in_date,
            move_out_date: booking.move_out_date,
            due_day: booking.due_day,
            notes: booking.notes ?? "",
            status: booking.status,
        });
        setSelectedBooking(booking);
        setOpenBooking(true);
    }

    function handleBookingSubmit(e) {
        e.preventDefault();
        if (selectedBooking) {
            putBooking(route("bookings.update", selectedBooking.id), {
                onSuccess: () => {
                    resetBll();
                    setOpenBooking(false);
                    setSelectedBooking(null);
                },
            });
        } else {
            postBooking(route("bookings.store"), {
                onSuccess: () => {
                    resetBll();
                    setOpenBooking(false);
                },
            });
        }
    }

    function handleBookingChange(e) {
        const { name, type, value } = e.target;
        setBookingData((prev) => ({
            ...prev,
            [name]:
                type === "number" && value !== ""
                    ? parseFloat(value) || 0
                    : value,
        }));
    }

    function handleBookingDelete(booking_id) {
        router.delete(route("bookings.destroy", booking_id));
    }

    // Deposit process and variable
    const [openDeposit, setOpenDeposit] = useState(false);
    const [openDepositHistory, setOpenDepositHistory] = useState(false);
    const [selectedBookingForDeposit, setSelectedBookingForDeposit] =
        useState(null);
    const {
        data: depositData,
        setData: setDepositData,
        post: postDeposit,
        put: putDeposit,
        processing: processingDeposit,
        errors: depositErrors,
        reset: resetDeposit,
    } = useForm({
        amount: "",
        notes: "",
        paid_at: today.toISOString().slice(0, 10),
        type: "received",
    });

    function handleOpenDepositCreate(booking) {
        resetDeposit();
        setSelectedBookingForDeposit(booking);
        setOpenDeposit(true);
    }

    function handleSubmitDeposit(e) {
        e.preventDefault();
        postDeposit(
            route("bookings.deposits.store", selectedBookingForDeposit.id),
            {
                onSuccess: () => {
                    resetDeposit();
                    setOpenDeposit(false);
                    setSelectedBookingForDeposit(null);
                },
            },
        );
    }

    function handleDepositChange(e) {
        const { name, type, value } = e.target;
        setDepositData((prev) => ({
            ...prev,
            [name]:
                type === "number" && value !== ""
                    ? parseFloat(value) || 0
                    : value,
        }));
    }

    function handleDeleteDeposit(deposit_id) {
        router.delete(
            route("deposits.destroy", {
                deposit: deposit_id,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    const updatedDeposit =
                        selectedBookingForDeposit.deposits.filter(
                            (d) => d.id !== deposit_id,
                        );

                    setSelectedBookingForDeposit((prev) => ({
                        ...prev,
                        deposits: updatedDeposit,
                    }));
                },
            },
        );
    }

    const bookingActions = (booking) => {
        const {
            status,
            unpaid_bills_count,
            required_deposit,
            total_deposit,
            deposits,
        } = booking;

        // # think of when I can do this action
        return {
            canDelete: status === "pending" && unpaid_bills_count === 0,
            canActivate:
                status === "pending" && total_deposit >= required_deposit,
            canEnd: status === "active" && unpaid_bills_count === 0,
            canCancel: status === "pending",
            canEdit: status !== "ended" && status !== "canceled",
            canRecordDeposit: status !== "ended" && status !== "canceled",
            canViewDeposit: deposits.length > 0,
        };
    };

    return (
        <div className="flex flex-col p-4 bg-gray-200">
            <div className="flex mb-4">
                <div className="flex-grow">
                    <h1 className="text-2xl">My Bookings</h1>
                    <p>Manage booking</p>
                </div>
                <div className="flex items-end px-4">
                    <DepositHistorySheet
                        open={openDepositHistory}
                        setOpen={setOpenDepositHistory}
                        booking={selectedBookingForDeposit}
                        handleDeleteDeposit={handleDeleteDeposit}
                    />
                    <DepositDialog
                        setOpen={setOpenDeposit}
                        open={openDeposit}
                        form={depositData}
                        errors={depositErrors}
                        handleSubmit={handleSubmitDeposit}
                        handleChange={handleDepositChange}
                        processing={processingDeposit}
                        booking={selectedBookingForDeposit}
                        method={selectedBooking ? "Update" : "Create"}
                    />
                    <BookingDialog
                        setOpen={setOpenBooking}
                        open={openBooking}
                        form={bookingData}
                        errors={bookingErrors}
                        handleSubmit={handleBookingSubmit}
                        handleChange={handleBookingChange}
                        processing={processingBooking}
                        rooms={rooms}
                        tenants={tenants}
                        method={selectedBooking ? "Update" : "Create"}
                        status={selectedBooking ? selectedBooking.status : null}
                    >
                        <Button
                            className="px-3 py-1 flex items-center"
                            onClick={handleOpenBookingCreate}
                        >
                            <PlusIcon
                                className="hover:text-primary"
                                size={32}
                            />
                            Add Booking
                        </Button>
                    </BookingDialog>
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
                                <TableHead className="">Move-in</TableHead>
                                <TableHead className="">Due Date</TableHead>
                                <TableHead className="">Deposit</TableHead>
                                <TableHead className="text-center">
                                    Unpaid Bills
                                </TableHead>
                                <TableHead className="text-center">
                                    Status
                                </TableHead>
                                <TableHead className="">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.map((booking, key) => {
                                const unpaid_bills = booking.bills.filter(
                                    (bill) => bill.status !== "paid",
                                );
                                const status = booking.status;
                                const user = booking?.tenant.user;
                                const room = booking?.room;
                                const house = room?.house;
                                const unpaid_bills_count =
                                    booking.unpaid_bills_count;
                                const status_color = statusColor(status);
                                const actions = bookingActions(booking);
                                return (
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <TableRow key={key}>
                                                <TableCell className="flex items-center gap-x-2">
                                                    <TenantColumn
                                                        name={user.name}
                                                        email={user.email}
                                                    />
                                                </TableCell>
                                                <TableCell className="">
                                                    <RoomColumn
                                                        room_number={
                                                            room?.room_number
                                                        }
                                                        house_name={house?.name}
                                                    />
                                                </TableCell>
                                                <TableCell className="">
                                                    {booking.move_in_date}
                                                </TableCell>
                                                <TableCell className="">
                                                    {booking.move_out_date
                                                        ? booking.move_out_date
                                                        : "-"}
                                                </TableCell>
                                                <TableCell className="">{`₱${booking.total_deposit}`}</TableCell>
                                                <TableCell className="text-center">
                                                    {unpaid_bills_count}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span
                                                        className={`px-2 py-1 rounded-md font-semibold ${status_color}`}
                                                    >
                                                        {toTitleCase(status)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
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
                                                                disabled={
                                                                    !actions.canEdit
                                                                }
                                                                onSelect={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    handleOpenBookingEdit(
                                                                        booking,
                                                                    );
                                                                }}
                                                            >
                                                                Edit Booking
                                                            </DropdownMenuItem>
                                                            <DeleteAlert
                                                                handleDelete={() =>
                                                                    handleBookingDelete(
                                                                        booking.id,
                                                                    )
                                                                }
                                                                message="Are you sure to Delete this booking?"
                                                            >
                                                                <DropdownMenuItem
                                                                    disabled={
                                                                        !actions.canDelete
                                                                    }
                                                                    onSelect={(
                                                                        e,
                                                                    ) =>
                                                                        e.preventDefault()
                                                                    }
                                                                >
                                                                    Delete
                                                                    Booking
                                                                </DropdownMenuItem>
                                                            </DeleteAlert>
                                                            <DropdownMenuItem
                                                                disabled={
                                                                    !actions.canActivate
                                                                }
                                                                onSelect={(
                                                                    e,
                                                                ) => {
                                                                    router.patch(
                                                                        route(
                                                                            "booking.updateStatus",
                                                                            booking.id,
                                                                        ),
                                                                        {
                                                                            status: "active",
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                Activate Booking
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                disabled={
                                                                    !actions.canEnd
                                                                }
                                                                onSelect={(
                                                                    e,
                                                                ) => {
                                                                    router.patch(
                                                                        route(
                                                                            "booking.updateStatus",
                                                                            booking.id,
                                                                        ),
                                                                        {
                                                                            status: "ended",
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                End Booking
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                disabled={
                                                                    !actions.canCancel
                                                                }
                                                                onSelect={(
                                                                    e,
                                                                ) => {
                                                                    router.patch(
                                                                        route(
                                                                            "booking.updateStatus",
                                                                            booking.id,
                                                                        ),
                                                                        {
                                                                            status: "canceled",
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                Cancel Booking
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                disabled={
                                                                    !actions.canRecordDeposit
                                                                }
                                                                onSelect={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    handleOpenDepositCreate(
                                                                        booking,
                                                                    );
                                                                }}
                                                            >
                                                                Record Deposit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                disabled={
                                                                    !actions.canViewDeposit
                                                                }
                                                                onSelect={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    setOpenDepositHistory(
                                                                        true,
                                                                    );
                                                                    setSelectedBookingForDeposit(
                                                                        booking,
                                                                    );
                                                                }}
                                                            >
                                                                View Deposit
                                                                History
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        </HoverCardTrigger>
                                        <HoverCardContent>
                                            <div>
                                                <div>
                                                    <h2 className="text-center font-bold">
                                                        {`${user.name}'s Booking`}
                                                    </h2>
                                                </div>
                                                {unpaid_bills_count > 0 && (
                                                    <div>
                                                        <h3 className="font-bold">
                                                            Unpaid Bills
                                                        </h3>
                                                        <ul>
                                                            {unpaid_bills.map(
                                                                (bill) => (
                                                                    <li
                                                                        key={
                                                                            bill.id
                                                                        }
                                                                    >
                                                                        {toTitleCase(`${bill.type} - ₱${bill.remaining_balance}`)}
                                                                        {bill.status == 'partial'
                                                                            ? `/₱${bill.amount}`
                                                                            : ""}
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
