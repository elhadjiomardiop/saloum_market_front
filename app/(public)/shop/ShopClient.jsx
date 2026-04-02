'use client';
import ProductCard from "@/components/ProductCard";
import { MoveLeftIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ShopClient() {
    const pathname = usePathname();
    const router = useRouter();
    const [search, setSearch] = useState('');

    const products = useSelector((state) => state.product.list);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        const updateSearch = () => {
            const params = new URLSearchParams(window.location.search);
            setSearch(params.get('search') || '');
        };
        updateSearch();
        window.addEventListener('popstate', updateSearch);
        return () => window.removeEventListener('popstate', updateSearch);
    }, [pathname]);

    const filteredProducts = search
        ? products.filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase())
        )
        : products;

    return (
        <div className="min-h-[70vh] mx-4 sm:mx-6">
            <div className=" max-w-7xl mx-auto">
                <h1
                    onClick={() => router.push('/shop')}
                    className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"
                >
                    {search && <MoveLeftIcon size={20} />} Tous les <span className="text-slate-700 font-medium">produits</span>
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto mb-20 sm:mb-32">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
