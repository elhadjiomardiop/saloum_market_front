'use client'
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { clearSession, getSessionUser, setSession } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import toast from "react-hot-toast";

const Navbar = () => {
    const router = useRouter();
    const desktopProfileRef = useRef(null);
    const mobileProfileRef = useRef(null);

    const [search, setSearch] = useState('')
    const [user, setUser] = useState(null)
    const [showProfile, setShowProfile] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [savingProfile, setSavingProfile] = useState(false)
    const [profileForm, setProfileForm] = useState({ name: '', email: '' })
    const cartCount = useSelector(state => state.cart.total)

    useEffect(() => {
        const sessionUser = getSessionUser()
        setUser(sessionUser)
        if (sessionUser) {
            setProfileForm({
                name: sessionUser.name || '',
                email: sessionUser.email || '',
            })
        }
    }, [])

    useEffect(() => {
        const handleOutsideClick = (event) => {
            const clickedDesktop = desktopProfileRef.current?.contains(event.target)
            const clickedMobile = mobileProfileRef.current?.contains(event.target)
            if (!clickedDesktop && !clickedMobile) {
                setShowProfile(false)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)
        return () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${encodeURIComponent(search)}`)
    }

    const handleLogout = async () => {
        try {
            await apiRequest('/auth/logout', { method: 'POST' })
        } catch {
            // Keep local logout even if API fails.
        } finally {
            clearSession()
            setUser(null)
            router.push('/login')
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setSavingProfile(true)
        try {
            const data = await apiRequest('/auth/profile', {
                method: 'PATCH',
                body: JSON.stringify(profileForm),
            })
            const token = localStorage.getItem('auth_token')
            if (token) {
                setSession(token, data.user)
            }
            setUser(data.user)
            toast.success('Profil mis a jour')
            setShowProfile(false)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSavingProfile(false)
        }
    }

    return (
        <nav className="relative bg-white/90 backdrop-blur-sm z-50">
            <div className="mx-4 sm:mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4">
                    <Link href="/" className="relative text-2xl font-semibold text-slate-700">
                        <span className="text-orange-600">Saloum</span>Market<span className="text-orange-600 text-5xl leading-0">N</span>
                        {/* <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full text-white bg-orange-500">
                            Plus
                        </p> */}
                    </Link>

                    <div className="hidden md:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/#accueil" className="hover:text-orange-500">Accueil</Link>
                        <Link href="/shop" className="hover:text-orange-500">Boutique</Link>
                        <Link href="/#apropos" className="hover:text-orange-500">A propos</Link>
                        <Link href="/#contact" className="hover:text-orange-500">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input
                                className="w-full bg-transparent outline-none placeholder-slate-600"
                                type="text"
                                placeholder="Rechercher des produits"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                required
                            />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                            Panier
                            <span className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        </Link>

                        {!user ? (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="px-6 py-2 bg-orange-500 hover:bg-orange-700 transition text-white rounded-full">
                                    Connexion
                                </Link>
                                <Link href="/register" className="px-6 py-2 bg-slate-700 hover:bg-slate-900 transition text-white rounded-full">
                                    Inscription
                                </Link>
                            </div>
                        ) : (
                            <div ref={desktopProfileRef} className="relative">
                                <button
                                    onClick={() => setShowProfile((prev) => !prev)}
                                    className="size-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold border-2 border-white"
                                >
                                    {(user?.name?.[0] || 'U').toUpperCase()}
                                </button>

                                {showProfile && (
                                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-lg border border-slate-200 p-4 z-40">
                                        <p className="text-sm text-slate-500">Profil {user?.role}</p>
                                        <form onSubmit={handleUpdateProfile} className="mt-3 space-y-3">
                                            <input
                                                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                                                value={profileForm.name}
                                                onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                                                placeholder="Nom"
                                                required
                                            />
                                            <input
                                                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                                                value={profileForm.email}
                                                onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                                                placeholder="Email"
                                                type="email"
                                                required
                                            />
                                            <button
                                                type="submit"
                                                disabled={savingProfile}
                                                className="w-full bg-indigo-600 text-white rounded-lg py-2 disabled:opacity-60"
                                            >
                                                {savingProfile ? 'Sauvegarde...' : 'Sauvegarder'}
                                            </button>
                                        </form>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full mt-2 bg-slate-900 text-white rounded-lg py-2"
                                        >
                                            Deconnexion
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center gap-3">
                        <button
                            onClick={() => setShowMobileMenu((prev) => !prev)}
                            className="p-1.5 rounded-md border border-slate-200 text-slate-700"
                            aria-label="Menu mobile"
                        >
                            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <Link href="/cart" className="relative flex items-center text-slate-700">
                            <ShoppingCart size={20} />
                            <span className="absolute -top-2 -right-2 text-[9px] text-white bg-slate-600 size-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        </Link>
                        {!user ? (
                            <Link href="/login" className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
                                Connexion
                            </Link>
                        ) : (
                            <div ref={mobileProfileRef} className="relative">
                                <button
                                    onClick={() => setShowProfile((prev) => !prev)}
                                    className="size-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold border-2 border-white"
                                >
                                    {(user?.name?.[0] || 'U').toUpperCase()}
                                </button>
                                {showProfile && (
                                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-lg border border-slate-200 p-4 z-40">
                                        <p className="text-sm text-slate-500">Profil {user?.role}</p>
                                        <form onSubmit={handleUpdateProfile} className="mt-3 space-y-3">
                                            <input
                                                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                                                value={profileForm.name}
                                                onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                                                placeholder="Nom"
                                                required
                                            />
                                            <input
                                                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                                                value={profileForm.email}
                                                onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                                                placeholder="Email"
                                                type="email"
                                                required
                                            />
                                            <button
                                                type="submit"
                                                disabled={savingProfile}
                                                className="w-full bg-indigo-600 text-white rounded-lg py-2 disabled:opacity-60"
                                            >
                                                {savingProfile ? 'Sauvegarde...' : 'Sauvegarder'}
                                            </button>
                                        </form>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full mt-2 bg-slate-900 text-white rounded-lg py-2"
                                        >
                                            Deconnexion
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
            {showMobileMenu && (
                <div className="md:hidden px-4 pb-4 border-b border-gray-200 bg-white">
                    <div className="max-w-7xl mx-auto flex flex-col gap-2 text-slate-700">
                        <Link onClick={() => setShowMobileMenu(false)} href="/#accueil" className="py-2 px-2 rounded hover:bg-slate-100">Accueil</Link>
                        <Link onClick={() => setShowMobileMenu(false)} href="/shop" className="py-2 px-2 rounded hover:bg-slate-100">Boutique</Link>
                        <Link onClick={() => setShowMobileMenu(false)} href="/#apropos" className="py-2 px-2 rounded hover:bg-slate-100">A propos</Link>
                        <Link onClick={() => setShowMobileMenu(false)} href="/#contact" className="py-2 px-2 rounded hover:bg-slate-100">Contact</Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
