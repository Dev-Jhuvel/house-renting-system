import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import { House, HousePlus, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const links = [
        { routeLink: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { routeLink: "houses.index", label: "Manage House", icon: HousePlus },
    ];

    return (
        <div className="min-h-screen">
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="House Corp">
                                    <Link to="/">
                                        <House className="size-7" />
                                        <span className="text-base font-semibold">
                                            House Corp.
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem className="space-y-1"> 
                                        {links &&
                                            links.map(
                                                (
                                                    { routeLink, label, icon },
                                                    key,
                                                ) => {
                                                    const Icon = icon;
                                                    return (
                                                        <SidebarMenuButton
                                                            asChild
                                                            tooltip="label"
                                                            key={key}
                                                        >
                                                            <NavLink
                                                                href={route(
                                                                    routeLink,
                                                                )}
                                                                active={route().current(
                                                                    routeLink,
                                                                )}
                                                            >
                                                                <Icon className="size-5" />
                                                                <span className="ml-2 font-semibold">
                                                                    {label}
                                                                </span>
                                                            </NavLink>
                                                        </SidebarMenuButton>
                                                    );
                                                },
                                            )}
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <div>
                                        <Avatar className="h-8 w-8 rounded-lg grayscale">
                                            <AvatarImage
                                                src={user.avatar}
                                                alt={user.name}
                                            />
                                            <AvatarFallback className="rounded-lg">
                                                CN
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">
                                                {user.name}
                                            </span>
                                            <span className="truncate text-xs text-muted-foreground">
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <SidebarTrigger />
                <main className="w-[96%]">{children}</main>
            </SidebarProvider>
        </div>
    );
}
