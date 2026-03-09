import AuthPromoSlider from '@/components/auth/AuthPromoSlider';

export default function AuthLayout({ children }) {
    return (
        <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-3rem)] grid lg:grid-cols-2 gap-6">
                <section className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 sm:p-10 flex items-center justify-center">
                    <div className="w-full max-w-md">{children}</div>
                </section>

                <section className="hidden lg:block">
                    <AuthPromoSlider />
                </section>
            </div>
        </main>
    );
}
