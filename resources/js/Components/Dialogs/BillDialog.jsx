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

export default function BillDialog({
    form,
    handleSubmit,
    handleChange,
    processing,
    open,
    setOpen,
    errors,
    method,
    children,
    bookings,
}) {
    const process = method === "Create" ? "Creating..." : "Updating...";
    const bill_types = ["Rent", "Water", "Electric", "Repair", "Other"];
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="py-2">
                        <DialogTitle>
                            {method === "Create" ? "Add New " : "Update "} Bill
                        </DialogTitle>
                    </DialogHeader>
                    <div className="h-[270px] overflow-y-auto scroll">
                        <div className="grid gap-4 grid-cols-8 py-4 px-2">
                            <DatePicker
                                label="Bill Date"
                                id="bill_date"
                                name="bill_date"
                                onChange={handleChange}
                                value={form.bill_date}
                                error={errors.bill_date}
                                className="col-span-4"
                            />
                            <DatePicker
                                label="Due Date"
                                id="due_date"
                                name="due_date"
                                onChange={handleChange}
                                value={form.due_date}
                                error={errors.due_date}
                                className="col-span-4"
                            />
                            <InputSelect
                                name="booking_id"
                                id="booking_id"
                                label="Bookings"
                                value={form.booking_id}
                                options={bookings}
                                onChange={handleChange}
                                disabled={method === "Update"}
                                placeholder="Select Booking"
                                error={errors.booking_id}
                                className="col-span-4"
                            />
                            <InputSelect
                                name="type"
                                id="type"
                                label="Bill Types"
                                value={form.type}
                                options={bill_types}
                                onChange={handleChange}
                                disabled={method === "Update"}
                                placeholder="Select Bill Type"
                                error={errors.type}
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="Title"
                                id="title"
                                value={form.title}
                                name="title"
                                onChange={handleChange}
                                error={errors.title}
                                placeholder="Juan's Bills"
                                className="col-span-8"
                            />
                            <InputWithLabel
                                label="Previous Reading"
                                id="previous_reading"
                                value={form.previous_reading}
                                name="previous_reading"
                                onChange={handleChange}
                                error={errors.previous_reading}
                                placeholder="123456789"
                                type="number"
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="Current Reading"
                                id="current_reading"
                                value={form.current_reading}
                                name="current_reading"
                                onChange={handleChange}
                                error={errors.current_reading}
                                placeholder="123456789"
                                type="number"
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="Rate Used"
                                id="rate_used"
                                value={form.rate_used}
                                name="rate_used"
                                onChange={handleChange}
                                error={errors.rate_used}
                                placeholder="12.5"
                                type="number"
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="Amount"
                                id="amount"
                                value={form.amount}
                                name="amount"
                                onChange={handleChange}
                                error={errors.amount}
                                placeholder="2500"
                                type="number"
                                className="col-span-4"
                            />
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
