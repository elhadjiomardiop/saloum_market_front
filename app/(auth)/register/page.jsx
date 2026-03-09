'use client'
export const dynamic = "force-dynamic";
import { apiRequest } from '@/lib/api';
import { setSession } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        role: 'client',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify(form),
            });

            setSession(data.token, data.user);
            toast.success('Inscription reussie');

            if (data.user.role === 'vendor') {
                router.push('/create-store');
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
            <h1 className="text-3xl font-semibold text-orange-800">Inscription</h1>
            <p className="text-slate-500 mt-2">Cree ton compte et choisis ton role.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <input
                    className="w-full border border-orange-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
                    placeholder="Nom complet"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <input
                    className="w-full border border-orange-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <select
                    className="w-full border border-orange-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                    <option value="client">Client</option>
                    <option value="vendor">Vendeur</option>
                </select>
                <input
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500"
                    placeholder="Mot de passe"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />
                <input
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500"
                    placeholder="Confirmer mot de passe"
                    type="password"
                    value={form.password_confirmation}
                    onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 text-white rounded-lg py-3 disabled:opacity-60"
                >
                    {loading ? 'Inscription...' : "S'inscrire"}
                </button>
            </form>

            <p className="text-sm text-slate-600 mt-4">
                Deja un compte ? <Link href="/login" className="text-orange-600">Connexion</Link>
            </p>
        </div>
    );
}
