import { useState } from "react";
import { FaSearch, FaChevronDown, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

// 1. IMPORT SHADCN UI COMPONENTS (Input & Avatar)
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    return (
        <div id="header-container" className="flex justify-between items-center bg-transparent mb-6 mt-2">
            <div className="flex-1 hidden md:block"></div>

            <div id="search-bar" onClick={() => setIsSearchOpen(true)} className="flex-1 max-w-md relative cursor-pointer mx-4 hidden md:block">
                {/* 2. MENGGUNAKAN KOMPONEN INPUT SHADCN */}
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
                        {/* MENGGUNAKAN KOMPONEN INPUT SHADCN PADA MODAL */}
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
                <div id="profile-container" className="flex items-center gap-3 bg-[#FFF4EA] p-1.5 pr-4 cursor-pointer border border-[#FFF4EA] rounded-full">
                    {/* 3. MENGGUNAKAN KOMPONEN AVATAR SHADCN */}
                    <Avatar className="w-9 h-9">
                        <AvatarImage src="/img/profile.jpg" alt="Arini Zahira Putri" />
                        <AvatarFallback className="bg-orange-200 text-orange-700 font-bold">AZ</AvatarFallback>
                    </Avatar>
                    
                    <span className="text-sm font-semibold text-gray-700">Arini Zahira Putri</span>
                    <FaChevronDown className="text-gray-400 text-xs ml-1" />
                </div>
            ) : (
                <Link to="/login" className="bg-[#f98829] hover:bg-orange-600 text-white px-8 py-2.5 rounded-full font-bold shadow-md transition-all active:scale-95 text-sm">
                    Login Now
                </Link>
            )}
        </div>
    );
}