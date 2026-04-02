'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }) {

    return (
        <>
            <Banner />
            <Navbar />
            <div className="pb-20 md:pb-0">
                {children}
                <Footer />
            </div>
        </>
    );
}
