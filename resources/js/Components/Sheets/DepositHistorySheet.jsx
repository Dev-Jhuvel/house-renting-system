import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/Components/ui/sheet";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import DeleteAlert from "@/Components/DeleteAlert";
import { Button } from "../ui/button";

export default function PaymentHistorySheet({
    open,
    setOpen,
    booking,
    handleDeleteDeposit,
}) {
    const total_deposit =
        booking?.deposits?.reduce((total, deposit) => {
            if (deposit.type === "received") {
                return total + Number(deposit.amount);
            }

            return total - Number(deposit.amount);
        }, 0) ?? 0;
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Deposit History</SheetTitle>
                    <p className="text-sm text-muted-foreground">
                        {booking?.tenant.user.name} Deposit
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Required Deposit : ₱{booking?.required_deposit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Total Deposit : ₱{total_deposit}
                    </p>
                </SheetHeader>
                <div className="mt-4">
                    {booking?.deposit?.length === 0 ? (
                        <p className="text-sm text-gray-500">No deposit yet.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Paid At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {booking?.deposits?.map((deposit) => (
                                    <TableRow key={deposit.id}>
                                        <TableCell>₱{deposit.amount}</TableCell>
                                        <TableCell>{deposit.type}</TableCell>
                                        <TableCell>{deposit.paid_at}</TableCell>
                                        <TableCell>
                                            <DeleteAlert
                                                handleDelete={() =>
                                                    handleDeleteDeposit(
                                                        deposit.id,
                                                    )
                                                }
                                                message="Delete this deposit?"
                                            >
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Delete
                                                </Button>
                                            </DeleteAlert>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
