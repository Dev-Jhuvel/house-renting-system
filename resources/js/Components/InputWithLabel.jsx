import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function InputWithLabel({
    label,
    id,
    name,
    value,
    onChange,
    error,
    placeholder,
    isTextArea = false,
    type,
    className,
    disabled,
    readOnly,
}) {
    return (
        <div className={className}>
            <Label htmlFor={id}>{label}</Label>
            {isTextArea ? (
                <Textarea
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                ></Textarea>
            ) : (
                <Input
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    type={type}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
            )}
           {error && ( <p className="text-red-500 text-xs">{error}</p>)}
        </div>
    );
}
