import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
export default function InputSelect({
    name,
    value,
    options,
    onChange,
    error,
    placeholder,
    className,
}) {
    return (
        <div className={className}>
            <Select
                value={value}
                onValueChange={(value) =>
                    onChange({
                        target: {
                            name: name,
                            type: "text",
                            value,
                        },
                    })
                }
            >
                <SelectTrigger className="w-full col-span-4">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option, key) => (
                        <SelectItem key={key} value={option.toLowerCase().replace(/\s+/g, "_")}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p className="text-red-500 text-xs">{error}</p>
        </div>
    );
}
