'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { apiRequest } from "@/lib/api"
import { getSessionUser, setSession } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function CreateStore() {
    const router = useRouter()

    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: "",
        image: ""
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    const fetchSellerStatus = async () => {
        const user = getSessionUser()
        if (!user) {
            router.push('/login')
            return
        }

        try {
            const meData = await apiRequest('/auth/me')
            const backendUser = meData?.user
            const token = localStorage.getItem('auth_token')
            if (backendUser && token) {
                setSession(token, backendUser)
            }

            if (backendUser?.role !== 'vendor') {
                toast.error("Seuls les vendeurs peuvent creer une boutique.")
                router.push('/')
                return
            }

            const data = await apiRequest('/vendor/store')
            const store = data?.data

            if (store) {
                setAlreadySubmitted(true)
                setStatus(store.status || "pending")

                if (store.status === 'pending') {
                    setMessage("Votre demande est en cours")
                } else if (store.status === 'approved') {
                    setMessage("Votre boutique est approuvee. Redirection vers le dashboard vendeur...")
                    setTimeout(() => router.push('/store'), 3000)
                } else {
                    setMessage("Votre demande a ete refusee. Vous pouvez contacter l'administrateur.")
                }
            }
        } catch (error) {
            toast.error(error.message || "Impossible de verifier le statut de votre boutique.")
        } finally {
            setLoading(false)
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        const meData = await apiRequest('/auth/me')
        if (meData?.user?.role !== 'vendor') {
            throw new Error("Votre compte n'est pas vendeur. Connectez-vous avec un compte vendeur.")
        }

        if (!storeInfo.image) {
            throw new Error("Le logo de la boutique est obligatoire.")
        }

        const formData = new FormData()
        formData.append('name', storeInfo.name)
        formData.append('username', storeInfo.username)
        formData.append('description', storeInfo.description)
        formData.append('email', storeInfo.email)
        formData.append('contact', storeInfo.contact)
        formData.append('address', storeInfo.address)
        formData.append('logo', storeInfo.image)

        const response = await apiRequest('/vendor/store', {
            method: 'POST',
            body: formData,
        })

        let verifiedStore = null
        try {
            const verification = await apiRequest('/vendor/store')
            verifiedStore = verification?.data || verification?.data?.store || verification?.data?.request || null
        } catch {
            // Keep creation success path based on POST response.
        }
        const storeStatus = verifiedStore?.status || response?.data?.status || 'pending'

        setAlreadySubmitted(true)
        setStatus(storeStatus)
        setMessage(storeStatus === 'pending' ? "Votre demande est en cours" : (response?.message || "Votre demande de creation a ete envoyee."))
    }

    useEffect(() => {
        fetchSellerStatus()
    }, [])

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <div className="mx-6 min-h-[70vh] my-16">
                    <form
                        onSubmit={e => toast.promise(onSubmitHandler(e), {
                            loading: "Envoi de la demande...",
                            success: "Votre demande a ete envoyee a l'administrateur.",
                            error: (err) => err?.message || "Echec de l'envoi.",
                        })}
                        className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500"
                    >
                        <div>
                            <h1 className="text-3xl ">Creer votre <span className="text-orange-500 font-medium">Boutique</span></h1>
                            <p className="max-w-lg">Pour devenir vendeur sur GoCart, envoyez les informations de votre boutique pour verification. Votre boutique sera activee apres validation de l'administrateur.</p>
                        </div>

                        <label className="mt-10 cursor-pointer">
                            Logo de la boutique
                            <Image src={storeInfo.image ? URL.createObjectURL(storeInfo.image) : assets.upload_area} className="rounded-lg mt-2 h-16 w-auto" alt="" width={150} height={100} />
                            <input type="file" accept="image/*" onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })} hidden required />
                        </label>

                        <p>Nom d'utilisateur</p>
                        <input name="username" onChange={onChangeHandler} value={storeInfo.username} type="text" placeholder="Entrez le nom d'utilisateur de la boutique" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" required />

                        <p>Nom</p>
                        <input name="name" onChange={onChangeHandler} value={storeInfo.name} type="text" placeholder="Entrez le nom de la boutique" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" required />

                        <p>Description</p>
                        <textarea name="description" onChange={onChangeHandler} value={storeInfo.description} rows={5} placeholder="Entrez la description de la boutique" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" required />

                        <p>Email</p>
                        <input name="email" onChange={onChangeHandler} value={storeInfo.email} type="email" placeholder="Entrez l'email de la boutique" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" required />

                        <p>Telephone</p>
                        <input name="contact" onChange={onChangeHandler} value={storeInfo.contact} type="text" placeholder="Entrez le numero de telephone de la boutique" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" required />

                        <p>Adresse</p>
                        <textarea name="address" onChange={onChangeHandler} value={storeInfo.address} rows={5} placeholder="Entrez l'adresse de la boutique" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" required />

                        <button className="bg-orange-500 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-orange-600 transition ">Envoyer</button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center">
                    <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">{message}</p>
                    {status === "approved" && <p className="mt-5 text-slate-400">Redirection vers le dashboard dans <span className="font-semibold">3 secondes</span></p>}
                </div>
            )}
        </>
    ) : (<Loading />)
}
