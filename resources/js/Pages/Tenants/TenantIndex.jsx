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
import TenantDialog from "@/Components/Dialogs/TenantDialog";
import DeleteAlert from "@/Components/DeleteAlert";
import TenantColumn from "@/Components/TenantColumn";
import RoomColumn from "@/Components/RoomColumn";

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
            [name]: type === "number" && value !== "" ? parseFloat(value) || 0 : value,
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
                        method={selectedTenant ? "Update" : "Create"}
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
                                <TableHead className="">Total Bills</TableHead>
                                <TableHead className="">Total Payments</TableHead>
                                <TableHead className="">Balance</TableHead>
                                <TableHead className="">Status</TableHead>
                                <TableHead className="">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tenants.map((tenant, key) => (
                                <TableRow key={key}>
                                    <TableCell className="flex items-center gap-x-2">
                                        <TenantColumn name={tenant.user.name} email={tenant.user.email} />
                                    </TableCell>
                                    <TableCell className="">
                                        <RoomColumn room_number={tenant.booking?.room?.room_number} house_name={tenant.booking?.room?.house?.name} />
                                    </TableCell>
                                    {/* <TableCell className="">{tenant.booking?.move_in_date ?? "-"}</TableCell> */}
                                    <TableCell className="">
                                        {tenant.booking?.total_bills ??
                                            "-"}
                                    </TableCell>
                                     <TableCell className="">
                                        {tenant.booking?.total_paid  ??
                                            "-"}
                                    </TableCell>
                                     <TableCell className="">
                                        {tenant.booking?.balance  ??
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
                                                        disabled={
                                                            tenant.status ===
                                                            "active"
                                                        }
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
