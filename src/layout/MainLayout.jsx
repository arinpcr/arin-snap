import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom"; // Tambahkan useLocation
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
    const location = useLocation(); // Mendapatkan URL saat ini
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const userRole = localStorage.getItem("userRole");
        if (!isLoggedIn || userRole !== "staff") {
            navigate("/login");
        }
    }, [navigate]);

    // LOGIKA BACKGROUND DINAMIS:
    // Jika URL adalah "/sales", pakai warna oranye gelap (#FFC794)
    // Selain itu (misal "/"), pakai warna cream (#FFF4EA)
    const bgColorClass = location.pathname === "/sales" ? "bg-[#FFC794]" : "bg-[#FFF4EA]";

    return (
        // Masukkan variabel bgColorClass ke dalam className
        <div className={`min-h-screen ${bgColorClass} font-poppins text-gray-800 transition-colors duration-300`}>
            <div className="flex min-h-screen flex-col lg:flex-row">
                <Sidebar />
                <div id="main-content" className="flex-1 p-4 md:p-6 xl:p-8">
                    <Header />
                    <Outlet />
                </div>
            </div>
        </div>
    );
}