import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteAlert from "@/Components/DeleteAlert";
import { EllipsisVertical } from "lucide-react";

export default function ActionDropDown({ label = "Actions", actions = [] }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="px-3 py-1">
                    <EllipsisVertical
                        className="hover:text-primary"
                        size={18}
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {actions
                    .filter(action => action.visible ?? true)
                    .map((action) => {
                    const item = (
                        <DropdownMenuItem
                            key={action.label}
                            disabled={action.disabled ?? false}
                            onSelect={(e) => {
                                if (action.preventDefault) {
                                    e.preventDefault();
                                }
                                action.onClick?.();
                            }}
                        >
                            {action.label}
                        </DropdownMenuItem>
                    );

                    if (action.delete) {
                        return (
                            <DeleteAlert
                                handleDelete={action.onClick}
                                key={action.label}
                                message={
                                    action.deleteMessage ??
                                    "Are you sure you want to delete this?"
                                }
                            >
                                <DropdownMenuItem
                                    disabled={action.disabled}
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    {action.label}
                                </DropdownMenuItem>
                            </DeleteAlert>
                        );
                    }

                    return item
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
