import { Suspense } from 'react';
import LoginClient from './LoginClient';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="h-40 w-full animate-pulse rounded-2xl bg-slate-100" />}>
            <LoginClient />
        </Suspense>
    );
}
