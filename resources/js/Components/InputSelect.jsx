import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Label } from "./ui/label";
export default function InputSelect({
    name,
    label,
    id,
    value,
    options,
    onChange,
    error,
    placeholder,
    className,
    disabled = false,
}) {
    const normalize = options.map((option) => {
        return typeof option === "string"
            ? {
                  value: option.toLowerCase().replace(/\s+/g, "_"),
                  label: option,
              }
            : {
                  value: option.value,
                  label: option.label,
                  disabled: option.disabled,
              };
    });
    return (
        <div className={className}>
            <Label htmlFor={id}>{label}</Label>
            <Select
                id={id}
                value={value}
                disabled={disabled}
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
                    {normalize.map((option, key) => (
                        <SelectItem key={key} disabled={option.disabled ?? false} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p className="text-red-500 text-xs">{error}</p>
        </div>
    );
}
