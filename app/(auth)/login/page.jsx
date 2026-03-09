'use client'
import { apiRequest } from '@/lib/api';
import { setSession } from '@/lib/auth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify(form),
            });

            setSession(data.token, data.user);
            toast.success('Connexion reussie');
            const nextPath = searchParams.get('next');

            if (data.user.role === 'admin') {
                if (nextPath && nextPath.startsWith('/admin')) {
                    router.push(nextPath);
                    return;
                }
                router.push('/admin');
                return;
            }

            if (data.user.role === 'vendor') {
                if (nextPath && nextPath.startsWith('/create-store')) {
                    router.push(nextPath);
                    return;
                }
                try {
                    const storeData = await apiRequest('/vendor/store');
                    const store = storeData?.data;
                    if (!store || store.status !== 'approved') {
                        router.push('/create-store');
                        return;
                    }
                } catch {
                    router.push('/create-store');
                    return;
                }

                router.push('/store');
                return;
            }

            router.push('/');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-semibold text-slate-800">Connexion</h1>
            <p className="text-slate-500 mt-2">Connecte-toi selon ton role.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <input
                    className="w-full border border-orange-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <input
                    className="w-full border border-orange-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
                    placeholder="Mot de passe"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 text-white rounded-lg py-3 disabled:opacity-60"
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>

            <p className="text-sm text-slate-600 mt-4">
                Pas encore de compte ? <Link href="/register" className="text-orange-600">Inscription</Link>
            </p>
        </div>
    );
}
