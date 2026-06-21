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
import InputWithLabel from "./InputWithLabel";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import InputSelect from "./InputSelect";

export default function RoomDialog({
    form,
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
    const room_types = [
        'Single',
        'Double',
        'Studio',
        'Dormitory'
    ];
    const room_status = [
        'Available',
        'Occupied',
        'Reserved',
        'Maintenance'
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={() => setOpen(true)} asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="py-2">
                        <DialogTitle>Add New Property</DialogTitle>
                    </DialogHeader>
                    <div className="h-[270px] overflow-y-auto scroll">
                        <div className="grid gap-4 grid-cols-8 py-4 px-2">
                            <InputWithLabel
                                label="Room Number"
                                id="room_number"
                                value={form.room_number}
                                name="room_number"
                                onChange={handleChange}
                                error={errors.room_number}
                                placeholder="A01"
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="Floor"
                                id="floor"
                                value={form.floor}
                                name="floor"
                                onChange={handleChange}
                                error={errors.floor}
                                type="number"
                                placeholder="3"
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="Monthly Rent"
                                id="monthly_rent"
                                value={form.monthly_rent}
                                name="monthly_rent"
                                onChange={handleChange}
                                error={errors.monthly_rent}
                                placeholder="3,500"
                                type="number"
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="Capacity"
                                id="capacity"
                                value={form.capacity}
                                name="capacity"
                                onChange={handleChange}
                                error={errors.capacity}
                                placeholder="How many person can stay?"
                                type="number"
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="Description"
                                id="description"
                                value={form.description}
                                name="description"
                                isTextArea={true}
                                onChange={handleChange}
                                error={errors.description}
                                placeholder="Room description"
                                className="col-span-8"
                            />
                            <InputSelect
                                id="type"
                                label="Type"
                                name="type"
                                value={form.type}
                                options={room_types}
                                onChange={handleChange}
                                placeholder="Select Room Type"
                                error={errors.type}
                                className="col-span-4"
                            />
                            <InputSelect
                                id="status"
                                label="Status"
                                name="status"
                                value={form.status}
                                options={room_status}
                                onChange={handleChange}
                                placeholder="Select Room status"
                                error={errors.status}
                                className="col-span-4"
                            />
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
