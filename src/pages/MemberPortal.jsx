import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { 
    FaStar, FaSignOutAlt, FaGift, FaRegCalendarCheck, FaCrown, 
    FaArrowRight, FaTicketAlt, FaConciergeBell, FaPlaneArrival, 
    FaUtensils, FaBed, FaHistory, FaCommentDots, FaTimes, FaPaperPlane 
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

export default function MemberPortal() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // --- STATE UNTUK FITUR INTERAKTIF DUMMY ---
    const [toastMessage, setToastMessage] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([
        { sender: "ai", text: "Welcome to Capella Concierge. Ada yang bisa kami bantu untuk menyempurnakan masa inap Anda?" }
    ]);
    const chatEndRef = useRef(null);

    const recommendedRooms = [
        {
            id: 1,
            title: "Capella Luxury Ocean Suite",
            location: "Bali, Indonesia",
            price: "Rp 3.500.000",
            image: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800",
            tag: "Best for Gold"
        },
        {
            id: 2,
            title: "Heritage Valley Pavilion",
            location: "Ubud, Bali",
            price: "Rp 2.800.000",
            image: "https://images.pexels.com/photos/164336/pexels-photo-164336.jpeg?auto=compress&cs=tinysrgb&w=800",
            tag: "Trending"
        },
        {
            id: 3,
            title: "Urban Skyline Penthouse",
            location: "Jakarta, Indonesia",
            price: "Rp 4.200.000",
            image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
            tag: "VIP Upgrade"
        }
    ];

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/login");
                return;
            }
            setUser(user);
            setLoading(false);
        };
        getProfile();
    }, [navigate]);

    // Scroll otomatis ke chat terbaru
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isChatOpen]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.clear();
        navigate("/");
    };

    // Fungsi untuk memunculkan notifikasi interaktif
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(""), 3000);
    };

    // Fungsi simulasi Chatbot AI / Admin
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        // Tambah pesan kustomer
        setMessages((prev) => [...prev, { sender: "user", text: chatInput }]);
        setChatInput("");

        // Balasan otomatis AI (Dummy)
        setTimeout(() => {
            setMessages((prev) => [
                ...prev, 
                { sender: "ai", text: "Terima kasih atas pesannya. Permintaan Anda sedang diteruskan ke tim representatif kami." }
            ]);
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                    <FaStar className="text-orange-500 text-3xl mb-4 animate-pulse" />
                    <ImSpinner2 className="animate-spin text-gray-300 text-2xl" />
                </div>
            </div>
        );
    }

    const fullName = user?.user_metadata?.full_name || "Capella Member";
    const loyaltyTier = user?.user_metadata?.role === "member" ? "GOLD" : "SILVER";
    const nextTier = loyaltyTier === "SILVER" ? "GOLD" : "PLATINUM";
    const progressPercentage = 75;

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans scroll-smooth relative">
            
            {/* --- TOAST NOTIFICATION ALERTS --- */}
            <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
                <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-gray-700">
                    <FaStar className="text-orange-500" />
                    <span className="text-xs tracking-wider">{toastMessage}</span>
                </div>
            </div>

            {/* --- NAVBAR --- */}
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300 hover:bg-white">
                <div className="hidden md:flex gap-10 text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                    <span className="text-gray-900">Portal Member</span>
                    <a href="#concierge" className="hover:text-orange-500 transition-colors">Concierge</a>
                    <a href="#reservations" className="hover:text-orange-500 transition-colors">Reservations</a>
                </div>

                <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2 cursor-pointer" onClick={() => navigate("/")}>
                    <FaStar className="text-orange-500 text-lg mb-1" />
                    <h1 className="text-xl md:text-2xl font-serif tracking-[0.2em] uppercase text-gray-900">Capella</h1>
                </div>

                <div className="flex items-center gap-6 ml-auto">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase">Welcome,</span>
                        <span className="text-xs font-serif text-gray-900">{fullName}</span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="bg-gray-900 hover:bg-orange-500 text-white px-6 py-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-2"
                    >
                        Sign Out <FaSignOutAlt />
                    </button>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="relative h-[65vh] w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-gray-900">
                <img 
                    src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=2000" 
                    alt="Capella Lounge" 
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                
                <div className="relative z-20 text-center text-white mt-10">
                    <div className="inline-flex items-center justify-center gap-2 border border-orange-500/50 bg-black/30 backdrop-blur-sm px-4 py-1.5 mb-6">
                        <FaCrown className="text-orange-400 text-xs" />
                        <span className="text-[10px] text-white font-bold tracking-[0.2em] uppercase">{loyaltyTier} MEMBER</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif tracking-[0.2em] uppercase mb-4 drop-shadow-md">
                        Your Journey Awaits
                    </h2>
                    <p className="text-sm md:text-base font-light tracking-wide text-gray-300 drop-shadow-md max-w-xl mx-auto">
                        Akses eksklusif ke reservasi Anda, keuntungan khusus member, dan layanan personalisasi dari Capella.
                    </p>
                </div>
            </header>

            {/* --- FITUR CRM 1: LOYALTY PROGRESS BAR --- */}
            <div className="relative z-30 max-w-[1000px] mx-auto px-6 -mt-8">
                <div className="bg-white shadow-xl shadow-gray-200/50 border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="w-full md:w-2/3">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                            <span className="text-orange-500">{loyaltyTier}</span>
                            <span className="text-gray-400">{nextTier}</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 overflow-hidden">
                            <div className="bg-orange-500 h-full" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-3 font-light tracking-wide">
                            Hanya butuh <strong className="text-gray-900">2.500 poin</strong> lagi untuk mencapai status {nextTier} dan menikmati layanan Butler pribadi.
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <button onClick={() => showToast("Anda akan diarahkan ke halaman cara mendapatkan poin.")} className="w-full text-[10px] bg-white border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-6 py-3 font-bold uppercase tracking-[0.2em] transition-all">
                            Earn More Points
                        </button>
                    </div>
                </div>
            </div>

            {/* --- FITUR CRM 2: DASHBOARD WIDGETS --- */}
            <section className="py-16 px-6 md:px-16">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Points Widget */}
                        <div className="bg-gray-50 border border-gray-100 p-8 hover:border-orange-200 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase block mb-2">Points Balance</span>
                                    <h3 className="text-2xl font-serif text-gray-900">12,500 <span className="text-sm text-gray-400 font-sans tracking-normal">Pts</span></h3>
                                </div>
                                <FaStar className="text-orange-300 text-3xl" />
                            </div>
                            <p className="text-xs text-gray-500 font-light mb-8">Tukarkan poin Anda dengan menginap gratis, sesi spa, atau makan malam romantis.</p>
                            <span onClick={() => showToast("Katalog Penukaran Poin sedang disiapkan...")} className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] cursor-pointer hover:text-gray-900 transition-colors border-b border-orange-500 pb-1 flex items-center gap-2 w-max">
                                Rewards Catalog <FaArrowRight />
                            </span>
                        </div>

                        {/* Booking Widget */}
                        <div id="reservations" className="bg-gray-50 border border-gray-100 p-8 hover:border-orange-200 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase block mb-2">My Stays</span>
                                    <h3 className="text-xl font-serif text-gray-900">No Active Booking</h3>
                                </div>
                                <FaRegCalendarCheck className="text-gray-300 text-3xl" />
                            </div>
                            <p className="text-xs text-gray-500 font-light mb-8">Jadwalkan kunjungan Anda berikutnya dan nikmati keistimewaan harga khusus member.</p>
                            <span onClick={() => showToast("Mengarahkan ke halaman Booking...")} className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] cursor-pointer hover:text-gray-900 transition-colors border-b border-orange-500 pb-1 flex items-center gap-2 w-max">
                                Book A Room <FaArrowRight />
                            </span>
                        </div>

                        {/* Offers Widget */}
                        <div id="rewards" className="bg-gray-900 text-white border border-gray-800 p-8 relative overflow-hidden">
                            <div className="absolute -right-6 -top-6 text-gray-800 opacity-50">
                                <FaGift className="text-9xl" />
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <span className="text-[9px] text-gray-900 font-bold tracking-[0.2em] uppercase bg-orange-500 px-2 py-1 rounded-sm">Special Offer</span>
                                    <h3 className="text-xl font-serif text-white mt-4">Complimentary Spa</h3>
                                    <p className="text-xs text-gray-400 font-light mt-2 max-w-[200px]">Tersedia 1 voucher spa Aura Retreat eksklusif untuk Anda.</p>
                                </div>
                                <span onClick={() => showToast("Selamat! Voucher Spa telah ditambahkan ke akun Anda.")} className="mt-8 text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] cursor-pointer hover:text-white transition-colors border-b border-orange-500 pb-1 flex items-center gap-2 w-max">
                                    Claim Voucher <FaTicketAlt />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FITUR CRM 3: DIGITAL CONCIERGE (QUICK ACTIONS) --- */}
            <section id="concierge" className="py-16 px-6 md:px-16 border-t border-gray-100 bg-white">
                <div className="max-w-[1400px] mx-auto text-center">
                    <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] block mb-3">At Your Service</span>
                    <h2 className="text-2xl md:text-3xl font-serif text-gray-800 tracking-widest uppercase mb-12">Digital Concierge</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div onClick={() => showToast("Layanan Airport Transfer akan dikonfirmasi ke email Anda.")} className="group border border-gray-100 p-8 hover:bg-gray-50 cursor-pointer transition-all flex flex-col items-center text-center">
                            <FaPlaneArrival className="text-3xl text-gray-300 group-hover:text-orange-500 transition-colors mb-4" />
                            <h4 className="font-serif text-gray-900 mb-2">Airport Transfer</h4>
                            <p className="text-[10px] text-gray-500 font-light">Atur penjemputan VIP Anda</p>
                        </div>
                        <div onClick={() => showToast("Menu In-Room Dining akan segera ditampilkan.")} className="group border border-gray-100 p-8 hover:bg-gray-50 cursor-pointer transition-all flex flex-col items-center text-center">
                            <FaUtensils className="text-3xl text-gray-300 group-hover:text-orange-500 transition-colors mb-4" />
                            <h4 className="font-serif text-gray-900 mb-2">In-Room Dining</h4>
                            <p className="text-[10px] text-gray-500 font-light">Pesan hidangan ke kamar</p>
                        </div>
                        <div onClick={() => showToast("Preferensi menu bantal Anda telah kami simpan.")} className="group border border-gray-100 p-8 hover:bg-gray-50 cursor-pointer transition-all flex flex-col items-center text-center">
                            <FaBed className="text-3xl text-gray-300 group-hover:text-orange-500 transition-colors mb-4" />
                            <h4 className="font-serif text-gray-900 mb-2">Pillow Menu</h4>
                            <p className="text-[10px] text-gray-500 font-light">Pilih preferensi bantal tidur</p>
                        </div>
                        <div onClick={() => {setIsChatOpen(true); showToast("Menghubungkan ke tim Support...");}} className="group border border-gray-100 p-8 hover:bg-gray-50 cursor-pointer transition-all flex flex-col items-center text-center">
                            <FaConciergeBell className="text-3xl text-gray-300 group-hover:text-orange-500 transition-colors mb-4" />
                            <h4 className="font-serif text-gray-900 mb-2">Special Request</h4>
                            <p className="text-[10px] text-gray-500 font-light">Ulang tahun atau Anniversary</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FITUR CRM 4: ROOM CATALOG & PAST STAYS --- */}
            <section className="py-24 px-6 md:px-16 bg-gray-50/50 border-t border-gray-100">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] block mb-4">Curated Escapes</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-widest uppercase mb-4">Recommended For You</h2>
                        <p className="text-sm text-gray-500 font-light tracking-wide max-w-2xl mx-auto">
                            Berdasarkan riwayat preferensi menginap Anda, kami telah menyiapkan koleksi suite terbaik.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recommendedRooms.map((room) => (
                            <div key={room.id} className="group cursor-pointer bg-white border border-gray-100 p-6 hover:shadow-xl transition-all">
                                <div className="overflow-hidden mb-6 relative">
                                    <img src={room.image} className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-1000" alt={room.title} />
                                    <div className="absolute top-4 right-4 bg-gray-900 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1">{room.tag}</div>
                                </div>
                                <h3 className="text-xl font-serif text-gray-900 mb-2">{room.title}</h3>
                                <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase mb-6">{room.location}</p>
                                
                                <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-gray-400 tracking-[0.1em] uppercase">Member Rate</p>
                                        <p className="text-lg font-serif text-orange-600 mt-1">{room.price}</p>
                                    </div>
                                    <span onClick={() => showToast(`Reservasi ${room.title} ditambahkan ke sesi Anda.`)} className="text-[10px] text-gray-900 font-bold uppercase tracking-[0.2em] group-hover:text-orange-500 transition-colors border-b border-gray-900 group-hover:border-orange-500 pb-1">
                                        Book Now
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* RIWAYAT MENGINAP (Past Stays) */}
                    <div className="mt-16 bg-white border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <FaHistory className="text-gray-400 text-xl" />
                            </div>
                            <div>
                                <h4 className="font-serif text-gray-900 text-lg">Capella Ubud, Bali</h4>
                                <p className="text-xs text-gray-500 font-light mt-1">Menginap pada 12 - 15 Oktober 2025</p>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <button onClick={() => showToast("Form ulasan akan segera dibuka.")} className="flex-1 md:flex-none text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] border border-gray-200 px-6 py-3 hover:bg-gray-50 transition-colors">
                                Leave a Review
                            </button>
                            <button onClick={() => showToast("Menyiapkan pemesanan ulang untuk tanggal yang sama...")} className="flex-1 md:flex-none text-[10px] bg-gray-900 text-white font-bold uppercase tracking-[0.2em] px-6 py-3 hover:bg-orange-500 transition-colors">
                                Book Again
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER MEMBER --- */}
            <footer className="bg-white border-t border-gray-200 pt-16 pb-10 px-6 md:px-16 text-center md:text-left">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
                    <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
                        <FaStar className="text-orange-500 text-xl mb-3" />
                        <h2 className="text-xl font-serif tracking-[0.2em] uppercase text-gray-900 mb-2">Capella</h2>
                        <p className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">Member Secure Portal</p>
                    </div>
                    
                    <div className="w-full md:w-1/2 flex flex-wrap justify-center md:justify-end gap-10 text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                        <a href="#" className="hover:text-orange-500 transition-colors">My Profile</a>
                        <a href="#" className="hover:text-orange-500 transition-colors">Payment Methods</a>
                        <a href="#concierge" className="hover:text-orange-500 transition-colors">Contact Concierge</a>
                    </div>
                </div>
                <div className="max-w-[1400px] mx-auto border-t border-gray-100 pt-8 flex justify-center text-[10px] text-gray-400 tracking-wider">
                    <p>&copy; 2026 Capella Hotel Group. PFL & CRM Project.</p>
                </div>
            </footer>

            {/* --- FLOATING AI CHAT WIDGET --- */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
                {/* Chat Window */}
                <div className={`mb-4 w-80 bg-white border border-gray-200 shadow-2xl rounded-t-2xl rounded-bl-2xl overflow-hidden transition-all origin-bottom-right duration-300 ${isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                    {/* Header */}
                    <div className="bg-gray-900 px-5 py-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                                <FaConciergeBell className="text-white text-xs" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold tracking-widest uppercase">Capella AI</h4>
                                <p className="text-[9px] text-orange-200">Online 24/7</p>
                            </div>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                            <FaTimes />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="h-64 bg-gray-50 p-4 overflow-y-auto flex flex-col gap-3">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-xs font-light leading-relaxed ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-br-none shadow-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Type a message..." 
                                className="flex-1 bg-gray-50 text-xs text-gray-700 outline-none rounded-full px-4 border border-gray-200 focus:border-orange-500 transition-colors"
                            />
                            <button type="submit" className="w-10 h-10 bg-gray-900 hover:bg-orange-500 text-white rounded-full flex items-center justify-center transition-colors">
                                <FaPaperPlane className="text-xs -ml-1" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Floating Action Button */}
                <button 
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="w-14 h-14 bg-gray-900 hover:bg-orange-500 text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)] rounded-full flex items-center justify-center transition-all hover:-translate-y-1"
                >
                    {isChatOpen ? <FaTimes className="text-xl" /> : <FaCommentDots className="text-xl" />}
                </button>
            </div>

        </div>
    );
}