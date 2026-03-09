'use client'
import { assets } from '@/assets/assets';
import { useEffect, useState } from 'react';

const slides = [
    {
        image: assets.hero_product_img1,
        title: 'Offres exclusives',
        text: 'Profite des meilleures promotions du moment sur SaloumMarket.',
    },
    {
        image: assets.hero_product_img2,
        title: 'Nouveaux produits',
        text: 'Decouvre les dernieres nouveautes et les tendances du store.',
    },
    {
        image: assets.happy_store,
        title: 'Vendez facilement',
        text: 'Cree ton espace vendeur et gere tes produits en quelques clics.',
    },
];

export default function AuthPromoSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 3500);

        return () => clearInterval(timer);
    }, []);

    const currentSlide = slides[index];
    const imageSrc = currentSlide?.image?.src || currentSlide?.image || assets.hero_model_img?.src || assets.hero_model_img;

    return (
        <div className="relative h-full rounded-3xl overflow-hidden bg-slate-900 text-white">
            <img
                src={imageSrc}
                alt={currentSlide.title}
                className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

            <div className="relative z-10 h-full flex flex-col justify-end p-10">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Publicite</p>
                <h2 className="text-3xl font-semibold mt-2">{currentSlide.title}</h2>
                <p className="text-slate-200 mt-3 max-w-md">{currentSlide.text}</p>

                <div className="flex gap-2 mt-6">
                    {slides.map((_, dotIndex) => (
                        <button
                            key={dotIndex}
                            type="button"
                            onClick={() => setIndex(dotIndex)}
                            className={`h-2.5 rounded-full transition-all ${dotIndex === index ? 'w-8 bg-white' : 'w-2.5 bg-white/50'}`}
                            aria-label={`Slide ${dotIndex + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
