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
import { Button } from "./ui/button";


export default function PaymentHistorySheet({
    open,
    setOpen,
    bill,
    handleDeletePayment
}) {
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Payment History</SheetTitle>
                    <p className="text-sm text-muted-foreground">
                        {bill?.title}
                    </p>
                </SheetHeader>
                <div className="mt-4">
                    {bill?.payments?.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No payments yet.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Paid At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bill?.payments?.map(
                                    (payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>
                                                ₱{payment.amount_paid}
                                            </TableCell>
                                            <TableCell>
                                                {payment.method}
                                            </TableCell>
                                            <TableCell>
                                                {payment.paid_at}
                                            </TableCell>
                                            <TableCell>
                                                <DeleteAlert
                                                    handleDelete={() =>
                                                        handleDeletePayment(
                                                            payment,
                                                        )
                                                    }
                                                    message="Delete this payment?"
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
                                    ),
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
