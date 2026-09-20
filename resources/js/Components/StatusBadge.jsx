import { Badge } from "@/Components/ui/badge";
import { statusColor, toTitleCase } from "@/utils/general";

export function StatusBadge({status = "-", className = ""}){
    const label = toTitleCase(status)
    const bgColor = statusColor(status);
    const hoverColor = statusColor(status, false, true);
    console.log(hoverColor);
    return(
        <Badge variant="secondary" className={`text-black text-center ${bgColor} hover:${hoverColor} ${className}`}>
            {label}
        </Badge>
    )
}