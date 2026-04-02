import { Suspense } from "react";
import ShopClient from "./ShopClient";

export default function Shop() {
    return (
        <Suspense fallback={<div>Chargement de la boutique...</div>}>
            <ShopClient />
        </Suspense>
    );
}
