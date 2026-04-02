'use client';
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ProductClient({ productId }) {
    const [product, setProduct] = useState(null);
    const products = useSelector((state) => state.product.list);

    useEffect(() => {
        if (!productId) {
            return;
        }
        const localProduct = products.find((item) => String(item.id) === String(productId));
        if (localProduct) {
            setProduct(localProduct);
            return;
        }

        const fetchProduct = async () => {
            try {
                const data = await apiRequest(`/products/${productId}`);
                setProduct(data?.data || data?.product || null);
            } catch {
                setProduct(null);
            }
        };

        fetchProduct();
    }, [productId, products]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, [productId]);

    if (!productId) {
        return (
            <div className="mx-6">
                <div className="max-w-7xl mx-auto py-12 text-center text-slate-500">
                    Produit introuvable.
                </div>
            </div>
        );
    }

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-gray-600 text-sm mt-8 mb-5">
                    Accueil / Produits / {product?.category || 'Produit'}
                </div>

                {product ? (
                    <>
                        <ProductDetails product={product} />
                        <ProductDescription product={product} />
                    </>
                ) : (
                    <div className="py-12 text-center text-slate-500">
                        Chargement du produit...
                    </div>
                )}
            </div>
        </div>
    );
}
