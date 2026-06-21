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
    SquareDashedBottom,
    Users,
    Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import InputWithLabel from "@/Components/InputWithLabel";
import DeleteAlert from "@/Components/DeleteAlert";
import RoomDialog from "@/Components/Dialogs/RoomDialog";
import RoomSection from "../Rooms/RoomSection";

export default function RoomShow({ room }) {
    const { data, setData, patch, processing, errors } = useForm(room);

    const [open, setOpen] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        patch(route("rooms.update", data), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    }

    function handleChange(e) {
        const { name, type, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: type === "number" && value !== "" ? parseFloat(value) || 0 : value,
        }));
    }

    function handleDelete(roomId) {
        router.delete(route("rooms.destroy", roomId));
    }
    const maintenanceRoom = room.status === "maintenance";
    const roomDetails = [
        { detail: room.floor, icon: Layers2 },
        { detail: room.type, icon: SquareDashedBottom },
        { detail: room.capacity, icon: Users },
    ];

    console.log(room);
    return (
        <div className="overflow-y-auto">
            <div className="w-full h-[200px] overflow-hidden">
                <img
                    src="https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg"
                    alt="Event cover"
                    className={`relative z-20 inset-0 w-full h-full object-cover brightness-60 dark:brightness-40 ${!maintenanceRoom ? "" : "grayscale"}`}
                />
            </div>
            <div className="py-2 px-4 space-y-2">
                <Link href={route("houses.show", room.house_id)}>
                    <Button className="my-2">
                        <ArrowLeft /> Back to Portfolio
                    </Button>
                </Link>
                <div className="p-4 bg-gray-100 rounded-md border">
                    <div className="">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex justify-between items-center gap-3">
                                <h1 className="text-4xl font-semibold">
                                    Room {room.room_number}
                                </h1>
                                <span>
                                    <Badge
                                        variant="outline"
                                        className={`z-30 rounded-sm ${!maintenanceRoom ? "bg-green-300" : "bg-gray-300"}`}
                                    >
                                        {room.status.toUpperCase()}
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
                                    <RoomDialog
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
                                            disabled={room.booking}
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            Edit Room
                                        </DropdownMenuItem>
                                    </RoomDialog>
                                    <DeleteAlert
                                        handleDelete={() =>
                                            handleDelete(room.id)
                                        }
                                        message="Are you sure to Delete this room?"
                                    >
                                        <DropdownMenuItem
                                            disabled={room.booking}
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            Delete Room
                                        </DropdownMenuItem>
                                    </DeleteAlert>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="grid grid-cols-3 gap-y-1">
                            {roomDetails.map(({ detail, icon }) => {
                                const Icon = icon;
                                return (
                                    <p className="flex items-center text-lg text-gray-700 gap-1">
                                        <Icon className="size-5" /> {detail}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
