'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'FCFA '

    return (
        <div className='mx-4 sm:mx-6'>
            <div className='flex flex-col xl:flex-row gap-5 sm:gap-8 max-w-7xl mx-auto my-6 sm:my-10'>
                <div className='relative flex-1 flex flex-col bg-orange-200 rounded-3xl xl:min-h-100 group overflow-hidden'>
                    <div className='p-5 sm:p-12 lg:p-16'>
                        <div className='inline-flex items-center gap-3 bg-orange-300 text-slate-600 pr-4 p-1 rounded-full text-xs sm:text-sm'>
                            <span className='bg-orange-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs'>NOUVEAU</span>
                            Livraison gratuite des 50 000 FCFA d'achat
                            <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </div>
                        <h2 className='text-2xl sm:text-4xl lg:text-5xl leading-[1.2] my-3 font-medium bg-gradient-to-r from-slate-500 to-[#661901] bg-clip-text text-transparent max-w-xs sm:max-w-md'>
                            Les meilleurs gadgets, au juste prix.
                        </h2>
                        <div className='text-slate-800 text-sm font-medium mt-4 sm:mt-8'>
                            <p>A partir de</p>
                            <p className='text-3xl'>{currency}4 900</p>
                        </div>
                        <Link href="/shop" className='inline-flex bg-slate-800 text-white text-sm py-2.5 px-7 sm:py-4 sm:px-10 mt-4 sm:mt-10 rounded-md hover:bg-slate-900 active:scale-95 transition'>
                            Voir la boutique
                        </Link>
                    </div>
                    <Image className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm' src={assets.hero_model_img} alt="" />
                </div>
                <div className='flex flex-col sm:flex-row xl:flex-col gap-4 sm:gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                    <Link href="/shop" className='flex-1 flex items-center justify-between w-full bg-slate-200 rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-2xl sm:text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40'>Top produits</p>
                            <p className='flex items-center gap-1 mt-4'>Voir plus <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
                        </div>
                        <Image className='w-35' src={assets.hero_product_img1} alt="" />
                    </Link>
                    <Link href="/shop" className='flex-1 flex items-center justify-between w-full bg-blue-200 rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-2xl sm:text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40'>Jusqu'a -20%</p>
                            <p className='flex items-center gap-1 mt-4'>Voir plus <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
                        </div>
                        <Image className='w-35' src={assets.hero_product_img2} alt="" />
                    </Link>
                </div>
            </div>
            <CategoriesMarquee />
        </div>

    )
}

export default Hero
