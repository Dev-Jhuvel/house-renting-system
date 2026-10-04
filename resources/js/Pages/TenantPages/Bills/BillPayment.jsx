import { ChefHat, Fan, MessageSquareText, Phone, ShowerHead, Verified } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { pesoFormatter, toOrdinal, toTitleCase } from "@/utils/general";
import ResponsiveBillRow from "@/Components/ResponsiveBillRows";
import { router } from "@inertiajs/react";
export default function BillPayment({ tenant }) {
    const booking = tenant?.booking;
    return (
        <div className="py-12 space-y-4">
            <BookingCard booking={booking}/>
            <BillList booking={booking}/>
        </div>
    );
}

function BookingCard({booking}){
    const unpaid_bills_count = booking.unpaid_bills.length || 0;
    const unpaid_bills_keyword = unpaid_bills_count > 1 ? 'bills' : 'bill';

    console.log(booking.balance === 0);
    function handleSubmitPayAll(booking){
        router.post(route("tenant.bills.payments.pay-all", booking));
    }

    return (
        <div className="grid grid-cols-6 gap-4 px-6 h-full sm:h-[180px]">
            <Card className="col-span-8 sm:col-span-2 h-[180px] sm:h-full p-0 w-full">
                <CardContent className="flex py-4 h-full flex-col justify-center gap-4">
                    <div className="w-full space-y-1">
                        <h3 className="text-md text-gray-500 font-semibold">TOTAL OUTSTANDING</h3>
                        <p className="text-primary text-3xl font-bold">{pesoFormatter(booking.balance)}</p>
                        <p className="text-primary text-md font-bold">{unpaid_bills_count || 'No'} Unpaid {unpaid_bills_keyword}</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="col-span-8 sm:col-span-2 h-[180px] sm:h-full p-0 w-full">
                <CardContent className="flex py-4 h-full flex-col justify-center gap-4">
                    <div className="w-full space-y-1">
                        <h3 className="text-md text-gray-500 font-semibold">NEXT DUE DATE</h3>
                        <p className="text-primary text-3xl font-bold">{booking.unpaid_bills[0]?.due_date || "None"}</p>
                        <p className="text-primary text-md font-bold">Rent & Utilities</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="col-span-8 sm:col-span-2 h-[180px] sm:h-full p-0 w-full bg-primary">
                <CardContent className="flex py-4 h-full flex-col justify-center gap-4">
                    <div className="w-full space-y-1 text-center">
                        <p className="text-2xl font-bold text-white">Clear Balance</p>
                        <p className="text-lg text-white">Pay All outstanding balance in one click</p>
                    </div>
                    <Button variant="outline" className="w-full" disabled={booking.balance === 0} onClick={()=>handleSubmitPayAll(booking)}>{booking.balance > 0 ? `Pay All ${pesoFormatter(booking.balance)}` : 'All cleared up!'}</Button>
                </CardContent>
            </Card>
        </div>
    );
}

function BillList({booking}){
    return (
        <div className="my-4 gap-5 md:h-[400px]">
            <div className="col-span-5 h-full min-h-0">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold py-1">Recent Bills</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 h-[400px] md:h-[calc(100%-10px)] overflow-y-scroll">
                    {booking.bills.map((bill) => (
                        <ResponsiveBillRow
                            bill={bill}
                            key={bill.id}
                            onClick={() => handleBillRowAction(bill)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

