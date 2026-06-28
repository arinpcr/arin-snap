import { useState, useEffect } from "react";
import { FaSearch, FaChevronDown, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

// IMPORT SHADCN UI COMPONENTS (Input & Avatar)
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    const executeLogout = async () => {
        await supabase.auth.signOut();
        localStorage.clear();
        window.location.href = "/";
    };

    // State untuk menyimpan nama dan inisial
    const [userName, setUserName] = useState("Admin Capella");
    const [initials, setInitials] = useState("AC");

    useEffect(() => {
        // Ambil nama dari Local Storage
        const storedName = localStorage.getItem("registeredName");
        if (storedName) {
            // Ubah huruf pertama tiap kata jadi kapital (misal: "arini zahira" -> "Arini Zahira")
            const formattedName = storedName.replace(/\b\w/g, char => char.toUpperCase());
            setUserName(formattedName);

            // Buat inisial (misal: "Arini Zahira" -> "AZ")
            const nameParts = formattedName.split(" ");
            const init = nameParts.length > 1 ? nameParts[0][0] + nameParts[1][0] : nameParts[0][0];
            setInitials(init.toUpperCase());
        }
    }, []);

    return (
        <div id="header-container" className="flex justify-between items-center bg-transparent mb-6 mt-2">
            <div className="flex-1 hidden md:block"></div>

            <div id="search-bar" onClick={() => setIsSearchOpen(true)} className="flex-1 max-w-md relative cursor-pointer mx-4 hidden md:block">
                <Input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-6 pr-12 py-5 bg-white border border-gray-100 rounded-full shadow-sm outline-none text-sm text-gray-500 pointer-events-none" 
                    readOnly 
                />
                <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {isSearchOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-24 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-xl rounded-2xl p-4 shadow-2xl flex items-center gap-4">
                        <FaSearch className="text-gray-400 ml-2" />
                        <Input 
                            className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 text-gray-700 text-lg" 
                            placeholder="Search..." 
                            autoFocus 
                        />
                        <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-red-500 p-2"><FaTimes /></button>
                    </div>
                </div>
            )}

            {isLoggedIn ? (
                <>
                <div onClick={() => setShowLogoutModal(true)} id="profile-container" className="flex items-center gap-3 bg-[#FFF4EA] p-1.5 pr-4 cursor-pointer border border-[#FFF4EA] hover:border-orange-300 rounded-full transition-all">
                    <Avatar className="w-9 h-9">
                        <AvatarImage src="/img/profile.jpg" alt={userName} />
                        <AvatarFallback className="bg-orange-200 text-orange-700 font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    
                    {/* NAMA DINAMIS DITAMPILKAN DI SINI */}
                    <span className="text-sm font-semibold text-gray-700">{userName}</span>
                    <FaChevronDown className="text-gray-400 text-xs ml-1" />
                </div>

                {showLogoutModal && (
                    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center border border-gray-100 animate-in zoom-in-95 duration-200">
                            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner">
                                <FaSignOutAlt />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Konfirmasi Logout</h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                Apakah Anda yakin ingin keluar dari Admin Portal Capella?
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 py-3.5 px-6 rounded-2xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={executeLogout}
                                    className="flex-1 py-3.5 px-6 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 cursor-pointer"
                                >
                                    Ya, Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                </>
            ) : (
                <Link to="/login" className="bg-[#f98829] hover:bg-orange-600 text-white px-8 py-2.5 rounded-full font-bold shadow-md transition-all active:scale-95 text-sm">
                    Login Now
                </Link>
            )}
        </div>
    );
}