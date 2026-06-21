import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";

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
    DoorClosed,
    Droplets,
    Ellipsis,
    Layers,
    Layers2,
    MapPin,
    PlusCircleIcon,
    PlusIcon,
    Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import HouseDialog from "@/Components/HouseDialog";
import InputWithLabel from "@/Components/InputWithLabel";
import DeleteAlert from "@/Components/DeleteAlert";
import RoomDialog from "@/Components/RoomDialog";
import RoomSection from "../Rooms/RoomSection";

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

    function handleDelete(house_id) {
        router.delete(route("houses.destroy", house_id));
    }
    const activeHouse = house.status === "active";
    const max_floor = house.max_floor + house.max_floor > 1 ? " floors" : " floor";
    const houseDetails = [
        { detail: house.address, icon: MapPin },
        { detail: house.water_rate, icon: Droplets },
        { detail: max_floor, icon: Layers2},
        { detail: house.city, icon: Building2 },
        { detail: house.electric_rate + "kwh", icon: Zap },
        { detail: `${house.occupied_count}/${house.max_room}` , icon: DoorClosed },
    ];
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
                            <div className="flex justify-between items-center gap-3">
                                <h1 className="text-4xl font-semibold">
                                    {house.name}
                                </h1>
                                <span>
                                    <Badge
                                    variant="outline"
                                    className={`z-30 rounded-sm ${activeHouse ? "bg-green-300" : "bg-gray-300"}`}
                                >
                                    {house.status.toUpperCase()}
                                </Badge>
                                </span>
                            </div>
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
                                        message="Are you sure to Delete this property?"
                                    >
                                        <DropdownMenuItem
                                            disabled={house.rooms_count > 0}
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            Delete Property
                                        </DropdownMenuItem>
                                    </DeleteAlert>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="grid grid-cols-3 gap-y-1">
                            {houseDetails.map(({ detail, icon }) => {
                                const Icon = icon;
                                return (
                                    <p className="flex items-center text-lg text-gray-700 gap-1" key={detail}>
                                        <Icon className="size-5" /> {detail}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <RoomSection rooms={house.rooms} house={house}  />
            </div>
        </div>
    );
}
