import ProductClient from "./ProductClient";

export const dynamic = 'force-dynamic';

export default function ProductPage({ params }) {
    const productId = params?.productId ? String(params.productId) : '';

    return <ProductClient productId={productId} />;
}
