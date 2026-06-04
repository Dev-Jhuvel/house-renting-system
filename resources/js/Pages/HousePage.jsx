import InputWithLabel from "@/Components/InputWithLabel";
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
import { useForm } from "@inertiajs/react";

import { ArrowRight, MapPin, PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function HousePage({ houses }) {
    const { data, setData, post, processing, errors, reset } = useForm({
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
        <div className="w-full h-screen bg-gray-200 p-4">
            <div className="flex">
                <div className="flex-grow">
                    <h1 className="text-2xl">My Properties</h1>
                    <p>Manage owners houses</p>
                </div>
                <div className="flex items-end px-4">
                    <Button size="sm">View All</Button>
                </div>
            </div>
            <div className="w-full border h-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-4 px-3 h-full overflow-scroll">
                    {houses &&
                        houses.map((house, key) => (
                            <HouseCard house={house} key={key} />
                        ))}
                    <NewHouseDialog
                        className="grid-g"
                        setOpen={setOpen}
                        open={open}
                        form={data}
                        errors={errors}
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        processing={processing}
                    />
                </div>
            </div>
        </div>
    );
}

function AddHouseButton() {
    return (
        <Card className="mx-auto w-full h-full max-w-sm pt-0 shadow-md">
            <CardContent className="flex flex-col items-center justify-center h-full">
                <PlusCircleIcon />
                <p className="text-xsm/10 text-center">
                    Expand your portfolio with a new property
                </p>
            </CardContent>
        </Card>
    );
}

function HouseCard({ house }) {
    const activeHouse = house.status === 'active';
    return (
        <Card className="relative mx-auto w-full max-w-sm pt-0 shadow-md">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
                src="https://images.pexels.com/photos/18078684/pexels-photo-18078684.jpeg"
                alt="Event cover"
                className={`relative z-20 aspect-video w-full object-cover brightness-60 dark:brightness-40 ${activeHouse ? '' : 'grayscale'}`}
            />
            <CardHeader>
                <div className="flex justify-end">
                    <Badge variant="outline" className={`${activeHouse ? 'bg-red-300' : 'bg-gray-300'}`}>{house.status.toUpperCase()}</Badge>
                </div>
                <CardTitle>{house.name}</CardTitle>
                <CardDescription className="flex items-center">
                    {" "}
                    <MapPin className="size-4" /> {house.address}
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button className="w-full">
                    Manage Property <ArrowRight />{" "}
                </Button>
            </CardFooter>
        </Card>
    );
}

function NewHouseDialog({
    form,
    handleSubmit,
    handleChange,
    processing,
    open,
    setOpen,
    errors,
}) {
    return (
        <Dialog open={open} setOpen={setOpen}>
            <DialogTrigger onClick={()=> setOpen(true)}>
                <AddHouseButton  />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="py-2">
                        <DialogTitle>Add New Property</DialogTitle>
                    </DialogHeader>
                    <div className="h-[270px] overflow-y-auto scroll">
                        <div className="grid gap-4 grid-cols-8 py-4 px-2">
                            <InputWithLabel
                                label="Name"
                                id="name"
                                value={form.name}
                                name="name"
                                onChange={handleChange}
                                error={errors.name}
                                placeholder="New York"
                                className="col-span-5"
                            />
                            <InputWithLabel
                                label="Max Floor"
                                id="max_floor"
                                value={form.max_floor}
                                name="max_floor"
                                type="number"
                                error={errors.max_floor}
                                onChange={handleChange}
                                placeholder="3"
                                className="col-span-2"
                            />
                            <InputWithLabel
                                label="Description"
                                id="description"
                                value={form.description}
                                name="description"
                                error={errors.description}
                                onChange={handleChange}
                                placeholder="Calm Place..."
                                isTextArea={true}
                                className="col-span-8"
                            />
                            <InputWithLabel
                                label="Address"
                                id="address"
                                value={form.address}
                                name="address"
                                error={errors.address}
                                onChange={handleChange}
                                placeholder="123 St. New York City"
                                className="col-span-5"
                            />
                            <InputWithLabel
                                label="City"
                                id="city"
                                value={form.city}
                                name="city"
                                error={errors.city}
                                onChange={handleChange}
                                placeholder="South Side"
                                className="col-span-3"
                            />
                            <InputWithLabel
                                label="Water Rate"
                                id="water_rate"
                                value={form.water_rate}
                                name="water_rate"
                                error={errors.water_rate}
                                type="number"
                                onChange={handleChange}
                                placeholder="0.00"
                                className="col-span-3"
                            />
                            <InputWithLabel
                                label="Electric Rate"
                                id="electric_rate"
                                value={form.electric_rate}
                                error={errors.electric_rate}
                                name="electric_rate"
                                type="number"
                                onChange={handleChange}
                                placeholder="0.00"
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild onClick={()=> setOpen(false)}>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
