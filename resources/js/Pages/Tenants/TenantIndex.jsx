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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useForm, Link, router } from "@inertiajs/react";

import {
    ArrowRight,
    EllipsisVertical,
    MapPin,
    PlusCircleIcon,
    PlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import TenantDialog from "@/Components/TenantDialog";
import DeleteAlert from "@/Components/DeleteAlert";

export default function TenantIndex({ tenants }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        address: "",
        emergency_contact: "",
        id_type: "",
        id_number: "",
        status: "active",
    });

    const [open, setOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState(null);

    function handleOpenCreate() {
        reset();
        setSelectedTenant(null);
        setOpen(true);
    }

    function handleOpenEdit(tenant) {
        setData({
            name: tenant.user.name,
            email: tenant.user.email,
            phone: tenant.phone,
            address: tenant.address,
            emergency_contact: tenant.emergency_contact,
            id_type: tenant.id_type,
            id_number: tenant.id_number,
            status: tenant.status,
        });
        setSelectedTenant(tenant);
        setOpen(true);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (selectedTenant) {
            put(route("tenants.update", selectedTenant.id), {
                onSuccess: () => {
                    reset();
                    setOpen(false);
                    setSelectedTenant(null);
                },
            });
        } else {
            post(route("tenants.store"), {
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        }
    }

    function handleDelete(tenant_id) {
        router.delete(route("tenants.destroy", tenant_id));
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
                    <h1 className="text-2xl">My Tenants</h1>
                    <p>Manage tenants</p>
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
                        method={selectedTenant ? 'Update' : 'Create'}
                    >
                        <Button
                            className="px-3 py-1 flex items-center"
                            onClick={handleOpenCreate}
                        >
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
                                <TableHead className="">Name</TableHead>
                                <TableHead className="">
                                    Room/Property
                                </TableHead>
                                {/* <TableHead className="">Move-in</TableHead> */}
                                <TableHead className="">Rent</TableHead>
                                {/* <TableHead className="">Balance</TableHead> */}
                                <TableHead className="">Status</TableHead>
                                <TableHead className="">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tenants.map((tenant, key) => (
                                <TableRow key={key}>
                                    <TableCell className="flex items-center gap-x-2">
                                        <div>
                                            <Avatar className="h-8 w-8 rounded-lg grayscale">
                                                <AvatarImage
                                                    src={tenant.user.avatar}
                                                    alt={tenant.user.name}
                                                />
                                                <AvatarFallback className="rounded-lg">
                                                    {tenant.user.name
                                                        .slice(0, 1)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm/3">
                                                {tenant.user.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {tenant.user.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm/3">
                                                {tenant.booking?.room
                                                    ?.room_number ?? "-"}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {tenant.booking?.room?.house
                                                    ?.name ?? "-"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    {/* <TableCell className="">{tenant.booking?.move_in_date ?? "-"}</TableCell> */}
                                    <TableCell className="">
                                        {tenant.booking?.room?.monthly_rent ??
                                            "-"}
                                    </TableCell>
                                    {/* <TableCell className="">{tenant.booking?.balance ?? "-"}</TableCell> */}
                                    <TableCell className="">
                                        {tenant.status ?? "-"}
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
                                                        handleOpenEdit(tenant);
                                                    }}
                                                >
                                                    Edit Tenant
                                                </DropdownMenuItem>
                                                <DeleteAlert
                                                    handleDelete={() =>
                                                        handleDelete(tenant.id)
                                                    }
                                                    message="Are you sure to Delete this tenant?"
                                                >
                                                    <DropdownMenuItem
                                                        disabled={tenant.status === 'active'}
                                                        onSelect={(e) =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        Delete Tenant
                                                    </DropdownMenuItem>
                                                </DeleteAlert>
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
