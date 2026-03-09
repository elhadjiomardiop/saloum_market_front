import StoreLayout from "@/components/store/StoreLayout";
import RoleGuard from "@/components/auth/RoleGuard";

export const metadata = {
    title: "SaloumMarket - Espace vendeur",
    description: "SaloumMarket - Gestion de votre boutique",
};

export default function RootAdminLayout({ children }) {

    return (
        <RoleGuard allowedRoles={['vendor']} requireApprovedStore={true}>
            <StoreLayout>
                {children}
            </StoreLayout>
        </RoleGuard>
    );
}
