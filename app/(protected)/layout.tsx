
import { ProtectedNav } from "@/components/ProtectedNav";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ProtectedNav />
            {children}
        </>
    );  
}