'use client'
import { Home as HomeIcon, LayoutList as LayoutListIcon, Phone as PhoneIcon, Search, ShoppingCart, Store as StoreIcon, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { clearSession, getSessionUser, setSession } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import toast from "react-hot-toast";

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const desktopProfileRef = useRef(null);
    const mobileProfileRef = useRef(null);

    const [search, setSearch] = useState('');
    const [user, setUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: '', email: '' });
    const [currentHash, setCurrentHash] = useState('');
    const cartCount = useSelector((state) => state.cart?.total ?? 0);

    useEffect(() => {
        const sessionUser = getSessionUser();
        setUser(sessionUser);
        if (sessionUser) {
            setProfileForm({
                name: sessionUser.name || '',
                email: sessionUser.email || '',
            });
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        const updateHash = () => setCurrentHash(window.location.hash || '');
        updateHash();
        window.addEventListener('hashchange', updateHash);
        return () => window.removeEventListener('hashchange', updateHash);
    }, [pathname]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            const clickedDesktop = desktopProfileRef.current?.contains(event.target);
            const clickedMobile = mobileProfileRef.current?.contains(event.target);
            if (!clickedDesktop && !clickedMobile) {
                setShowProfile(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        if (!search.trim()) {
            return;
        }
        setShowMobileSearch(false);
        router.push(`/shop?search=${encodeURIComponent(search)}`);
    };

    const isActiveLink = (href) => {
        if (href.startsWith('/#')) {
            const hash = href.replace('/', '');
            if (href === '/#accueil') {
                return pathname === '/' && (currentHash === '' || currentHash === '#accueil');
            }
            return pathname === '/' && currentHash === hash;
        }

        if (href === '/') {
            return pathname === '/';
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const linkClass = (href) =>
        `relative transition ${
            isActiveLink(href)
                ? 'text-orange-600 font-semibold after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:bg-orange-500 after:transition-all after:duration-300 after:scale-x-100'
                : 'text-slate-600 hover:text-orange-500 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:bg-orange-500 after:transition-all after:duration-300 after:scale-x-0 hover:after:scale-x-100'
        }`;

    const handleLogout = async () => {
        try {
            await apiRequest('/auth/logout', { method: 'POST' });
        } catch {
            // Keep local logout even if API fails.
        } finally {
            clearSession();
            setUser(null);
            router.push('/login');
        }
    };

    const handleUpdateProfile = async (event) => {
        event.preventDefault();
        setSavingProfile(true);
        try {
            const data = await apiRequest('/auth/profile', {
                method: 'PATCH',
                body: JSON.stringify(profileForm),
            });
            const token = localStorage.getItem('auth_token');
            if (token) {
                setSession(token, data.user);
            }
            setUser(data.user);
            toast.success('Profil mis a jour');
            setShowProfile(false);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSavingProfile(false);
        }
    };

    const bottomLinks = [
        { href: '/', label: 'Accueil', Icon: HomeIcon },
        { href: '/shop', label: 'Boutique', Icon: StoreIcon },
        { href: '/#apropos', label: 'A propos', Icon: UserIcon },
        { href: '/#contact', label: 'Contact', Icon: PhoneIcon },
        { href: '/orders', label: 'Mes commandes', Icon: LayoutListIcon },
    ];

    return (
        <>
            <nav className="relative bg-white/90 backdrop-blur-sm z-40">
                <div className="mx-4 sm:mx-6">
                    <div className="flex items-center justify-between max-w-7xl mx-auto py-4">
                        <Link href="/" className="relative text-2xl font-semibold text-slate-700">
                            <span className="text-orange-600">Saloum</span>Market<span className="text-orange-600 text-5xl leading-0">N</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-4 lg:gap-8 text-slate-600">
                            <Link href="/#accueil" className={linkClass('/#accueil')}>Accueil</Link>
                            <Link href="/shop" className={linkClass('/shop')}>Boutique</Link>
                            <Link href="/#apropos" className={linkClass('/#apropos')}>A propos</Link>
                            <Link href="/#contact" className={linkClass('/#contact')}>Contact</Link>

                            <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                                <Search size={18} className="text-slate-600" />
                                <input
                                    className="w-full bg-transparent outline-none placeholder-slate-600"
                                    type="text"
                                    placeholder="Rechercher des produits"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
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
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/login"
                                        aria-label="Connexion"
                                        className="size-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition"
                                    >
                                        <UserIcon size={18} />
                                    </Link>
                                    <Link href="/register" className="text-sm text-slate-600 hover:text-orange-500">
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
                                                    onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
                                                    placeholder="Nom"
                                                    required
                                                />
                                                <input
                                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                                                    value={profileForm.email}
                                                    onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))}
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
                                onClick={() => setShowMobileSearch((prev) => !prev)}
                                className="p-1.5 rounded-md border border-slate-200 text-slate-700"
                                aria-label="Rechercher"
                            >
                                <Search size={20} />
                            </button>
                            <Link href="/cart" className="relative flex items-center text-slate-700">
                                <ShoppingCart size={20} />
                                <span className="absolute -top-2 -right-2 text-[9px] text-white bg-slate-600 size-4 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            </Link>
                            {!user ? (
                                <Link
                                    href="/login"
                                    aria-label="Connexion"
                                    className="size-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition"
                                >
                                    <UserIcon size={16} />
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
                                                    onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
                                                    placeholder="Nom"
                                                    required
                                                />
                                                <input
                                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                                                    value={profileForm.email}
                                                    onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))}
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
                {showMobileSearch && (
                    <form onSubmit={handleSearch} className="md:hidden px-4 pb-3 bg-white">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm">
                                <Search size={16} className="text-slate-600" />
                                <input
                                    className="w-full bg-transparent outline-none placeholder-slate-600"
                                    type="text"
                                    placeholder="Rechercher des produits"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </form>
                )}
            </nav>
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto grid grid-cols-5 text-[10px] text-slate-600">
                    {bottomLinks.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center gap-1 py-2 transition ${
                                isActiveLink(item.href)
                                    ? 'text-orange-600 font-semibold after:absolute after:-bottom-0.5 after:h-0.5 after:w-8 after:bg-orange-500 after:rounded-full after:transition-all after:duration-300 after:scale-x-100'
                                    : 'text-slate-600 hover:text-orange-500 after:absolute after:-bottom-0.5 after:h-0.5 after:w-8 after:bg-orange-500 after:rounded-full after:transition-all after:duration-300 after:scale-x-0 hover:after:scale-x-100'
                            }`}
                        >
                            <item.Icon size={18} />
                            <span className="leading-none">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Navbar;
