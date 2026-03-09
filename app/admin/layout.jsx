import AdminLayout from "@/components/admin/AdminLayout";
import RoleGuard from "@/components/auth/RoleGuard";

export const metadata = {
    title: "SaloumShop. - Admin",
    description: "SaloumShop. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <RoleGuard allowedRoles={['admin']}>
            <AdminLayout>
                {children}
            </AdminLayout>
        </RoleGuard>
    );
}
