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

export default function HouseDialog({
    form,
    handleSubmit,
    handleChange,
    processing,
    open,
    setOpen,
    errors,
    method,
    children
}) {
    const process = method === 'Create' ? 'Creating...' : 'Updating...';
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={() => setOpen(true)}>
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