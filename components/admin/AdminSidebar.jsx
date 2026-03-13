'use client'

import { usePathname } from "next/navigation"
import { HomeIcon, ShieldCheckIcon, StoreIcon, TicketPercentIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { assets } from "@/assets/assets"

const AdminSidebar = () => {

    const pathname = usePathname()

    const sidebarLinks = [
        { name: 'Tableau de bord', href: '/admin', icon: HomeIcon },
        { name: 'Boutiques', href: '/admin/stores', icon: StoreIcon },
        { name: 'Validation boutiques', href: '/admin/approve', icon: ShieldCheckIcon },
        { name: 'Coupons', href: '/admin/coupons', icon: TicketPercentIcon  },
    ]

    const isActiveLink = (href) => {
        if (href === '/admin') {
            return pathname === '/admin'
        }
        return pathname === href || pathname.startsWith(`${href}/`)
    }

    return (
        <div className="inline-flex h-full flex-col gap-5 border-r border-orange-200 sm:min-w-60">
            <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
                <Image className="w-14 h-14 rounded-full" src={assets.gs_logo} alt="" width={80} height={80} />
                <p className="text-slate-700">Bonjour, Elhadji</p>
            </div>

            <div className="max-sm:mt-6">
                {
                    sidebarLinks.map((link, index) => (
                        <Link key={index} href={link.href} className={`relative flex items-center gap-3 text-slate-500 hover:bg-orange-50 p-2.5 transition ${isActiveLink(link.href) && 'bg-orange-100 sm:text-slate-700'}`}>
                            <link.icon size={18} className="sm:ml-5" />
                            <p className="max-sm:hidden">{link.name}</p>
                            <span className={`absolute left-5 right-5 -bottom-0.5 h-0.5 bg-orange-500 rounded-full transition-all duration-300 ${isActiveLink(link.href) ? 'scale-x-100' : 'scale-x-0'}`}></span>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default AdminSidebar
