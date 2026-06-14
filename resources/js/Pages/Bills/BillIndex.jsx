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
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useForm, Link } from "@inertiajs/react";

import { ArrowRight, EllipsisVertical, MapPin, PlusCircleIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import TenantDialog from "@/Components/TenantDialog";

export default function BillsIndex({ bills }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        phone: "",
        address: "",
        emergency_contact: "",
        id_type: "",
        id_number: "",
        status: "active",
    });

    const [open, setOpen] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        post(route("houses.store"), {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

    function handleChange(e) {
        const { name, type, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) || 0 : value,
        }));
    }

    return (
        <div className="flex flex-col p-4 bg-gray-200">
            <div className="flex mb-4">
                <div className="flex-grow">
                    <h1 className="text-2xl">My Bookings</h1>
                    <p>Manage booking</p>
                </div>
                <div className="flex items-end px-4">
                    <TenantDialog
                        setOpen={setOpen}
                        open={open}
                        form={data}
                        errors={errors}
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        processing={processing}
                        method="Create"
                    >
                        <Button className="px-3 py-1 flex items-center">
                            <PlusIcon
                                className="hover:text-primary"
                                size={32}
                            />
                            Add Tenant
                        </Button>
                    </TenantDialog>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="gap-8 py-4 px-3 overflow-scroll pb-5 h-full">
                    <Table>
                        <TableCaption>A list of your tenants.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="">Tenant Name</TableHead>
                                <TableHead className="">Property/Room</TableHead>
                                <TableHead className="">Type</TableHead>
                                <TableHead className="">Amount</TableHead>
                                <TableHead className="">Bill Date</TableHead>
                                <TableHead className="">Due Date</TableHead>
                                <TableHead className="">Status</TableHead>
                                <TableHead className="">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bills.map((bill, key) => (
                                <TableRow key={key}>
                                    <TableCell className="flex items-center gap-x-2">
                                        <div>
                                            <Avatar className="h-8 w-8 rounded-lg grayscale">
                                                <AvatarImage
                                                    src={bill.booking.tenant.user?.avatar ?? ""}
                                                    alt={bill.booking.tenant.user?.name}
                                                />
                                                <AvatarFallback className="rounded-lg">
                                                    {bill.booking.tenant.user.name.slice(0,1).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm/3">
                                                {bill.booking.tenant.user.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {bill.booking.tenant.user.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm/3">{bill.booking?.room?.room_number ?? "-"}</span>
                                            <span className="text-xs text-gray-500">{bill.booking?.room?.house?.name ?? "-"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="">{bill.type ?? "-"}</TableCell>
                                    <TableCell className="">P{bill.amount ?? "-"}</TableCell>
                                    <TableCell className="">{bill.bill_date ?? "-"}</TableCell>
                                    <TableCell className="">{bill.due_date ?? "-"}</TableCell>
                                    <TableCell className="">{bill?.status ?? "-"}</TableCell>
                                    <TableCell className="">
                                        <Button variant="ghost">
                                            <EllipsisVertical />
                                        </Button>
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
