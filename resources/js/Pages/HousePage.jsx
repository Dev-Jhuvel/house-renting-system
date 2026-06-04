import InputWithLabel from "@/Components/InputWithLabel";
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

import { PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function HousePage() {
    const defaultForm = {
        name: "",
        address: "",
        description: "",
        city: "",
        maxFloor: 1,
        waterRate: 0,
        electricRate: 0,
    };
    const { data, setData, post, processing, errors, reset } =
        useForm(defaultForm);

    const notChange = JSON.stringify(data) === JSON.stringify(defaultForm);

    console.log(notChange);

    function handleSubmit(e) {
        e.preventDefault();
        post(route("houses.store"), {
            onFinish: () => reset(),
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
                <div className="grid grid-cols-3 gap-8 ">
                    <NewHouseDialog
                        form={data}
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        processing={processing}
                        notChange={notChange}
                    />
                </div>
            </div>
        </div>
    );
}

function AddHouseButton() {
    return (
        <Card className="bg-gray-300 h-52">
            <CardContent className="flex flex-col items-center justify-center h-full">
                <PlusCircleIcon />
                <p className="text-xsm/10 text-center">
                    Expand your portfolio with a new property
                </p>
            </CardContent>
        </Card>
    );
}

function NewHouseDialog({
    form,
    handleSubmit,
    handleChange,
    processing,
    notChange,
}) {
    return (
        <Dialog>
            <DialogTrigger>
                <AddHouseButton />
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
                                placeholder="New York"
                                className="col-span-6"
                            />
                            <InputWithLabel
                                label="Max Floor"
                                id="max_floor"
                                value={form.maxFloor}
                                name="maxFloor"
                                type="number"
                                onChange={handleChange}
                                placeholder="2"
                                className="col-span-2"
                            />
                            <InputWithLabel
                                label="Description"
                                id="description"
                                value={form.description}
                                name="description"
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
                                onChange={handleChange}
                                placeholder="123 St. New York City"
                                className="col-span-6"
                            />
                            <InputWithLabel
                                label="City"
                                id="city"
                                value={form.city}
                                name="city"
                                onChange={handleChange}
                                placeholder="South Side"
                                className="col-span-2"
                            />
                            <InputWithLabel
                                label="Water Rate"
                                id="water_rate"
                                value={form.waterRate}
                                name="waterRate"
                                type="number"
                                onChange={handleChange}
                                placeholder="0.00"
                                className="col-span-3"
                            />
                            <InputWithLabel
                                label="Electric Rate"
                                id="electric_rate"
                                value={form.electricRate}
                                name="electricRate"
                                type="number"
                                onChange={handleChange}
                                placeholder="0.00"
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={processing || notChange}
                        >
                            {processing ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
