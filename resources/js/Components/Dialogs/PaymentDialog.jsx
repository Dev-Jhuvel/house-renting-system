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

export default function PaymentDialog({
    form,
    handleSubmit,
    handleChange,
    processing,
    open,
    setOpen,
    errors,
    method,
    bill
}) {
    const process = "Recording...";
    const payment_types = ["Cash", "Gcash", "Bank Transfer"];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* No DialogTrigger — controlled by parent via open prop */}
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="py-2">
                        <DialogTitle>
                            Record Payment
                        </DialogTitle>
                    </DialogHeader>
                    <div className="h-[270px] overflow-y-auto scroll">
                        <div className="grid gap-4 grid-cols-8 py-4 px-2">
                            <DatePicker
                                label="Paid At"
                                id="paid_at"
                                name="paid_at"
                                onChange={handleChange}
                                value={form.paid_at}
                                error={errors.paid_at}
                                className="col-span-4"
                            />
                            <InputSelect
                                label="Method"
                                id="method"
                                name="method"
                                value={form.method}
                                options={payment_types}
                                onChange={handleChange}
                                placeholder="Select Method"
                                error={errors.method}
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="Amount Paid"
                                id="amount_paid"
                                name="amount_paid"
                                value={form.amount_paid}
                                onChange={handleChange}
                                error={errors.amount_paid}
                                placeholder={`Amount Due: ${bill?.remaining_balance}`}
                                type="number"
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="Reference Number"
                                id="reference_number"
                                name="reference_number"
                                value={form.reference_number}
                                onChange={handleChange}
                                error={errors.reference_number}
                                placeholder="GC-2025-00001"
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="Notes"
                                id="notes"
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                error={errors.notes}
                                placeholder="Notes..."
                                isTextArea={true}
                                className="col-span-8"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
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
