import { PlusCircleIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export default function AddHouseButton({message=""}) {
    return (
        <Card className="w-full mx-auto h-full max-w-sm pt-0 shadow-md min-h-[300px]">
            <CardContent className="flex flex-col items-center justify-center h-full gap-2">
                <div className="bg-gray-200 p-4 rounded-full">
                    <PlusCircleIcon size={35} />
                </div>
                <p className="text-xsm/10 text-center">
                    {message}
                </p>
            </CardContent>
        </Card>
    );
}