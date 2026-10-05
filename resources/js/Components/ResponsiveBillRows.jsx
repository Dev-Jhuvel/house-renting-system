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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/Components/ui/hover-card";
import {
    CreditCard,
    Droplets,
    House,
    MessageSquareTextIcon,
    PiggyBank,
    Scroll,
    Wallet,
    Zap,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { pesoFormatter, statusColor, toTitleCase } from "@/utils/general";
export default function ResponsiveBillRow({ bill, onClick }) {
    const isMobile = useIsMobile();

    const Content = ({bill}) => (
        <div>
            <div>
                <h2 className="text-center font-bold">{bill.title}</h2>
            </div>
            {bill.payments.length > 0 && (
                <div>
                    <h3 className="font-bold">Payments</h3>
                    <ul>
                        {bill.payments.map((payment) => (
                            <li key={payment.id}>
                                {toTitleCase(
                                    `${payment.method} - ₱${payment.amount_paid} `,
                                )}
                                {toTitleCase(payment.status)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
    return isMobile ? (
        <Popover>
            <PopoverTrigger asChild>
                <div>
                    <BillRow
                        bill={bill}
                        onClick={onClick}
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <Content bill={bill} />
            </PopoverContent>
        </Popover>
    ) : (
        <HoverCard key={bill.id}>
            <HoverCardTrigger asChild>
                <div>
                    <BillRow
                        bill={bill}
                        onClick={onClick}
                    />
                </div>
            </HoverCardTrigger>
            <HoverCardContent>
                <Content bill={bill} />
            </HoverCardContent>
        </HoverCard>
    );
}

function BillRow({ bill, onClick }) {
    let Icon;
    let color;
    switch (bill.type) {
        case "rent":
            Icon = House;
            color = "green";
            break;
        case "water":
            Icon = Droplets;
            color = "blue";
            break;
        case "electric":
            Icon = Zap;
            color = "yellow";
            break;
        case "repair":
            Icon = Hammer;
            color = "gray";
            break;
        case "other":
            Icon = Scroll;
            color = "orange";
            break;
    }
    const bgColor = `bg-${color}-200`;
    const textColor = `text-${color}-500`;
    const statusTextColor = statusColor(bill.status, true);
    return (
        <Card className="col-span-2 border cursor-pointer" onClick={onClick}>
            <CardContent className="flex flex-row items-center p-2 pr-12 gap-2">
                <div className={`${bgColor} ${textColor} rounded-full p-2`}>
                    <Icon />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-bold">{bill.title}</h3>
                    <p className="text-gray-500">{bill.due_date}</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold">{pesoFormatter(bill.amount)}</h3>
                    <p className={`text-xs font-semibold text-right ${statusTextColor}`} >
                        {bill.status.toUpperCase()}
                    </p>
                     <p className={`text-xs font-semibold text-right text-green-500`} >
                        Payments: {bill.payments.length}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}