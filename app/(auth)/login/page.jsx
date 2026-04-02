import { Suspense } from 'react';
import LoginClient from './LoginClient';

export const dynamic = 'force-dynamic';

export default function LoginPage({ searchParams }) {
    const nextParam = Array.isArray(searchParams?.next)
        ? searchParams.next[0]
        : searchParams?.next;
    const nextPath = typeof nextParam === 'string' ? nextParam : '';

    return (
        <Suspense fallback={<div className="h-40 w-full animate-pulse rounded-2xl bg-slate-100" />}>
            <LoginClient nextPath={nextPath} />
        </Suspense>
    );
}
