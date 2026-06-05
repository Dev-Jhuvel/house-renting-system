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
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Form } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Link, useForm, router } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    Droplets,
    Ellipsis,
    Layers,
    MapPin,
    PlusCircleIcon,
    PlusIcon,
    Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import HouseDialog from "@/Components/HouseDialog";
import InputWithLabel from "@/Components/InputWithLabel";
import DeleteAlert from "@/Components/DeleteAlert";

export default function HouseShow({ house }) {
    const { data, setData, patch, processing, errors } = useForm(house);

    const [open, setOpen] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        patch(route("houses.update", data), {
            onSuccess: () => {
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

    function handleDelete(houseId) {
        router.delete(route("houses.destroy", houseId));
    }
    const activeHouse = house.status === "active";
    return (
        <div className="overflow-y-auto">
            <div className="w-full h-[200px] overflow-hidden">
                <img
                    src="https://images.pexels.com/photos/18078684/pexels-photo-18078684.jpeg"
                    alt="Event cover"
                    className={`relative z-20 inset-0 w-full h-full object-cover brightness-60 dark:brightness-40 ${activeHouse ? "" : "grayscale"}`}
                />
            </div>
            <div className="py-2 px-4 space-y-2">
                <Link href={route("houses.index")}>
                    <Button className="my-2">
                        <ArrowLeft /> Back to Portfolio
                    </Button>
                </Link>
                <div className="p-4 bg-gray-100 rounded-md border">
                    <div className="">
                        <div className="flex justify-between items-center mb-2">
                            <h1 className="text-4xl font-semibold">
                                {house.name}
                            </h1>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="px-3 py-1">
                                        <Ellipsis
                                            className="hover:text-primary"
                                            size={32}
                                        />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>
                                        Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <HouseDialog
                                        setOpen={setOpen}
                                        open={open}
                                        form={data}
                                        errors={errors}
                                        handleSubmit={handleSubmit}
                                        handleChange={handleChange}
                                        processing={processing}
                                        method="Update"
                                    >
                                        <DropdownMenuItem
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            Edit Property
                                        </DropdownMenuItem>
                                    </HouseDialog>
                                    <DeleteAlert
                                        handleDelete={() =>
                                            handleDelete(house.id)
                                        }
                                    >
                                        <DropdownMenuItem
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            Delete Property
                                        </DropdownMenuItem>
                                    </DeleteAlert>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="grid grid-cols-3 gap-y-1">
                            <p className="flex items-center text-xl text-gray-700 gap-1">
                                <MapPin className="size-4" /> {house.address}
                            </p>
                            <p className="flex items-center text-xl text-gray-700 gap-1">
                                <Building2 className="size-4" /> {house.city}
                            </p>
                            <p className="flex items-center text-xl text-gray-700 gap-1">
                                <Layers className="size-4" /> {house.max_floor}{" "}
                                {house.max_floor > 1 ? "floors" : "floor"}
                            </p>
                            <p className="flex items-center text-xl text-gray-700 gap-1">
                                <Zap className="size-4" /> {house.electric_rate}{" "}
                                kwh
                            </p>
                            <p className="flex items-center text-xl text-gray-700 gap-1">
                                <Droplets className="size-4" />{" "}
                                {house.water_rate}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-100 rounded-md border">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-4xl font-semibold">Manage Rooms</h1>
                        <Button className="px-3 py-1 flex items-center">
                            <PlusIcon
                                className="hover:text-primary"
                                size={32}
                            />
                            Add Room
                        </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                        <AddCard message="Add new Room" />
                    </div>
                </div>
            </div>
        </div>
    );
}
