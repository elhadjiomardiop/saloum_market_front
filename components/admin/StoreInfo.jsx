'use client'
import { MapPin, Mail, Phone } from "lucide-react"
import { assets } from "@/assets/assets"

const StoreInfo = ({store}) => {
    const logoSrc = store.logo || assets.upload_area.src || assets.upload_area
    const ownerInitial = (store?.user?.name?.[0] || 'U').toUpperCase()
    const statusLabel = store.status === 'pending' ? 'en attente' : store.status === 'rejected' ? 'rejetee' : 'approuvee'

    return (
        <div className="flex-1 space-y-2 text-sm">
            <img src={logoSrc} alt={store.name} className="max-w-20 max-h-20 w-20 h-20 object-cover shadow rounded-full max-sm:mx-auto" />
            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <h3 className="text-xl font-semibold text-slate-800"> {store.name} </h3>
                <span className="text-sm">@{store.username}</span>

                {/* Status Badge */}
                <span
                    className={`text-xs font-semibold px-4 py-1 rounded-full ${store.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : store.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                        }`}
                >
                    {statusLabel}
                </span>
            </div>

            <p className="text-slate-600 my-5 max-w-2xl">{store.description}</p>
            <p className="flex items-center gap-2"> <MapPin size={16} /> {store.address}</p>
            <p className="flex items-center gap-2"><Phone size={16} /> {store.contact}</p>
            <p className="flex items-center gap-2"><Mail size={16} />  {store.email}</p>
            <p className="text-slate-700 mt-5">Demande envoyee le <span className="text-xs">{new Date(store.createdAt).toLocaleDateString()}</span> par</p>
            <div className="flex items-center gap-2 text-sm ">
                <div className="w-9 h-9 rounded-full bg-slate-700 text-white flex items-center justify-center font-semibold">
                    {ownerInitial}
                </div>
                <div>
                    <p className="text-slate-600 font-medium">{store.user.name}</p>
                    <p className="text-slate-400">{store.user.email}</p>
                </div>
            </div>
        </div>
    )
}

export default StoreInfo
