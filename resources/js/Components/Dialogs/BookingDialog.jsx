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
import DatePicker from "@/Components/DatePicker";
import InputSelect from "../InputSelect";

export default function BookingDialog({
    form,
    handleSubmit,
    handleChange,
    processing,
    open,
    setOpen,
    errors,
    method,
    children,
    tenants,
    rooms,
}) {
    const process = method === "Create" ? "Creating..." : "Updating...";
    const booking_status = ["Active", "Pending", "Ended", "Canceled"];
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="py-2">
                        <DialogTitle>
                            {method === "Create" ? "Add New " : "Update "}
                            Booking
                        </DialogTitle>
                    </DialogHeader>
                    <div className="h-[270px] overflow-y-auto scroll">
                        <div className="grid gap-4 grid-cols-8 py-4 px-2">
                            <DatePicker
                                label="Move in"
                                id="move_in_date"
                                name="move_in_date"
                                onChange={handleChange}
                                value={form.move_in_date}
                                error={errors.move_in_date}
                                className="col-span-4"
                            />
                            <DatePicker
                                label="Move out"
                                id="move_out_date"
                                name="move_out_date"
                                onChange={handleChange}
                                value={form.move_out_date}
                                error={errors.move_out_date}
                                className="col-span-4"
                            />
                            <InputSelect
                                name="tenant_id"
                                id="tenant_id"
                                label="Tenant"
                                value={form.tenant_id}
                                options={tenants}
                                onChange={handleChange}
                                disabled={method === "Update"}
                                placeholder="Select Tenant Type"
                                error={errors.tenant_id}
                                className="col-span-4"
                            />
                            <InputSelect
                                name="room_id"
                                id="room_id"
                                label="Rooms"
                                value={form.room_id}
                                options={rooms}
                                onChange={handleChange}
                                disabled={method === "Update"}
                                placeholder="Select Room"
                                error={errors.room_id}
                                className="col-span-4"
                            />
                            {method === "Update" && (
                                <InputSelect
                                    name="status"
                                    id="status"
                                    label="Status"
                                    value={form.status}
                                    options={booking_status}
                                    onChange={handleChange}
                                    placeholder="Select Status"
                                    error={errors.status}
                                    className="col-span-4"
                                />
                            )}
                            <InputWithLabel
                                label="Notes"
                                id="notes"
                                value={form.notes}
                                name="notes"
                                isTextArea={true}
                                onChange={handleChange}
                                error={errors.notes}
                                placeholder="Notes..."
                                className="col-span-8"
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
