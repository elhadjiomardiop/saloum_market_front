import Newsletter from "@/components/Newsletter";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="mx-4 sm:mx-6">
            <div className="max-w-5xl mx-auto py-10">
                <h1 className="text-3xl sm:text-4xl font-semibold text-slate-800">Contact</h1>
                <p className="text-slate-600 mt-3 max-w-3xl">
                    Une question ou un besoin particulier ? Ecrivez-nous ou appelez-nous, nous repondons rapidement.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                    <div className="border border-slate-200 rounded-2xl p-5 bg-white">
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                            <Phone size={18} /> Telephone
                        </div>
                        <a href="tel:+221770000000" className="text-sm text-slate-600 mt-2 block hover:text-orange-600">
                            +221 77 000 00 00
                        </a>
                    </div>
                    <div className="border border-slate-200 rounded-2xl p-5 bg-white">
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                            <Mail size={18} /> Email
                        </div>
                        <a href="mailto:contact@saloummarket.sn" className="text-sm text-slate-600 mt-2 block hover:text-orange-600">
                            contact@saloummarket.sn
                        </a>
                    </div>
                    <div className="border border-slate-200 rounded-2xl p-5 bg-white">
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                            <MapPin size={18} /> Adresse
                        </div>
                        <p className="text-sm text-slate-600 mt-2">Nioro, Senegal</p>
                    </div>
                </div>
            </div>
            <Newsletter />
        </div>
    );
}
