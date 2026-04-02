'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { apiRequest } from "@/lib/api"
import { useRouter, useSearchParams } from "next/navigation"

export default function StoreAddProduct() {
    const categories = ['Electronique', 'Vetements', 'Maison & Cuisine', 'Beaute & Sante', 'Jeux & Jouets', 'Sport & Outdoor', 'Livres & Medias', 'Alimentation & Boissons', 'Loisirs & Artisanat', 'Autres']
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get('edit')

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [existingImages, setExistingImages] = useState([])
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
    })
    const [loading, setLoading] = useState(false)

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', productInfo.name)
            formData.append('description', productInfo.description)
            formData.append('mrp', productInfo.mrp)
            formData.append('price', productInfo.price)
            formData.append('category', productInfo.category)

            Object.values(images).forEach((file) => {
                if (file) {
                    formData.append('images[]', file)
                }
            })

            if (editId) {
                await apiRequest(`/vendor/products/${editId}`, {
                    method: 'PATCH',
                    body: formData,
                })
                toast.success('Produit mis a jour')
            } else {
                await apiRequest('/vendor/products', {
                    method: 'POST',
                    body: formData,
                })
                toast.success('Produit ajoute')
            }
            router.push('/store/manage-product')
        } catch (error) {
            toast.error(error.message || 'Echec de l envoi')
        } finally {
            setLoading(false)
        }
    }

    const loadProduct = async () => {
        if (!editId) return
        try {
            const data = await apiRequest('/vendor/products')
            const product = (data.data || []).find((item) => String(item.id) === String(editId))
            if (!product) return
            setProductInfo({
                name: product.name || '',
                description: product.description || '',
                mrp: product.mrp || 0,
                price: product.price || 0,
                category: product.category || '',
            })
            setExistingImages(product.images || [])
        } catch {
            // Ignore errors
        }
    }

    useEffect(() => {
        loadProduct()
    }, [editId])

    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: editId ? "Mise a jour..." : "Ajout du produit..." })} className="text-slate-500 mb-28">
            <h1 className="text-2xl">{editId ? 'Modifier le' : 'Ajouter un'} <span className="text-slate-800 font-medium">produit</span></h1>
            <p className="mt-7">Images du produit</p>

            <div className="flex gap-3 mt-4">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image width={300} height={300} className='h-15 w-auto border border-slate-200 rounded cursor-pointer' src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area} alt="" />
                        <input type="file" accept='image/*' id={`images${key}`} onChange={e => setImages({ ...images, [key]: e.target.files[0] })} hidden />
                    </label>
                ))}
            </div>
            {existingImages.length > 0 && (
                <div className="mt-4 text-xs text-slate-500">
                    Images existantes: {existingImages.length}
                </div>
            )}

            <label className="flex flex-col gap-2 my-6 ">
                Nom
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Entrez le nom du produit" className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <label className="flex flex-col gap-2 my-6 ">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Entrez la description du produit" rows={5} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <div className="flex gap-5">
                <label className="flex flex-col gap-2 ">
                    Prix normal (FCFA)
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
                <label className="flex flex-col gap-2 ">
                    Prix promo (FCFA)
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
            </div>

            <select onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} value={productInfo.category} className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-slate-200 rounded" required>
                <option value="">Choisissez une categorie</option>
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            <button disabled={loading} className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition">
                {editId ? 'Mettre a jour' : 'Ajouter le produit'}
            </button>
        </form>
    )
}
