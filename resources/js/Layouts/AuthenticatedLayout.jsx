import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import RoleGate from "@/Components/RoleGate";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/Components/ui/sonner";
import { Link, router, usePage } from "@inertiajs/react";
import { Banknote, EllipsisVertical, House, HousePlus, Layers2, LayoutDashboard, NotepadText, Settings, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { flash } = usePage().props;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const links = [
        { routeLink: "dashboard", label: "Dashboard", icon: LayoutDashboard, auth: ['admin', 'landlord'] },
        { routeLink: "houses.index", label: "House", icon: HousePlus, auth: ['admin', 'landlord'] },
        { routeLink: "houses.index", label: "Floors and Room", icon: Layers2, auth: ['admin', 'landlord'] },
        { routeLink: "tenants.index", label: "Tenants", icon: Users, auth: ['admin', 'landlord'] },
        { routeLink: "bookings.index", label: "Booking", icon: NotepadText, auth: ['admin', 'landlord'] },
        { routeLink: "bills.index", label: "Bills & Payment", icon: Banknote, auth: ['admin', 'landlord'] },
        { routeLink: "houses.index", label: "Settings", icon: Settings, auth: ['admin', 'landlord'] },
    ];

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <div className="min-h-screen">
            <SidebarProvider>
                <Sidebar size="">
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
                                <RoleGate asChild allow={['admin', 'landlord']}>
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
                                                                    <span className="font-semibold">
                                                                        {label}
                                                                    </span>
                                                                </NavLink>
                                                            </SidebarMenuButton>
                                                        );
                                                    },
                                                )}
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </RoleGate>
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
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.post("/logout")
                                                        }}
                                                    >
                                                        Logout
                                                    </DropdownMenuItem>
                                                   
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <div className="sticky top-0 z-10 ">
                    <SidebarTrigger />
                </div>
                <main className="w-full h-screen overflow-auto">
                    {children}
                    <Toaster richColors />
                </main>
            </SidebarProvider>
        </div>
    );
}
