import { usePage } from "@inertiajs/react";

export function useAuth() {
    const { auth } = usePage().props;
    const user = auth.user;
    const role = user?.role;
    return {
        user: user,
        isLandlord: role === "landlord",
        isAdmin: role === "admin",
        isTenant: role === "tenant",
        isAdminLandlord: role === "admin" || role === "landlord",
    };
}
