'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "@/lib/api";

export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState();
    const products = useSelector(state => state.product.list);

    const fetchProduct = async () => {
        const localProduct = products.find((item) => String(item.id) === String(productId));
        if (localProduct) {
            setProduct(localProduct);
            return;
        }
        try {
            const data = await apiRequest(`/products/${productId}`)
            setProduct(data?.data || null)
        } catch {
            setProduct(null)
        }
    }

    useEffect(() => {
        fetchProduct()
        scrollTo(0, 0)
    }, [productId,products]);

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrums */}
                <div className="  text-gray-600 text-sm mt-8 mb-5">
                    Accueil / Produits / {product?.category}
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (<ProductDescription product={product} />)}
            </div>
        </div>
    );
}
