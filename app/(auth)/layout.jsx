import AuthPromoSlider from '@/components/auth/AuthPromoSlider';
import { Suspense } from 'react';

export default function AuthLayout({ children }) {
    return (
        <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-3rem)] grid lg:grid-cols-2 gap-6">
                <section className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 sm:p-10 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <Suspense
                            fallback={
                                <div className="animate-pulse space-y-4">
                                    <div className="h-8 bg-slate-200 rounded-lg w-2/3" />
                                    <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
                                    <div className="h-12 bg-slate-200 rounded-lg" />
                                    <div className="h-12 bg-slate-200 rounded-lg" />
                                    <div className="h-12 bg-slate-200 rounded-lg" />
                                </div>
                            }
                        >
                            {children}
                        </Suspense>
                    </div>
                </section>

                <section className="hidden lg:block">
                    <AuthPromoSlider />
                </section>
            </div>
        </main>
    );
}
