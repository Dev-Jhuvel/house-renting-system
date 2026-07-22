import NavLink from "./NavLink";
import { SidebarMenuButton } from "./ui/sidebar";

export default function NavButton({ link }) {
    const Icon = link.icon;
    return (
        <SidebarMenuButton asChild tooltip="label">
            <NavLink
                href={route(link.routeLink)}
                active={route().current(link.routeLink)}
            >
                <Icon className="size-5" />
                <span className="font-semibold">{link.label}</span>
            </NavLink>
        </SidebarMenuButton>
    );
}
