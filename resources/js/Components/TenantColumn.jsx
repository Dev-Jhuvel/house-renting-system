import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export default function TenantColumn({ name, email, avatar = null }) {
    return (
        <>
            <div>
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                    <AvatarImage src={avatar ?? ""} alt={name + 'profile'} />
                    <AvatarFallback className="rounded-lg">
                        {name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="flex flex-col">
                <span className="font-semibold text-sm/3">{name}</span>
                <span className="text-xs text-gray-500">{email}</span>
            </div>
        </>
    );
}
