import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Label } from "./ui/label";
import { useEffect } from "react";

export default function DatePicker({
    label,
    id,
    name,
    value,
    onChange,
    error,
    className,
}) {
    const date_object = value ? new Date(value) : undefined;
    return (
        <div className={className}> 
            <Label htmlFor={id}>{label}</Label>
            <Popover modal={true}>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !value && "text-muted-foreground",
                        )}  
                    >
                        <CalendarIcon />
                        {date_object ? format(date_object, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date_object}
                        onSelect={(picked) => {
                            console.log(picked)
                            onChange({
                                target: {
                                    name: name,
                                    type: "text",
                                    value: picked ? format(picked, 'yyyy-MM-dd') : "",
                                },
                            });
                        }}
                    />
                </PopoverContent>
            </Popover>
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
}
