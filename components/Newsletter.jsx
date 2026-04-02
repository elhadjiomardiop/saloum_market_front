'use client'
import React from 'react'
import Title from './Title'
import toast from 'react-hot-toast'

const Newsletter = () => {
    const [email, setEmail] = React.useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        toast.success('Merci ! Vous etes inscrit a la newsletter.')
        setEmail('')
    }

    return (
        <div className='flex flex-col items-center mx-4 my-20 sm:my-28'>
            <Title
                title="Newsletter"
                description="Recevez nos meilleures offres, les nouveautes et des conseils shopping chaque semaine."
                visibleButton={false}
            />
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-2 bg-slate-100 text-sm p-2 rounded-2xl w-full max-w-xl my-8 border-2 border-white ring ring-slate-200'>
                <input
                    className='flex-1 px-4 py-3 outline-none rounded-xl bg-white'
                    type="email"
                    placeholder='Entrez votre adresse email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button className='font-medium bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 active:scale-95 transition'>
                    S'inscrire
                </button>
            </form>
        </div>
    )
}

export default Newsletter
