'use client'
import { apiRequest } from '@/lib/api';
import { clearSession, getSessionUser, setSession } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RoleGuard({ allowedRoles, children, requireApprovedStore = false }) {
    const router = useRouter();
    const pathname = usePathname();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const checkAccess = async () => {
            const localUser = getSessionUser();
            const token = localStorage.getItem('auth_token');

            if (!localUser || !token) {
                router.replace(`/login?next=${encodeURIComponent(pathname)}`);
                return;
            }

            if (!allowedRoles.includes(localUser.role)) {
                router.replace('/');
                return;
            }

            try {
                const data = await apiRequest('/auth/me');
                setSession(token, data.user);

                if (!allowedRoles.includes(data.user.role)) {
                    clearSession();
                    router.replace('/login');
                    return;
                }

                if (requireApprovedStore && data.user.role === 'vendor') {
                    const storeResponse = await apiRequest('/vendor/store');
                    const store = storeResponse?.data;
                    if (!store || store.status !== 'approved') {
                        router.replace('/create-store');
                        return;
                    }
                }

                setReady(true);
            } catch {
                clearSession();
                router.replace('/login');
            }
        };

        checkAccess();
    }, [allowedRoles, pathname, requireApprovedStore, router]);

    if (!ready) {
        return <div className="p-8 text-orange-500">Chargement...</div>;
    }

    return children;
}
