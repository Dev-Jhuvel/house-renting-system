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

export default function DepositDialog({
    form,
    handleSubmit,
    handleChange,
    processing,
    open,
    setOpen,
    errors,
    method,
    booking,
}) {
    const process = method === "Create" ? "Creating..." : "Updating...";
    const deposit_types = ["Applied", "Forfeited", "Refunded", "Received"];
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* No DialogTrigger — controlled by parent via open prop */}
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="py-2">
                        <DialogTitle>
                            {method === "Create" ? "Add New" : "Update"} Deposit
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
                                label="Type"
                                id="type"
                                name="type"
                                value={form.type}
                                options={deposit_types}
                                onChange={handleChange}
                                placeholder="Select Type"
                                error={errors.type}
                                className="col-span-4"
                            />
                            <InputWithLabel
                                label="Amount"
                                id="amount"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                error={errors.amount}
                                placeholder={`Amount Required: ${booking?.required_deposit ?? ""}`}
                                type="number"
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
