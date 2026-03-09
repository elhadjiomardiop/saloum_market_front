"use client";

import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";

export default function Home() {

    return (
        <div>
            <section id="accueil">
                <Hero />
            </section>
            <section id="nouveautes">
                <LatestProducts />
            </section>
            <section id="best-sellers">
                <BestSelling />
            </section>
            <section id="apropos">
                <OurSpecs />
            </section>
            <section id="contact">
                <Newsletter />
            </section>
        </div>
    );
}
