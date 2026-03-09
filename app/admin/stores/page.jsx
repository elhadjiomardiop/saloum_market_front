'use client'
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { apiRequest } from "@/lib/api"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminStores() {

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('pending')

    const fetchStores = async () => {
        try {
            const data = await apiRequest('/admin/stores')
            setStores(data.data || [])
        } catch (error) {
            toast.error(error.message || "Impossible de charger les boutiques.")
        } finally {
            setLoading(false)
        }
    }

    const toggleIsActive = async (storeId) => {
        await apiRequest(`/admin/stores/${storeId}/active`, {
            method: 'PATCH',
        })
        await fetchStores()
    }

    useEffect(() => {
        fetchStores()
    }, [])

    const filteredStores = stores.filter((store) => {
        if (filter === 'all') return true
        if (filter === 'pending') return store.status === 'pending'
        if (filter === 'approved') return store.status === 'approved'
        if (filter === 'rejected') return store.status === 'rejected'
        return true
    })

    return !loading ? (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">Gestion des <span className="text-slate-800 font-medium">Boutiques</span></h1>

            <div className="flex gap-2 mt-4 flex-wrap">
                <button onClick={() => setFilter('pending')} className={`px-3 py-1.5 rounded ${filter === 'pending' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}>En attente</button>
                <button onClick={() => setFilter('approved')} className={`px-3 py-1.5 rounded ${filter === 'approved' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Approuvees</button>
                <button onClick={() => setFilter('rejected')} className={`px-3 py-1.5 rounded ${filter === 'rejected' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Rejetees</button>
                <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded ${filter === 'all' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Toutes</button>
            </div>

            {filteredStores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {filteredStores.map((store) => (
                        <div key={store.id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-2 flex-wrap">
                                <p>Activer</p>
                                <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        onChange={() => toast.promise(toggleIsActive(store.id), { loading: "Mise a jour...", success: "Statut mis a jour", error: "Echec de mise a jour" })}
                                        checked={store.isActive}
                                        disabled={store.status !== 'approved'}
                                    />
                                    <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                    <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                </label>
                            </div>
                        </div>
                    ))}

                </div>
            ) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">Aucune boutique trouvee pour ce filtre</h1>
                </div>
            )
            }
        </div>
    ) : <Loading />
}
