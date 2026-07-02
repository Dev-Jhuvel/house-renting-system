import { useAuth } from '@/hooks/useAuth';

export default function RoleGate({ allow, children }) {
    const { user } = useAuth();
    if (!user || !allow.includes(user.role)) return null;
    return children;
}
