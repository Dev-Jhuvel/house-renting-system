import { useSidebar } from "@/components/ui/sidebar";
import AddCard from "@/Components/AddCard";
import RoomDialog from "@/Components/Dialogs/RoomDialog.jsx";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { statusColor, toOrdinal } from "../../utils/general.js";
import { Link, useForm } from "@inertiajs/react";
import { ArrowRight, DoorClosed, Layers2, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
export default function RoomSection({ rooms, house }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        house_id: house.id,
        room_number: "",
        description: "",
        floor: "",
        type: "single",
        status: "available",
        capacity: "",
        monthly_rent: "",
    });

    const { state } = useSidebar();

    const [open, setOpen] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        post(route("rooms.store"), {
            onSuccess: () => {
                setOpen(false);
                reset();
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

    useEffect(() =>{
        console.log(state);
    }, [state])
    return (
        <div className="p-4 bg-gray-100 rounded-md border">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-4xl font-semibold">Manage Rooms</h1>
                <RoomDialog
                    setOpen={setOpen}
                    open={open}
                    form={data}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    processing={processing}
                    method="Create"
                >
                    <Button
                        className="px-3 py-1 flex items-center"
                        disabled={house.rooms_count >= house.max_room}
                    >
                        <PlusIcon className="hover:text-primary" size={32} />
                        Add Room
                    </Button>
                </RoomDialog>
            </div>
            <div className={`grid ${state === 'collapsed' ? 'grid-cols-4' : 'grid-cols-3'} gap-8 p-4`}>
                {rooms &&
                    rooms.map((room, key) => (
                        <RoomCard key={key} room={room} />
                    ))}
            </div>
        </div>
    );
}

function RoomCard({ room }) {
    const maintenanceRoom = room.status === "maintenance";
    const badgeInfos = [room.type];
    return (
        <Card className="relative mx-auto w-full max-w-sm pt-0 shadow-md flex flex-col">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <Badge
                variant="outline"
                className={`absolute z-30 right-5 top-5 rounded-sm ${statusColor(room.status)}`}
            >
                {room.status.toUpperCase()}
            </Badge>
            <img
                src="https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg"
                alt="Event cover"
                className={`relative z-20 aspect-video w-full object-cover brightness-60 dark:brightness-40 ${!maintenanceRoom ? "" : "grayscale"}`}
            />
            <CardHeader className="flex-grow pt-2">
                <div className="flex justify-end"></div>
                <CardTitle className="text-xl/7">
                    Room {room.room_number}
                </CardTitle>
                <CardDescription className="flex flex-col">
                    <p className="text-sm">
                        <Layers2 className="size-4 mr-2 inline-block" />
                        {toOrdinal(room.floor) + " Floor"}
                    </p>
                </CardDescription>
                <div className="my-2 space-x-2">
                    {badgeInfos.map((info) => (
                        <Badge
                            variant="outline"
                            key={info}
                            className="bg-gray-500 text-white"
                        >
                            {info}
                        </Badge>
                    ))}
                </div>
            </CardHeader>
            <CardFooter>
                <Link className="w-full" href={route("rooms.show", room.id)}>
                    <Button className="w-full">
                        Manage Room <ArrowRight />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
