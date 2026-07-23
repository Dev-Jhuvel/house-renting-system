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
import InputWithLabel from "../InputWithLabel";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Search } from "lucide-react";
import LocationPicker from "../Maps/LocationPicker";

export default function HouseDialog({
    form,
    setData,
    handleSubmit,
    handleChange,
    processing,
    open,
    setOpen,
    errors,
    method,
    children,
}) {
    const process = method === "Create" ? "Creating..." : "Updating...";

    const searchAddress = async (e) => {
        e.preventDefault();
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.address)}`
        );

        const data = await res.json();

        if (!data.length) {
            alert("Address not found.");
            return;
        }

        setData("latitude", Number(data[0].lat));
        setData("longitude", Number(data[0].lon));
        console.log(form);
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[660px]">
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
                                className="col-span-4"
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
                                label="Max Room"
                                id="max_room"
                                value={form.max_room}
                                name="max_room"
                                type="number"
                                error={errors.max_room}
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
                            <div>
                                <Label>Status</Label>
                                <div className="flex items-center justify-center h-10">
                                    <Switch
                                        checked={form.status === "active"}
                                        onCheckedChange={(checked) =>
                                            handleChange({
                                                target: {
                                                    name: "status",
                                                    type: "text",
                                                    value: checked
                                                        ? "active"
                                                        : "inactive",
                                                },
                                            })
                                        }
                                        // disabled
                                        aria-readonly
                                    />
                                </div>
                            </div>
                            <div className="flex col-span-5 items-end">
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
                                <Button 
                                    variant="ghost" 
                                    disabled={form.address === ''}
                                    onClick={(e)=>searchAddress(e)}>
                                        <Search />
                                </Button>
                           </div>
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
                             {open && form.latitude && form.longitude && (
                            <LocationPicker 
                                className="col-span-8 pr-6"
                                position={[form.latitude, form.longitude]} 
                                onChange={([lat, lng]) => {
                                    setData("latitude", lat);
                                    setData("longitude", lng);
                                }}
                            />
                        )}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild onClick={() => setOpen(false)}>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? process : method}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
