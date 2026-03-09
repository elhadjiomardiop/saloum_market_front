'use client'
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { apiRequest } from "@/lib/api"
import { clearSession } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminApprove() {
    const router = useRouter()

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [filter, setFilter] = useState('pending')
    const [diagLoading, setDiagLoading] = useState(false)
    const [diagnostic, setDiagnostic] = useState({
        checkedAt: null,
        role: null,
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        pendingFromApi: 0,
        latest: [],
    })


    const fetchStores = async () => {
        try {
            const data = await apiRequest('/admin/stores')
            const allStores = data.data || []
            setStores(allStores)
            setDiagnostic((prev) => ({
                ...prev,
                checkedAt: new Date().toISOString(),
                total: allStores.length,
                pending: allStores.filter((s) => s.status === 'pending').length,
                approved: allStores.filter((s) => s.status === 'approved').length,
                rejected: allStores.filter((s) => s.status === 'rejected').length,
                latest: allStores.slice(0, 5).map((s) => ({
                    id: s.id,
                    nom: s.name,
                    statut: s.status,
                    vendeur: s?.user?.email || 'n/a',
                })),
            }))
        } catch (error) {
            if (error.message?.includes("droits")) {
                clearSession()
                router.push('/login')
            }
            toast.error(error.message || "Impossible de charger les demandes de boutiques.")
        } finally {
            setLoading(false)
        }
    }

    const refreshStores = async () => {
        setRefreshing(true)
        try {
            await fetchStores()
            await runDiagnostic()
            toast.success("Liste mise a jour.")
        } finally {
            setRefreshing(false)
        }
    }

    const runDiagnostic = async () => {
        setDiagLoading(true)
        try {
            const [meData, pendingData] = await Promise.all([
                apiRequest('/auth/me'),
                apiRequest('/admin/stores?status=pending'),
            ])

            setDiagnostic((prev) => ({
                ...prev,
                checkedAt: new Date().toISOString(),
                role: meData?.user?.role || null,
                pendingFromApi: (pendingData?.data || []).length,
            }))
        } catch (error) {
            toast.error(error.message || "Echec du diagnostic.")
        } finally {
            setDiagLoading(false)
        }
    }

    const handleApprove = async ({ storeId, status }) => {
        await apiRequest(`/admin/stores/${storeId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        })
        await fetchStores()
    }

    useEffect(() => {
        fetchStores()
        runDiagnostic()
    }, [])

    const filteredStores = stores.filter((store) => {
        if (filter === 'all') return true
        if (filter === 'pending') return store.status === 'pending'
        if (filter === 'approved') return store.status === 'approved'
        if (filter === 'rejected') return store.status === 'rejected'
        return true
    })

    const pendingCount = stores.filter((s) => s.status === 'pending').length

    return !loading ? (
        <div className="text-slate-500 mb-28">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <h1 className="text-2xl">Validation des <span className="text-slate-800 font-medium">Boutiques</span></h1>
                <div className="flex gap-2">
                    <button
                        onClick={runDiagnostic}
                        disabled={diagLoading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {diagLoading ? 'Diagnostic...' : 'Diagnostic'}
                    </button>
                    <button
                        onClick={refreshStores}
                        disabled={refreshing}
                        className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900 disabled:opacity-60"
                    >
                        {refreshing ? 'Actualisation...' : 'Actualiser'}
                    </button>
                </div>
            </div>
            <p className="text-sm mt-2">Total: <span className="font-semibold">{stores.length}</span> | En attente: <span className="font-semibold">{pendingCount}</span></p>
            <div className="mt-4 p-4 rounded-lg border border-indigo-100 bg-indigo-50 text-sm text-slate-700">
                <p className="font-semibold text-slate-800">Diagnostic admin</p>
                <p className="mt-1">Role connecte: <span className="font-medium">{diagnostic.role || 'inconnu'}</span></p>
                <p>Total API: <span className="font-medium">{diagnostic.total}</span> | En attente (liste): <span className="font-medium">{diagnostic.pending}</span> | En attente (API filtre): <span className="font-medium">{diagnostic.pendingFromApi}</span></p>
                <p>Approuvees: <span className="font-medium">{diagnostic.approved}</span> | Rejetees: <span className="font-medium">{diagnostic.rejected}</span></p>
                <p>Derniere verification: <span className="font-medium">{diagnostic.checkedAt ? new Date(diagnostic.checkedAt).toLocaleString() : 'jamais'}</span></p>
                {!!diagnostic.latest.length && (
                    <div className="mt-2">
                        <p className="font-medium">5 dernieres boutiques:</p>
                        <div className="mt-1 space-y-1">
                            {diagnostic.latest.map((s) => (
                                <p key={s.id}>#{s.id} - {s.nom} - {s.statut} - {s.vendeur}</p>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
                <button onClick={() => setFilter('pending')} className={`px-3 py-1.5 rounded ${filter === 'pending' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}>En attente</button>
                <button onClick={() => setFilter('approved')} className={`px-3 py-1.5 rounded ${filter === 'approved' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Approuvees</button>
                <button onClick={() => setFilter('rejected')} className={`px-3 py-1.5 rounded ${filter === 'rejected' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Rejetees</button>
                <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded ${filter === 'all' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Toutes</button>
            </div>

            {filteredStores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {filteredStores.map((store) => (
                        <div key={store.id} className="bg-white border rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions */}
                            <div className="flex gap-3 pt-2 flex-wrap">
                                <button disabled={store.status === 'approved'} onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'approved' }), { loading: "Validation...", success: "Boutique approuvee", error: "Echec de validation" })} className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm disabled:opacity-50" >
                                    Approuver
                                </button>
                                <button disabled={store.status === 'rejected'} onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'rejected' }), { loading: 'Rejet...', success: "Boutique rejetee", error: "Echec du rejet" })} className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm disabled:opacity-50" >
                                    Rejeter
                                </button>
                            </div>
                        </div>
                    ))}

                </div>) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">Aucune demande en attente</h1>
                </div>
            )}
        </div>
    ) : <Loading />
}
