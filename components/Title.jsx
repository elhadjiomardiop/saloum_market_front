'use client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Title = ({ title, description, visibleButton = true, href = '' }) => {

    return (
        <div className='flex flex-col items-center'>
            <h2 className='text-2xl font-semibold text-slate-800'>{title}</h2>
            <p className='max-w-lg text-center text-sm text-slate-600 mt-2'>{description}</p>
            {visibleButton && (
                <Link href={href || '/shop'} className='text-orange-500 flex items-center gap-1 mt-2'>
                    Voir plus <ArrowRight size={14} />
                </Link>
            )}
        </div>
    )
}

export default Title
