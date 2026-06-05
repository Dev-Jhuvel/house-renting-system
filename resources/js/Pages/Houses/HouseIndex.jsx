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

import { ArrowRight, MapPin, PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function HouseIndex({ houses }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: "",
        address: "",
        description: "",
        city: "",
        max_floor: 1,
        water_rate: 0,
        electric_rate: 0,
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
                    <h1 className="text-2xl">My Properties</h1>
                    <p>Manage owners properties</p>
                </div>
                <div className="flex items-end px-4">
                    <Button size="sm">View All</Button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-4 px-3 overflow-scroll pb-5 h-full">
                    {houses &&
                        houses.map((house) => (
                            <HouseCard house={house} key={house.id} />
                        ))}
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
                        <AddCard message="Expand your portfolio with a new property" />
                    </HouseDialog>
                </div>
            </div>
        </div>
    );
}

function HouseCard({ house }) {
    const activeHouse = house.status === "active";
    return (
        <Card className="relative mx-auto w-full max-w-sm pt-0 shadow-md">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
                src="https://images.pexels.com/photos/18078684/pexels-photo-18078684.jpeg"
                alt="Event cover"
                className={`relative z-20 aspect-video w-full object-cover brightness-60 dark:brightness-40 ${activeHouse ? "" : "grayscale"}`}
            />
            <CardHeader>
                <div className="flex justify-end">
                    <Badge
                        variant="outline"
                        className={`${activeHouse ? "bg-green-300" : "bg-gray-300"}`}
                    >
                        {house.status.toUpperCase()}
                    </Badge>
                </div>
                <CardTitle>{house.name}</CardTitle>
                <CardDescription className="flex items-center">
                    <MapPin className="size-4" /> {house.address}
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Link href={route("houses.show", house.id)}>
                    <Button className="w-full">
                        Manage Property <ArrowRight />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
