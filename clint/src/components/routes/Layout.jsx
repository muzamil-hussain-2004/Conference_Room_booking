import Navbar from "../../pages/NavBar";
import Footer from "../../pages/Footer";
import { useLocation } from "react-router-dom";

function getUserRole() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split('.')[1])).role;
    } catch (error) {
        return null;
    }
}


export default function AppLayout({ children}) {
    const location = useLocation();
    const noLayoutPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
    const hideLayout = noLayoutPaths.includes(location.pathname);
    const role = getUserRole();

    return (
    <div className="min-h-screen flex flex-col">
        {!hideLayout && <Navbar role={role} />}
        <main className="flex-1 bg-gray-50">{children}</main>
        {!hideLayout && <Footer />}
    </div>

    );
}
