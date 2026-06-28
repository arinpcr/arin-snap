import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { 
    FaStar, FaSignOutAlt, FaGift, FaRegCalendarCheck, FaCrown, 
    FaArrowRight, FaTicketAlt, FaConciergeBell, FaPlaneArrival, 
    FaUtensils, FaBed, FaHistory, FaCommentDots, FaTimes, FaPaperPlane,
    FaCheckCircle, FaCalendarAlt, FaUserFriends, FaExclamationCircle, FaAward 
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

export default function MemberPortal() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // CRM Dynamic States
    const [points, setPoints] = useState(12500);
    const [tierInfo, setTierInfo] = useState({ tier: "GOLD", discount: 15, nextTier: "PLATINUM", nextReq: 25000 });
    const [pastStays, setPastStays] = useState([]);

    // --- STATE MODAL & POPUP ---
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    
    // Booking Popup State
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookingForm, setBookingForm] = useState({
        checkIn: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        guests: "2 Tamu",
        notes: ""
    });

    // Rewards Catalog & Claim State
    const [showRewardsModal, setShowRewardsModal] = useState(false);
    const [claimedVouchers, setClaimedVouchers] = useState(["Complimentary Spa Aura Retreat"]);

    // Review Modal State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewTargetStay, setReviewTargetStay] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");

    // --- STATE UNTUK FITUR INTERAKTIF ---
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

    const calculateTier = (pts) => {
        if (pts >= 25000) return { tier: "PLATINUM", discount: 20, nextTier: "MAX", nextReq: 25000 };
        if (pts >= 10000) return { tier: "GOLD", discount: 15, nextTier: "PLATINUM", nextReq: 25000 };
        if (pts >= 2500) return { tier: "SILVER", discount: 10, nextTier: "GOLD", nextReq: 10000 };
        return { tier: "BRONZE", discount: 5, nextTier: "SILVER", nextReq: 2500 };
    };

    const fetchMemberData = async (currentUser) => {
        try {
            let { data: ptsData, error: ptsError } = await supabase
                .from('member_points')
                .select('*')
                .eq('user_id', currentUser.id)
                .single();

            if (!ptsData && !ptsError?.message?.includes("multiple")) {
                const initialPoints = 12500;
                const { data: newPts } = await supabase
                    .from('member_points')
                    .insert([{ user_id: currentUser.id, points: initialPoints, tier: 'GOLD' }])
                    .select()
                    .single();
                ptsData = newPts || { points: initialPoints, tier: 'GOLD' };
            }

            if (ptsData) {
                setPoints(ptsData.points);
                setTierInfo(calculateTier(ptsData.points));
            }
        } catch (e) {
            console.error("Error fetching points:", e);
        }

        try {
            const fullName = currentUser.user_metadata?.full_name || localStorage.getItem("registeredName") || (currentUser.email ? currentUser.email.split('@')[0] : "");
            const { data: bookings } = await supabase
                .from('booking')
                .select('*')
                .or(`user_id.eq.${currentUser.id}${fullName ? `,name.ilike.%${fullName}%` : ''}`)
                .order('id', { ascending: false });

            setPastStays(bookings || []);
        } catch (e) {
            console.error("Error fetching bookings:", e);
        }
    };

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/login");
                return;
            }
            setUser(user);
            await fetchMemberData(user);
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

    const handleLogoutConfirm = () => {
        setShowLogoutConfirm(true);
    };

    const executeLogout = async () => {
        await supabase.auth.signOut();
        localStorage.clear();
        window.location.href = "/";
    };

    // Fungsi untuk memunculkan notifikasi interaktif
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(""), 3000);
    };

    const openBookingModal = (room) => {
        setSelectedRoom(room || recommendedRooms[0]);
        setShowBookingModal(true);
    };

    const confirmBookingSubmit = async (e) => {
        e.preventDefault();
        if (!user || !selectedRoom) return;
        try {
            const newBookingId = `#BKG-${Math.floor(Math.random() * 9000) + 1000}`;
            const dateStr = `${bookingForm.checkIn} s/d ${bookingForm.checkOut}`;
            const fullName = user.user_metadata?.full_name || localStorage.getItem("registeredName") || (user.email ? user.email.split('@')[0] : "Capella Member");

            await supabase.from('booking').insert([{
                booking_id: newBookingId,
                name: fullName,
                status: 'Pending',
                price: selectedRoom.price,
                date: dateStr,
                user_id: user.id,
                room_title: `${selectedRoom.title} (${bookingForm.guests})`
            }]);

            setShowBookingModal(false);
            showToast(`Reservasi ${selectedRoom.title} berhasil diajukan! Status: PENDING (Menunggu ACC Admin)`);
            await fetchMemberData(user);
        } catch (err) {
            showToast("Gagal memesan kamar: " + err.message);
        }
    };

    const handleRedeemReward = async (rewardName, cost) => {
        if (points < cost) {
            showToast(`Poin tidak cukup! Butuh ${cost.toLocaleString()} PTS.`);
            return;
        }
        const newPts = points - cost;
        const newTierInfo = calculateTier(newPts);
        
        try {
            await supabase.from('member_points').upsert({
                user_id: user.id,
                points: newPts,
                tier: newTierInfo.tier
            }, { onConflict: 'user_id' });

            setPoints(newPts);
            setTierInfo(newTierInfo);
            setClaimedVouchers(prev => [...prev, rewardName]);
            showToast(`Berhasil menukarkan ${rewardName}! (-${cost.toLocaleString()} Pts)`);
        } catch (err) {
            showToast("Gagal menukarkan poin: " + err.message);
        }
    };

    const openReviewModal = (stay) => {
        setReviewTargetStay(stay);
        setReviewRating(5);
        setReviewComment("");
        setShowReviewModal(true);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewComment.trim()) {
            showToast("Silakan isi komentar ulasan Anda.");
            return;
        }
        const bonusPts = 500;
        const newPts = points + bonusPts;
        const newTierInfo = calculateTier(newPts);

        try {
            await supabase.from('member_points').upsert({
                user_id: user.id,
                points: newPts,
                tier: newTierInfo.tier
            }, { onConflict: 'user_id' });

            setPoints(newPts);
            setTierInfo(newTierInfo);
            setShowReviewModal(false);
            setReviewComment("");
            showToast(`Terima kasih atas ulasan ${reviewRating} Bintang! (+${bonusPts} Pts Review Bonus)`);
        } catch (err) {
            showToast("Gagal mengirim ulasan: " + err.message);
        }
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

    const fullName = user?.user_metadata?.full_name || localStorage.getItem("registeredName") || (user?.email ? user.email.split('@')[0] : "Capella Member");
    const { tier: loyaltyTier, discount: discountRate, nextTier, nextReq } = tierInfo;
    const progressPercentage = nextTier === "MAX" ? 100 : Math.min(100, Math.round((points / nextReq) * 100));
    const pointsNeeded = nextTier === "MAX" ? 0 : Math.max(0, nextReq - points);

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
                    <span onClick={() => navigate("/rewards")} className="hover:text-orange-500 transition-colors cursor-pointer">Rewards</span>
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
                        onClick={handleLogoutConfirm}
                        className="bg-gray-900 hover:bg-orange-500 text-white px-6 py-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-2 rounded-xl shadow-sm cursor-pointer"
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
                        <span className="text-[10px] text-white font-bold tracking-[0.2em] uppercase">{loyaltyTier} MEMBER ({discountRate}% OFF)</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif tracking-[0.15em] uppercase mb-2 drop-shadow-md text-white">
                        Welcome, {fullName}
                    </h2>
                    <h3 className="text-xl md:text-2xl font-serif tracking-[0.25em] text-orange-400 uppercase mb-4 drop-shadow-md">
                        Your Journey Awaits
                    </h3>
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
                            <span className="text-orange-500">{loyaltyTier} ({points.toLocaleString()} PTS)</span>
                            <span className="text-gray-400">{nextTier}</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 overflow-hidden">
                            <div className="bg-orange-500 h-full" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-3 font-light tracking-wide">
                            {nextTier === "MAX" ? (
                                <>Anda telah mencapai status tertinggi <strong className="text-gray-900">PLATINUM</strong> dengan diskon eksklusif 20%!</>
                            ) : (
                                <>Hanya butuh <strong className="text-gray-900">{pointsNeeded.toLocaleString()} poin</strong> lagi untuk mencapai status {nextTier} dan menikmati benefit diskon hingga {nextTier === "PLATINUM" ? "20%" : "15%"}.</>
                            )}
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
                        <div className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-orange-300 hover:shadow-xl transition-all shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase block mb-2">Points Balance</span>
                                    <h3 className="text-2xl font-serif text-gray-900">{points.toLocaleString()} <span className="text-sm text-gray-400 font-sans tracking-normal">Pts</span></h3>
                                </div>
                                <FaStar className="text-orange-300 text-3xl" />
                            </div>
                            <p className="text-xs text-gray-500 font-light mb-8 leading-relaxed">Tukarkan poin Anda dengan menginap gratis, sesi spa, atau makan malam romantis.</p>
                            <span onClick={() => navigate("/rewards")} className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] cursor-pointer hover:text-gray-900 transition-colors border-b border-orange-500 pb-1 flex items-center gap-2 w-max">
                                Rewards Catalog <FaArrowRight />
                            </span>
                        </div>

                        {/* Booking Widget */}
                        <div id="reservations" className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-orange-300 hover:shadow-xl transition-all shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase block mb-2">My Stays</span>
                                    <h3 className="text-xl font-serif text-gray-900">{pastStays.length > 0 ? `${pastStays.length} Reservasi Aktif` : "No Active Booking"}</h3>
                                </div>
                                <FaRegCalendarCheck className="text-orange-400 text-3xl" />
                            </div>
                            <p className="text-xs text-gray-500 font-light mb-8 leading-relaxed">Jadwalkan kunjungan Anda berikutnya dan nikmati keistimewaan harga khusus member.</p>
                            <span onClick={() => openBookingModal(recommendedRooms[0])} className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] cursor-pointer hover:text-gray-900 transition-colors border-b border-orange-500 pb-1 flex items-center gap-2 w-max">
                                Book A Room <FaArrowRight />
                            </span>
                        </div>

                        {/* Offers Widget */}
                        <div id="rewards" className="bg-gray-900 text-white border border-gray-800 p-8 rounded-3xl relative overflow-hidden hover:shadow-2xl transition-all shadow-md">
                            <div className="absolute -right-6 -top-6 text-gray-800 opacity-50">
                                <FaGift className="text-9xl" />
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <span className="text-[9px] text-gray-900 font-bold tracking-[0.2em] uppercase bg-orange-500 px-3 py-1 rounded-full">Special Offer</span>
                                    <h3 className="text-xl font-serif text-white mt-4">Complimentary Spa</h3>
                                    <p className="text-xs text-gray-400 font-light mt-2 max-w-[200px] leading-relaxed">Tersedia 1 voucher spa Aura Retreat eksklusif untuk Anda.</p>
                                </div>
                                <span onClick={() => navigate("/rewards")} className="mt-8 text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] cursor-pointer hover:text-white transition-colors border-b border-orange-500 pb-1 flex items-center gap-2 w-max">
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
                            <div onClick={() => openBookingModal(room)} key={room.id} className="group cursor-pointer bg-white border border-gray-100 p-6 rounded-3xl hover:shadow-2xl hover:border-orange-300 transition-all shadow-sm">
                                <div className="overflow-hidden mb-6 relative rounded-2xl">
                                    <img src={room.image} className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-1000" alt={room.title} />
                                    <div className="absolute top-4 right-4 bg-gray-900 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full shadow-md">{room.tag}</div>
                                </div>
                                <h3 className="text-xl font-serif text-gray-900 mb-2">{room.title}</h3>
                                <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase mb-6">{room.location}</p>
                                
                                <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-gray-400 tracking-[0.1em] uppercase">Member Rate</p>
                                        <p className="text-lg font-serif font-bold text-orange-600 mt-1">{room.price}</p>
                                    </div>
                                    <span className="text-[10px] bg-gray-900 text-white font-bold uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl group-hover:bg-orange-500 transition-all cursor-pointer shadow-sm">
                                        Book Now
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* RIWAYAT MENGINAP & STATUS RESERVASI (Past Stays) */}
                    <div className="mt-16">
                        <h3 className="text-xl font-serif text-gray-800 tracking-wider uppercase mb-6 text-center md:text-left flex items-center gap-3">
                            <FaRegCalendarCheck className="text-orange-500" /> My Reservation Status & History
                        </h3>
                        {pastStays.length > 0 ? (
                            pastStays.map((stay, idx) => {
                                const st = (stay.status || 'Confirmed').toLowerCase();
                                const badgeStyle = st === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                                   st === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                                                   st === 'cancelled' ? 'bg-rose-100 text-rose-700 border-rose-300' :
                                                   'bg-emerald-100 text-emerald-700 border-emerald-300';
                                return (
                                    <div key={idx} className="mb-4 bg-white border border-gray-100 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm hover:shadow-md hover:border-orange-200 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0 border border-orange-100">
                                                <FaHistory className="text-orange-500 text-xl" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md border border-gray-200">{stay.booking_id || `#BKG-${idx+100}`}</span>
                                                    <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border ${badgeStyle}`}>
                                                        ● {stay.status || 'Confirmed'}
                                                    </span>
                                                </div>
                                                <h4 className="font-serif text-gray-900 text-lg">{stay.room_title || stay.name || "Capella Luxury Suite"}</h4>
                                                <p className="text-xs text-gray-500 font-light mt-1 flex items-center gap-4">
                                                    <span>Total: <strong className="text-gray-800 font-medium">{stay.price || 'Rp 3.500.000'}</strong></span>
                                                    <span>•</span>
                                                    <span>Jadwal: <strong className="text-gray-800 font-medium">{stay.date || 'Besok'}</strong></span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 w-full md:w-auto">
                                            <button onClick={() => openReviewModal(stay)} className="flex-1 md:flex-none text-[10px] text-gray-600 font-bold uppercase tracking-[0.15em] border border-gray-200 rounded-xl px-5 py-3 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer">
                                                Leave a Review ★
                                            </button>
                                            <button onClick={() => openBookingModal({ title: stay.room_title || "Capella Luxury Suite", price: stay.price || "Rp 3.500.000" })} className="flex-1 md:flex-none text-[10px] bg-gray-900 text-white font-bold uppercase tracking-[0.15em] rounded-xl px-5 py-3 hover:bg-orange-500 transition-all cursor-pointer shadow-sm">
                                                Reschedule / Book
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white border border-gray-100 p-8 text-center text-gray-500 text-xs font-light">
                                Belum ada riwayat reservasi. Klik "Book Now" pada daftar kamar rekomendasi di atas untuk melakukan reservasi pertama Anda!
                            </div>
                        )}
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
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
                {/* Chat Window */}
                <div className={`mb-4 w-80 bg-white border border-gray-200 shadow-2xl rounded-t-2xl rounded-bl-2xl overflow-hidden transition-all origin-bottom-right duration-300 ${isChatOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'}`}>
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
                        <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
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
                            <button type="submit" className="w-10 h-10 bg-gray-900 hover:bg-orange-500 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer">
                                <FaPaperPlane className="text-xs -ml-1" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Floating Action Button */}
                <button 
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="w-14 h-14 bg-gray-900 hover:bg-orange-500 text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)] rounded-full flex items-center justify-center transition-all hover:-translate-y-1 cursor-pointer pointer-events-auto"
                >
                    {isChatOpen ? <FaTimes className="text-xl" /> : <FaCommentDots className="text-xl" />}
                </button>
            </div>

            {/* --- LOGOUT CONFIRMATION MODAL --- */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center transform transition-all scale-100">
                        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 text-2xl border border-rose-100">
                            <FaExclamationCircle />
                        </div>
                        <h3 className="text-2xl font-serif text-gray-900 mb-3">Konfirmasi Keluar</h3>
                        <p className="text-xs text-gray-500 font-light leading-relaxed mb-8">
                            Apakah Anda yakin ingin keluar dari sesi portal VIP Member Capella Anda saat ini?
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 py-3 px-6 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-[0.15em] text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={executeLogout}
                                className="flex-1 py-3 px-6 bg-rose-600 hover:bg-rose-700 rounded-xl text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors cursor-pointer shadow-lg shadow-rose-500/30"
                            >
                                Ya, Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- BOOKING RESERVATION POPUP MODAL --- */}
            {showBookingModal && selectedRoom && (
                <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
                    <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-gray-100 my-8">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-5 mb-6">
                            <div>
                                <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em]">VIP Reservation</span>
                                <h3 className="text-2xl font-serif text-gray-900 mt-1">{selectedRoom.title}</h3>
                            </div>
                            <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-gray-900 text-xl cursor-pointer">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={confirmBookingSubmit} className="space-y-6">
                            <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl flex justify-between items-center">
                                <span className="text-xs text-gray-600 font-light">Tarif Member per malam:</span>
                                <span className="text-lg font-serif font-bold text-orange-600">{selectedRoom.price}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-gray-400 font-bold tracking-[0.15em] uppercase block mb-2 flex items-center gap-2">
                                        <FaCalendarAlt className="text-orange-500" /> Check-In Date
                                    </label>
                                    <input 
                                        type="date" 
                                        value={bookingForm.checkIn} 
                                        onChange={(e) => setBookingForm({...bookingForm, checkIn: e.target.value})}
                                        required 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 outline-none focus:border-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 font-bold tracking-[0.15em] uppercase block mb-2 flex items-center gap-2">
                                        <FaCalendarAlt className="text-orange-500" /> Check-Out Date
                                    </label>
                                    <input 
                                        type="date" 
                                        value={bookingForm.checkOut} 
                                        onChange={(e) => setBookingForm({...bookingForm, checkOut: e.target.value})}
                                        required 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 outline-none focus:border-orange-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-400 font-bold tracking-[0.15em] uppercase block mb-2 flex items-center gap-2">
                                    <FaUserFriends className="text-orange-500" /> Jumlah Tamu
                                </label>
                                <select 
                                    value={bookingForm.guests} 
                                    onChange={(e) => setBookingForm({...bookingForm, guests: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 outline-none focus:border-orange-500"
                                >
                                    <option value="1 Tamu">1 Tamu (Single/Solo)</option>
                                    <option value="2 Tamu">2 Tamu (Couple Suite)</option>
                                    <option value="3 Tamu">3 Tamu (Family Small)</option>
                                    <option value="4 Tamu">4 Tamu (Family Grand)</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-400 font-bold tracking-[0.15em] uppercase block mb-2">
                                    Catatan Khusus (Pillow Menu / Transfer Bandara)
                                </label>
                                <textarea 
                                    rows="3" 
                                    value={bookingForm.notes}
                                    onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                                    placeholder="Contoh: Mohon disiapkan kamar lantai tinggi non-smoking."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-800 outline-none focus:border-orange-500"
                                ></textarea>
                            </div>

                            <div className="bg-gray-900 text-white p-5 rounded-2xl flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Bonus Poin Loyalitas</p>
                                    <p className="text-sm font-serif text-orange-400 mt-0.5">+1,500 PTS <span className="text-xs text-gray-300 font-sans">ditambahkan ke akun</span></p>
                                </div>
                                <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-[0.15em] px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/30 cursor-pointer">
                                    Konfirmasi Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- REWARDS CATALOG POPUP MODAL --- */}
            {showRewardsModal && (
                <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
                    <div className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl border border-gray-100 my-8">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-5 mb-6">
                            <div>
                                <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em]">VIP Privileges</span>
                                <h3 className="text-2xl font-serif text-gray-900 mt-1">Katalog Penukaran Poin Reward</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="bg-orange-50 text-orange-600 border border-orange-200 px-4 py-1.5 rounded-full text-xs font-bold">
                                    Saldo: {points.toLocaleString()} PTS
                                </span>
                                <button onClick={() => setShowRewardsModal(false)} className="text-gray-400 hover:text-gray-900 text-xl cursor-pointer">
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {[
                                { name: "Voucher Spa Aura Retreat", cost: 2500, desc: "Sesi pijat aromaterapi relaksasi 60 menit untuk 2 orang." },
                                { name: "Makan Malam Romantis VIP", cost: 5000, desc: "Sesi private dining dengan menu 5-course chef curated." },
                                { name: "Upgrade Kamar ke Penthouse", cost: 10000, desc: "Upgrade gratis ke kamar kategori tertinggi saat Check-In." },
                                { name: "Menginap Gratis 1 Malam", cost: 15000, desc: "Voucher menginap 1 malam gratis di seluruh properti Capella." }
                            ].map((item, idx) => {
                                const isClaimed = claimedVouchers.includes(item.name);
                                return (
                                    <div key={idx} className="border border-gray-200/80 rounded-2xl p-6 flex flex-col justify-between hover:border-orange-300 transition-all bg-gray-50/50">
                                        <div>
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-serif text-lg text-gray-900">{item.name}</h4>
                                                <FaAward className="text-orange-400 text-xl shrink-0" />
                                            </div>
                                            <p className="text-xs text-gray-500 font-light mb-6 leading-relaxed">{item.desc}</p>
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-200/60">
                                            <span className="text-sm font-serif font-bold text-orange-600">{item.cost.toLocaleString()} PTS</span>
                                            <button 
                                                onClick={() => !isClaimed && handleRedeemReward(item.name, item.cost)}
                                                disabled={isClaimed}
                                                className={`text-[10px] font-bold uppercase tracking-[0.15em] px-5 py-2.5 rounded-xl transition-all ${
                                                    isClaimed 
                                                    ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed' 
                                                    : 'bg-gray-900 hover:bg-orange-500 text-white cursor-pointer shadow-md'
                                                }`}
                                            >
                                                {isClaimed ? "Telah Diklaim ✓" : "Tukarkan"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {claimedVouchers.length > 0 && (
                            <div className="bg-orange-50/50 border border-orange-200/80 p-5 rounded-2xl">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-orange-800 mb-3 flex items-center gap-2">
                                    <FaTicketAlt /> Voucher Anda yang Tersedia:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {claimedVouchers.map((v, i) => (
                                        <span key={i} className="bg-white text-gray-800 border border-orange-200 px-3 py-1.5 rounded-lg text-xs font-medium shadow-2xs">
                                            🎟️ {v}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- LEAVE A REVIEW POPUP MODAL --- */}
            {showReviewModal && reviewTargetStay && (
                <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                            <div>
                                <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em]">Guest Experience</span>
                                <h3 className="text-xl font-serif text-gray-900 mt-1">Ulasan Masa Inap</h3>
                            </div>
                            <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-900 text-xl cursor-pointer">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-2xl text-center">
                                <p className="text-xs text-gray-500 mb-1">Kamar yang diulas:</p>
                                <h4 className="font-serif font-bold text-gray-900">{reviewTargetStay.room_title || reviewTargetStay.name || "Capella Luxury Suite"}</h4>
                            </div>

                            <div className="text-center">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block mb-3">Berikan Penilaian Bintang:</label>
                                <div className="flex justify-center gap-3 text-2xl">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            type="button"
                                            key={star} 
                                            onClick={() => setReviewRating(star)} 
                                            className={`transition-transform hover:scale-125 cursor-pointer ${star <= reviewRating ? 'text-orange-500' : 'text-gray-200'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block mb-2">Komentar Ulasan Anda:</label>
                                <textarea 
                                    rows="4" 
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Ceritakan pengalaman pelayanan Butler, kenyamanan kamar, atau suasana resor..."
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs text-gray-800 outline-none focus:border-orange-500"
                                ></textarea>
                            </div>

                            <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-xs flex items-center justify-between">
                                <span>🎁 Reward Ulasan:</span>
                                <strong className="font-bold">+500 Poin Loyalitas</strong>
                            </div>

                            <button type="submit" className="w-full bg-gray-900 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-[0.15em] py-4 rounded-xl transition-all shadow-lg cursor-pointer">
                                Kirim Ulasan
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}