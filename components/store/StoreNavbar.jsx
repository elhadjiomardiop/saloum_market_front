'use client'
import Link from "next/link"

const StoreNavbar = () => {


    return (
        <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3 border-b border-orange-200 transition-all">
            <Link href="/" className="relative text-2xl sm:text-4xl font-semibold text-slate-700">
                <span className="text-orange-600">Saloum</span>Market<span className="text-orange-600 text-4xl leading-0">.</span>
                <p className="absolute text-xs font-semibold -top-1 -right-11 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-orange-500">
                    Vendeur
                </p>
            </Link>
            <div className="flex items-center gap-3">
                <p>Bonjour, vendeur</p>
            </div>
        </div>
    )
}

export default StoreNavbar
