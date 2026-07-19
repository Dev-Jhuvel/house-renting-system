import { useSidebar } from "@/components/ui/sidebar";
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
import { useForm, Link } from "@inertiajs/react";

import { ArrowRight, MapPin, PlusCircleIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function HouseIndex({ houses }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        address: "",
        description: "",
        city: "",
        max_floor: "",
        max_room: "",
        water_rate: "",
        electric_rate: "",
        status: "active",
    });

    const { state } = useSidebar();

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
            [name]: type === "number" && value !== "" ? parseFloat(value) || 0 : value,
        }));
    }

    return (
        <div className="flex flex-col p-4 bg-gray-200">
            <div className="flex mb-4">
                <div className="flex-grow">
                    <h1 className="text-2xl">My Properties</h1>
                    <p>Manage your properties, floors, rooms</p>
                </div>
                <div className="flex items-end px-4">
                    <HouseDialog
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
                            Add House
                        </Button>
                    </HouseDialog>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className={`grid grid-cols-1 ${state === 'collapsed' ? 'grid-cols-4' : 'grid-cols-3'}  gap-8 py-4 px-3 overflow-scroll pb-5 h-full`}>
                    {houses &&
                        houses.map((house) => (
                            <HouseCard house={house} key={house.id} />
                        ))}
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
