import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import InputWithLabel from "@/Components/InputWithLabel";
import HouseDialog from "@/Components/HouseDialog";
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
import BookingDialog from "@/Components/BookingDialog";
import DeleteAlert from "@/Components/DeleteAlert";

export default function BookingIndex({ bookings, tenants, rooms }) {
    const today = new Date();
    const next_month = new Date(today);
    next_month.setMonth(next_month.getMonth() + 1);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        tenant_id: "",
        room_id: "",
        move_in_date: today.toISOString().slice(0, 10),
        move_out_date: next_month.toISOString().slice(0, 10),
        deposit_amount: "",
        due_day: 0,
        notes: "",
        status: "pending",
    });

    const [open, setOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    function handleOpenCreate() {
        reset();
        setSelectedBooking(null);
        setOpen(true);
    }

    function handleOpenEdit(booking) {
        setData({
            tenant_id: booking.tenant_id,
            room_id: booking.room_id,
            move_in_date: booking.move_in_date,
            move_out_date: booking.move_out_date,
            deposit_amount: booking.deposit_amount,
            due_day: booking.due_day,
            notes: booking.notes,
            status: booking.status,
        });
        setSelectedBooking(booking);
        setOpen(true);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (selectedBooking) {
            console.log(selectedBooking);
            put(route("bookings.update", selectedBooking.id), {
                onSuccess: () => {
                    reset();
                    setOpen(false);
                    setSelectedBooking(null);
                },
            });
        } else {
            post(route("bookings.store"), {
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        }
    }

    function handleChange(e) {
        const { name, type, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) || 0 : value,
        }));
    }

    function handleDelete(booking_id) {
        router.delete(route("bookings.destroy", booking_id));
    }

    return (
        <div className="flex flex-col p-4 bg-gray-200">
            <div className="flex mb-4">
                <div className="flex-grow">
                    <h1 className="text-2xl">My Bookings</h1>
                    <p>Manage booking</p>
                </div>
                <div className="flex items-end px-4">
                    <BookingDialog
                        setOpen={setOpen}
                        open={open}
                        form={data}
                        errors={errors}
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        processing={processing}
                        rooms={rooms}
                        tenants={tenants}
                        method={selectedBooking ? 'Update' : 'Create'}
                    >
                        <Button
                            className="px-3 py-1 flex items-center"
                            onClick={handleOpenCreate}
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
                                <TableHead className="">Status</TableHead>
                                <TableHead className="">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.map((booking, key) => (
                                <TableRow key={key}>
                                    <TableCell className="flex items-center gap-x-2">
                                        <div>
                                            <Avatar className="h-8 w-8 rounded-lg grayscale">
                                                <AvatarImage
                                                    src={
                                                        booking.tenant.user
                                                            .avatar ?? ""
                                                    }
                                                    alt={
                                                        booking.tenant.user.name
                                                    }
                                                />
                                                <AvatarFallback className="rounded-lg">
                                                    {booking.tenant.user.name
                                                        .slice(0, 1)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm/3">
                                                {booking.tenant.user.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {booking.tenant.user.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm/3">
                                                {booking?.room?.room_number ??
                                                    "-"}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {booking?.room?.house?.name ??
                                                    "-"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="">
                                        {booking?.move_in_date ?? "-"}
                                    </TableCell>
                                    <TableCell className="">
                                        {booking?.move_out_date ?? "-"}
                                    </TableCell>
                                    <TableCell className="">
                                        {booking?.deposit_amount ?? "-"}
                                    </TableCell>
                                    <TableCell className="">
                                        {booking?.status ?? "-"}
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
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            handleOpenEdit(
                                                                booking,
                                                            );
                                                        }}
                                                    >
                                                        Edit Booking
                                                    </DropdownMenuItem>
                                                <DeleteAlert
                                                    handleDelete={() =>
                                                        handleDelete(booking.id)
                                                    }
                                                    message="Are you sure to Delete this booking?"
                                                >
                                                    <DropdownMenuItem
                                                        disabled={booking.status === 'active' ||booking.status === 'pending'}
                                                        onSelect={(e) =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        Delete Booking
                                                    </DropdownMenuItem>
                                                </DeleteAlert>
                                                <DropdownMenuItem
                                                    disabled={booking.status === 'active'}
                                                    onSelect={(e) =>{
                                                        e.preventDefault()
                                                        router.patch(
                                                            route('booking.updateStatus', booking.id), 
                                                            {status: 'active'}
                                                        )
                                                    }}
                                                >
                                                    Activate Booking
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    disabled={booking.status === 'ended'}
                                                    onSelect={(e) =>{
                                                        e.preventDefault()
                                                        router.patch(
                                                            route('booking.updateStatus', booking.id), 
                                                            {status: 'ended'}
                                                        )
                                                    }}
                                                >
                                                    End Booking
                                                </DropdownMenuItem>

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

function HouseCard({ house }) {
    const activeHouse = house.status === "active";
    const max_floor =
        house.max_floor + (house.max_floor > 1 ? " Floors" : " Floor");
    const badgeInfos = [max_floor, house.city];
    return (
        <Card className="relative mx-auto w-full max-w-sm pt-0 shadow-md flex flex-col">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <Badge
                variant="outline"
                className={`absolute z-30 right-5 top-5 rounded-sm ${activeHouse ? "bg-green-300" : "bg-gray-300"}`}
            >
                {house.status.toUpperCase()}
            </Badge>
            <img
                src="https://images.pexels.com/photos/18078684/pexels-photo-18078684.jpeg"
                alt="Event cover"
                className={`relative z-20 aspect-video w-full object-cover brightness-60 dark:brightness-40 ${activeHouse ? "" : "grayscale"}`}
            />
            <CardHeader className="flex-grow pt-2">
                <div className="flex justify-end"></div>
                <CardTitle className="text-xl/7 truncate">
                    {house.name}
                </CardTitle>
                <CardDescription className="flex flex-col">
                    <p className="truncate">
                        <MapPin className="size-4 inline-block" />
                        {house.address}
                    </p>
                </CardDescription>
                <div className="my-2 space-x-2">
                    {badgeInfos.map((info) => (
                        <Badge
                            key={info}
                            variant="outline"
                            className="bg-gray-500 text-white"
                        >
                            {info}
                        </Badge>
                    ))}
                </div>
            </CardHeader>
            <CardFooter>
                <Link className="w-full" href={route("houses.show", house.id)}>
                    <Button className="w-full">
                        Manage Property <ArrowRight />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
