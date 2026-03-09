'use client'
import React from 'react'
import toast from 'react-hot-toast';

export default function Banner() {

    const [isOpen, setIsOpen] = React.useState(true);

    const handleClaim = () => {
        setIsOpen(false);
        toast.success('Code promo copie !');
        navigator.clipboard.writeText('NEW20');
    };

    return isOpen && (
        <div className="w-full px-4 sm:px-6 py-2 font-medium text-xs sm:text-sm text-white text-center bg-gradient-to-r from-orange-500 via-[#d24f15] to-[#e08c2a]">
            <div className='flex items-center justify-between max-w-7xl mx-auto gap-3'>
                <p>-20% sur votre premiere commande ! Code: <span className='font-semibold'>NEW20</span></p>
                <div className="flex items-center space-x-3 sm:space-x-6">
                    <button onClick={handleClaim} type="button" className="font-normal text-gray-800 bg-white px-4 sm:px-7 py-1.5 sm:py-2 rounded-full">Recuperer</button>
                    <button onClick={() => setIsOpen(false)} type="button" className="font-normal text-gray-800 py-2 rounded-full">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="12.532" width="17.498" height="2.1" rx="1.05" transform="rotate(-45.74 0 12.532)" fill="#fff" />
                            <rect x="12.533" y="13.915" width="17.498" height="2.1" rx="1.05" transform="rotate(-135.74 12.533 13.915)" fill="#fff" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
