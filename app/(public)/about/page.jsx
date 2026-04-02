import OurSpecs from "@/components/OurSpec";

export default function AboutPage() {
    return (
        <div className="mx-4 sm:mx-6">
            <div className="max-w-6xl mx-auto py-10">
                <h1 className="text-3xl sm:text-4xl font-semibold text-slate-800">A propos de SaloumMarket</h1>
                <p className="text-slate-600 mt-3 max-w-3xl">
                    SaloumMarket connecte les vendeurs locaux et les clients avec une experience simple, rapide et securisee.
                    Notre mission est de mettre en avant les boutiques de confiance et de faciliter les achats du quotidien.
                </p>
            </div>
            <OurSpecs />
        </div>
    );
}
