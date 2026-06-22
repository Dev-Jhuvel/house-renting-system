import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export default function TenantColumn({ name, email, avatar = null }) {
    const parts = name.split(' ');
    const initials = parts[0].charAt(0) + parts[1].charAt(0);
    return (
        <>
            <div>
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                    <AvatarImage src={avatar ?? ""} alt={name + 'profile'} />
                    <AvatarFallback className="rounded-lg">
                        {initials}
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
