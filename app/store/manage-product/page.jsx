'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { apiRequest } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function StoreManageProducts() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'FCFA '
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

    const fetchProducts = async () => {
        try {
            const data = await apiRequest('/vendor/products')
            setProducts(data.data || [])
        } finally {
            setLoading(false)
        }
    }

    const toggleStock = async (productId) => {
        await apiRequest(`/vendor/products/${productId}/active`, { method: 'PATCH' })
        await fetchProducts()
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Gestion des <span className="text-slate-800 font-medium">produits</span></h1>
            {!products.length ? (
                <p className="text-slate-500">Aucun produit trouve.</p>
            ) : (
            <table className="w-full max-w-5xl text-left ring ring-slate-200 rounded overflow-hidden text-sm">
                <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Nom</th>
                        <th className="px-4 py-3 hidden md:table-cell">Description</th>
                        <th className="px-4 py-3 hidden md:table-cell">MRP</th>
                        <th className="px-4 py-3">Prix</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-slate-700">
                    {products.map((product) => (
                        <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="flex gap-2 items-center">
                                    <Image width={40} height={40} className='p-1 shadow rounded' src={product.images?.[0] || "/favicon.ico"} alt="" />
                                    {product.name}
                                </div>
                            </td>
                            <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">{product.description}</td>
                            <td className="px-4 py-3 hidden md:table-cell">{currency}{product.mrp?.toLocaleString?.() ?? product.mrp}</td>
                            <td className="px-4 py-3">{currency}{product.price?.toLocaleString?.() ?? product.price}</td>
                            <td className="px-4 py-3 text-center space-y-2">
                                <div className="flex items-center justify-center">
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                        <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleStock(product.id), { loading: "Mise a jour..." })} checked={product.inStock} />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                        <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <button onClick={() => router.push(`/store/add-product?edit=${product.id}`)} className="text-xs px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">Modifier</button>
                                    <button
                                        onClick={() => toast.promise(apiRequest(`/vendor/products/${product.id}`, { method: 'DELETE' }).then(fetchProducts), { loading: "Suppression...", success: "Supprime", error: "Echec" })}
                                        className="text-xs px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </>
    )
}
