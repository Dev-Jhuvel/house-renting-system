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
export default function Booking({ tenant }) {
    const booking = tenant?.booking;
    return (
        <div className="py-12 space-y-4">
            <BookingCard booking={booking}/>
            <HouseRoomCard booking={booking}/>
        </div>
    );
}

function BookingCard({booking}){
    return (
        <div className="grid grid-cols-8 gap-4 h-full md:h-[180px]">
            <Card className="col-span-8 md:col-span-6 h-full shadow-md">
                        <CardContent className="grid p-2 grid-cols-8 h-full">
                            <div className="col-span-8 md:col-span-3 flex justify-center items-center gap-4 h-full border-b-2 md:border-b-0 md:border-r-2 p-2 md:p-0">
                                <div className="rounded-full bg-primary/20 p-2">
                                    <Verified className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xs text-gray-500 font-semibold">CURRENT STATUS</h3>
                                    <p className="text-primary text-lg font-bold">{booking.status.toUpperCase()}</p>
                                </div>
                            </div>
                            <div className="col-span-8 md:col-span-5 w-full flex justify-center items-center px-4 p-2 md:p-0">
                                <div className="w-[40%] px-4 text-center md:text-left">
                                    <h3 className="text-xs text-gray-500 font-semibold">MOVE-IN DATE</h3>
                                    <p className="text-primary text-lg font-bold">{booking.move_in_date ?? '-'}</p>
                                </div>
                                <div className="w-[40%] px-4 text-center md:text-left">
                                    <h3 className="text-xs text-gray-500 font-semibold">MOVE-OUT DATE</h3>
                                    <p className="text-primary text-lg font-bold">{booking.move_out_date ?? '-'}</p>
                                </div>
                            </div>
                        </CardContent>
            </Card>
            <Card className="col-span-8 md:col-span-2 h-[180px] lg:h-full p-0 w-full bg-primary">
                <CardContent className="flex py-4 h-full flex-col justify-center gap-4">
                    <div className="w-full space-y-1">
                        <p className="text-xs text-white opacity-70">Remaining Deposit</p>
                        <p className="text-2xl text-white font-extrabold">{pesoFormatter(booking.total_deposit ?? 0)}</p>
                        <p className="text-md text-white">as of today</p>
                    </div>
                    <Button variant="outline" className="w-full break-words">View Deposit Transaction</Button>
                </CardContent>
            </Card>
        </div>
    );
}

function HouseRoomCard({booking}){
    const room = booking?.room;
    const room_details = [
        {
            label: 'Type',
            value: toTitleCase(room.type),
        },
        {
            label: 'Monthly Rent',
            value: pesoFormatter(room.monthly_rent),
        },
        {
            label: 'Capacity',
            value: room.capacity +' Person'+ (room.capacity > 1 ? 's' : ''),
        },
        {
            label: 'Room Status',
            value: toTitleCase(room.status),
        },
        {
            label: 'Floor',
            value: toOrdinal(room.floor) + ' Floor',
        },
    ];
    const room_amenities = [
        {
            icon: Fan,
            label: "Air Conditioning"
        },
        {
            icon: ShowerHead,
            label: "Own Bathroom"
        },
        {
            icon: ChefHat,
            label: "Own Kitchen"
        },
    ];
    const landlord = booking.room.house.owner;
    return (
        <div className="grid grid-cols-8 gap-4 h-[370px]">
            <Card className="col-span-8 sm:col-span-4 h-[370px] sm:h-full pt-0 w-full flex flex-col overflow-hidden">
                <div className="relative h-48 shrink-0">
                    <div className="absolute inset-0 z-30 bg-gradient-to-t from-black/70 to-transparent"/>
                    <img
                        src="https://images.pexels.com/photos/18078684/pexels-photo-18078684.jpeg"
                        alt="Event cover"
                        className="relative z-20 size-full object-cover brightness-70 dark:brightness-40"
                    />
                    <div className="absolute bottom-4 left-4 z-30 text-white">
                        <h3 className="text-xl font-bold">{room.house.name}</h3>
                        <p className="text-sm">{room.house.address}</p>
                    </div>
                </div>
                <CardContent className="flex flex-1 py-4 flex-col justify-center gap-4">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h3 className="text-lg text-gray-500 font-bold">LANDLORD CONTACT</h3>
                            <p className="text-sm text-bold">{landlord?.name}</p>
                            <p className="text-xs text-gray-500">{landlord?.number ?? "Sample Number"}</p>
                        </div>
                        <div className="flex gap-4">
                            <Button className="py-2 px-3 shadow-sm rounded-full"><Phone /></Button>
                            <Button className="py-2 px-3 shadow-sm rounded-full"><MessageSquareText /></Button>
                        </div>
                    </div>
                    <div className="flex border-t border-gray-400 py-2">
                        <div className="flex-1">
                            <h3 className="text-sm text-gray-500 font-bold">Water Rate</h3>
                            <p className="text-md font-bold">{pesoFormatter(100)}/person</p>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm text-gray-500 font-bold">Electric Rate</h3>
                            <p className="text-md font-bold">{pesoFormatter(100)}/person</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="col-span-8 sm:col-span-4 h-[370px] sm:h-full p-0 w-full flex flex-col">
                <CardHeader className="flex flex-row justify-between items-center h-15">
                    <CardTitle className="text-xl">Room Details</CardTitle>
                    <Badge className="bg-gray-500">Room {booking.room.room_number}</Badge>
                </CardHeader>
                <CardContent className="grid grid-cols-8 gap-4 flex-1">
                    {room_details.map((d, key) =>(
                        <div className="col-span-4" key={key}>
                            <h3 className="text-sm text-gray-500 font-semibold">{d.label}</h3>
                            <p className="text-primary text-lg font-bold">{d.value}</p>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="flex-col justify-start">
                    <h3 className="text-xs text-right text-gray-500 font-semibold opacity-90">AMENITIES INCLUDED</h3>
                    <div className="flex gap-2">
                        {room_amenities.map((a)=>{
                            const Icon = a.icon;
                            return (
                            <Badge variant='outline' className="text-sm" key={a.label}>
                                <Icon size={15} className="mr-1" />
                                {a.label}
                            </Badge>
                        )
                        })}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}