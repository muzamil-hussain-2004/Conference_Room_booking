import Navbar from "../../pages/NavBar";
import Footer from "../../pages/Footer";
import { useLocation } from "react-router-dom";

export default function AppLayout({ children }) {
    const location = useLocation();

    const noLayoutPaths = [
        "/login",
        "/register",
        "/forgot-password", 
        "/reset-password"
    ];

    const hideLayout = noLayoutPaths.includes(location.pathname);

    return (
        <div className="min-h-screen flex flex-col">
            {!hideLayout && <Navbar />}
            <main className = "flex-1 bg-gray-50">{children}</main>
            {!hideLayout && <Footer />}
        </div>
    );
}