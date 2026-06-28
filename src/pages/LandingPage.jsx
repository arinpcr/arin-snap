import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaChevronDown, FaChevronUp, FaEnvelope, FaShoppingCart } from "react-icons/fa";
import { supabase } from "../lib/supabase";

export default function LandingPage() {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("member");
    const [reviews, setReviews] = useState([]);
    const [bookingForm, setBookingForm] = useState({
        checkIn: "",
        checkOut: "",
        promoCode: ""
    });

    useEffect(() => {
        const checkLogin = async () => {
            const logged = localStorage.getItem("isLoggedIn") === "true";
            const role = localStorage.getItem("userRole") || "member";
            if (logged) {
                setIsLoggedIn(true);
                setUserRole(role);
            } else {
                const { data } = await supabase.auth.getSession();
                if (data?.session) {
                    setIsLoggedIn(true);
                    const dbRole = data.session.user?.user_metadata?.role || "member";
                    setUserRole(dbRole);
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userRole", dbRole);
                }
            }
        };
        checkLogin();

        const fetchLandingReviews = async () => {
            try {
                const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false }).limit(6);
                setReviews(data || []);
            } catch (e) {
                console.error("Error fetching landing reviews:", e);
            }
        };
        fetchLandingReviews();
    }, []);

    const handleLogout = async () => {
        if (!window.confirm("Apakah Anda yakin ingin keluar dari akun Anda?")) return;
        await supabase.auth.signOut();
        localStorage.clear();
        setIsLoggedIn(false);
        window.location.href = "/";
    };

    const handleBookingChange = (evt) => {
        const { name, value } = evt.target;
        setBookingForm({ ...bookingForm, [name]: value });
    };

    const handleCheckRates = (e) => {
        e.preventDefault();
        const { checkIn, checkOut } = bookingForm;

        if (!checkIn || !checkOut) {
            alert("Silakan lengkapi tanggal Check In dan Check Out terlebih dahulu.");
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);

        if (inDate < today) {
            alert("Tanggal Check In tidak boleh di masa lampau.");
            return;
        }

        if (outDate <= inDate) {
            alert("Tanggal Check Out harus setelah tanggal Check In.");
            return;
        }

        if (!isLoggedIn) {
            alert("Kamar tersedia! Silakan login atau daftar terlebih dahulu untuk melanjutkan reservasi.");
            navigate("/login");
        } else {
            alert(`Kamar tersedia untuk tanggal ${checkIn} hingga ${checkOut}! Mengarahkan ke Portal...`);
            navigate(userRole === "staff" ? "/dashboard" : "/member-portal");
        }
    };

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans scroll-smooth">
            
            {/* --- 1. NAVBAR --- */}
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300 hover:bg-white">
                <div className="hidden xl:flex gap-8 text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                    <a href="#about" className="hover:text-orange-500 transition-colors">About</a>
                    <a href="#facilities" className="hover:text-orange-500 transition-colors">Facilities</a>
                    <a href="#offers" className="hover:text-orange-500 transition-colors">Offers</a>
                    <a href="#gallery" className="hover:text-orange-500 transition-colors">Gallery</a>
                    <a href="#rewards" className="hover:text-orange-500 transition-colors">Rewards</a>
                </div>

                <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2 cursor-pointer">
                    <FaStar className="text-orange-500 text-lg mb-1" />
                    <h1 className="text-xl md:text-2xl font-serif tracking-[0.2em] uppercase text-gray-900">Capella</h1>
                </div>

                <div className="flex items-center gap-6 ml-auto">
                    {isLoggedIn && userRole !== "staff" ? (
                        <>
                            <button onClick={handleLogout} className="text-[11px] font-bold tracking-[0.2em] text-gray-400 hover:text-orange-500 transition-colors hidden md:block uppercase cursor-pointer">
                                Logout
                            </button>
                            <Link to={userRole === "staff" ? "/dashboard" : "/member-portal"} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-all inline-block">
                                Go to Portal
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-[11px] font-bold tracking-[0.2em] text-gray-400 hover:text-orange-500 transition-colors hidden md:block uppercase">
                                Login
                            </Link>
                            <a href="#book" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-all">
                                Book Your Stay
                            </a>
                        </>
                    )}
                </div>
            </nav>

            {/* --- 2. HERO SECTION & CRM BOOKING BAR --- */}
            <header className="relative h-screen w-full flex flex-col justify-center items-center px-6 overflow-hidden bg-gray-900">
                <img 
                    src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=2000" 
                    alt="Capella Hotel" 
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                
                <div className="relative z-20 text-center text-white mt-[-80px]">
                    <FaStar className="mx-auto text-3xl md:text-4xl mb-4 text-white drop-shadow-md" />
                    <h1 className="text-4xl md:text-6xl font-serif tracking-[0.2em] uppercase mb-4 drop-shadow-md">Capella</h1>
                    <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-16 drop-shadow-md">Hotels and Resorts</p>
                    
                    {isLoggedIn && userRole !== "staff" ? (
                        <div className="mt-2 mb-8 bg-black/50 backdrop-blur-md border border-orange-500/60 px-8 py-4 rounded-full inline-flex flex-col md:flex-row items-center gap-4 shadow-xl">
                            <span className="text-xs md:text-sm font-serif tracking-widest text-orange-300">
                                Welcome back, <strong className="text-white uppercase tracking-[0.1em]">{localStorage.getItem("registeredName") || "Capella Member"}</strong>!
                            </span>
                            <Link to={userRole === "staff" ? "/dashboard" : "/member-portal"} className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-2 rounded-full transition-all">
                                Open Portal →
                            </Link>
                        </div>
                    ) : null}

                    <p className="text-lg md:text-2xl font-serif tracking-wide mt-6 md:mt-16 drop-shadow-md">Discover Your Bespoke Journey</p>
                </div>

                <div id="book" className="absolute bottom-10 md:bottom-20 w-full max-w-[1000px] px-6 z-30">
                    <form onSubmit={handleCheckRates} className="bg-white p-4 md:p-6 flex flex-col md:flex-row gap-4 items-end shadow-2xl border-t-4 border-orange-500">
                        <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
                            <label className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase block mb-2">Check In</label>
                            <input type="date" name="checkIn" value={bookingForm.checkIn} onChange={handleBookingChange} className="w-full outline-none text-gray-800 text-sm font-serif" required />
                        </div>
                        <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4 md:pl-4">
                            <label className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase block mb-2">Check Out</label>
                            <input type="date" name="checkOut" value={bookingForm.checkOut} onChange={handleBookingChange} className="w-full outline-none text-gray-800 text-sm font-serif" required />
                        </div>
                        <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4 md:pl-4">
                            <label className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase block mb-2">Promo Code</label>
                            <input type="text" name="promoCode" value={bookingForm.promoCode} onChange={handleBookingChange} placeholder="e.g. CAPELLA2026" className="w-full outline-none text-gray-800 text-sm font-serif placeholder-gray-300 uppercase" />
                        </div>
                        <div className="md:pl-4 w-full md:w-auto">
                            <button type="submit" className="w-full bg-gray-900 hover:bg-orange-500 text-white px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all">
                                Check Rates
                            </button>
                        </div>
                    </form>
                </div>
            </header>
            {/* --- SECTION: ABOUT CAPELLA --- */}
            <section id="about" className="py-24 px-6 md:px-16 bg-white border-t border-gray-100">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-5">
                            <div className="group bg-gray-50/50 border border-gray-100 p-6 hover:shadow-xl transition-all">
                                <div className="overflow-hidden relative">
                                    <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop" alt="Capella Craftsmanship" className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-1000" />
                                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1">No. 1 Hotel Brand</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="lg:col-span-7 lg:pl-6">
                            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] block mb-4">The Capella Philosophy</span>
                            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-widest uppercase mb-6">A Sanctuary of Timeless Elegance</h2>
                            <p className="text-sm text-gray-500 font-light leading-relaxed mb-6">
                                Capella Hotels and Resorts lahir dari filosofi bahwa kemewahan sejati bukanlah sekadar kemegahan visual, melainkan harmonisasi sempurna antara warisan budaya lokal, arsitektur kelas dunia, dan pelayanan yang dilayani dari hati.
                            </p>
                            <p className="text-sm text-gray-500 font-light leading-relaxed mb-10">
                                Setiap properti kami dirancang sebagai persembunyian eksklusif di mana waktu melambat. Dari momen Anda menapakkan kaki, dedikasi Capella Culturist siap merangkai setiap detil perjalanan Anda menjadi memori yang tak lekang oleh waktu.
                            </p>
                            
                            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                                <div>
                                    <h3 className="text-2xl font-serif text-gray-900">100%</h3>
                                    <p className="text-[10px] text-gray-400 tracking-[0.15em] uppercase mt-1">Personalized Butler</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif text-gray-900">7+</h3>
                                    <p className="text-[10px] text-gray-400 tracking-[0.15em] uppercase mt-1">Global Sanctuaries</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif text-gray-900">5-Star</h3>
                                    <p className="text-[10px] text-gray-400 tracking-[0.15em] uppercase mt-1">Forbes Guide</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION: WORLD-CLASS FACILITIES --- */}
            <section id="facilities" className="py-24 px-6 md:px-16 bg-gray-50/50 border-t border-gray-100">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] block mb-4">Enhance Your Stay</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-widest uppercase mb-4">World-Class Amenities</h2>
                        <p className="text-sm text-gray-500 font-light tracking-wide max-w-2xl mx-auto">Nikmati standar kenyamanan tertinggi yang dirancang khusus untuk memenuhi gaya hidup kaum elit global dan memberi relaksasi menyeluruh.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="group cursor-pointer bg-white border border-gray-100 p-6 hover:shadow-xl transition-all flex flex-col justify-between">
                            <div>
                                <div className="overflow-hidden mb-6 relative">
                                    <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop" alt="Auriga Spa" className="w-full h-[220px] object-cover group-hover:scale-105 transition-transform duration-1000" />
                                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1">Wellness</div>
                                </div>
                                <h3 className="text-xl font-serif text-gray-900 mb-3">Auriga Spa & Wellness</h3>
                                <p className="text-xs text-gray-500 leading-relaxed font-light mb-6">Perawatan holistik berlandaskan fase siklus bulan dengan bahan organik alami untuk memulihkan vitalitas tubuh.</p>
                            </div>
                            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] group-hover:text-gray-900 transition-colors border-b border-orange-500 pb-1 self-start">Discover More</span>
                        </div>

                        <div className="group cursor-pointer bg-white border border-gray-100 p-6 hover:shadow-xl transition-all flex flex-col justify-between">
                            <div>
                                <div className="overflow-hidden mb-6 relative">
                                    <img src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800&auto=format&fit=crop" alt="Vitality Pool" className="w-full h-[220px] object-cover group-hover:scale-105 transition-transform duration-1000" />
                                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1">Leisure</div>
                                </div>
                                <h3 className="text-xl font-serif text-gray-900 mb-3">Infinity Vitality Pool</h3>
                                <p className="text-xs text-gray-500 leading-relaxed font-light mb-6">Kolam renang air hangat bertingkat yang menghadap langsung ke panorama alam terbuka yang memukau dan menenangkan.</p>
                            </div>
                            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] group-hover:text-gray-900 transition-colors border-b border-orange-500 pb-1 self-start">Discover More</span>
                        </div>

                        <div className="group cursor-pointer bg-white border border-gray-100 p-6 hover:shadow-xl transition-all flex flex-col justify-between">
                            <div>
                                <div className="overflow-hidden mb-6 relative">
                                    <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop" alt="Michelin Dining" className="w-full h-[220px] object-cover group-hover:scale-105 transition-transform duration-1000" />
                                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1">Dining</div>
                                </div>
                                <h3 className="text-xl font-serif text-gray-900 mb-3">Michelin-Star Dining</h3>
                                <p className="text-xs text-gray-500 leading-relaxed font-light mb-6">Petualangan kuliner magis dari master chef internasional yang memadukan teknik modern dengan bahan lokal berkelas.</p>
                            </div>
                            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] group-hover:text-gray-900 transition-colors border-b border-orange-500 pb-1 self-start">Discover More</span>
                        </div>

                        <div className="group cursor-pointer bg-white border border-gray-100 p-6 hover:shadow-xl transition-all flex flex-col justify-between">
                            <div>
                                <div className="overflow-hidden mb-6 relative">
                                    <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop" alt="The Living Room" className="w-full h-[220px] object-cover group-hover:scale-105 transition-transform duration-1000" />
                                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1">Lounge</div>
                                </div>
                                <h3 className="text-xl font-serif text-gray-900 mb-3">The Living Room</h3>
                                <p className="text-xs text-gray-500 leading-relaxed font-light mb-6">Ruang bersantai eksklusif bagi tamu untuk menikmati afternoon tea, membaca literatur langka, dan bersosialisasi.</p>
                            </div>
                            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] group-hover:text-gray-900 transition-colors border-b border-orange-500 pb-1 self-start">Discover More</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 3. CRM FEATURE: EXCLUSIVE OFFERS --- */}
            <section id="offers" className="py-24 px-6 md:px-16 bg-gray-50/50">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-widest uppercase mb-4">Curated Offers</h2>
                        <p className="text-sm text-gray-500 font-light tracking-wide">Eksklusif untuk member Capella Circle. Nikmati pengalaman tak terlupakan dengan nilai terbaik.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        <div className="group cursor-pointer bg-white border border-gray-100 p-6 hover:shadow-xl transition-all">
                            <div className="overflow-hidden mb-6 relative">
                                <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop" className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-1000" alt="Spa Offer" />
                                <div className="absolute top-4 right-4 bg-orange-500 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1">Member Only</div>
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 mb-3">Stay 3, Pay 2</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-light mb-6">Perpanjang momen relaksasi Anda. Pesan 3 malam di akomodasi Suite kami dan cukup bayar untuk 2 malam.</p>
                            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] group-hover:text-gray-900 transition-colors border-b border-orange-500 pb-1">Discover More</span>
                        </div>

                        <div className="group cursor-pointer bg-white border border-gray-100 p-6 hover:shadow-xl transition-all">
                            <div className="overflow-hidden mb-6 relative">
                                <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop" className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-1000" alt="Dining Offer" />
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 mb-3">Gastronomic Journey</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-light mb-6">Paket menginap yang sudah termasuk makan malam eksklusif 5-course di restoran Michelin-star kami.</p>
                            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] group-hover:text-gray-900 transition-colors border-b border-orange-500 pb-1">Discover More</span>
                        </div>

                        <div className="group cursor-pointer bg-white border border-gray-100 p-6 hover:shadow-xl transition-all">
                            <div className="overflow-hidden mb-6 relative">
                                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop" className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-1000" alt="Wellness Offer" />
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 mb-3">Aura Wellness Retreat</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-light mb-6">Pelarian dari kesibukan. Termasuk sesi pijat tradisional 90 menit dan akses eksklusif ke Thermal Suite.</p>
                            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] group-hover:text-gray-900 transition-colors border-b border-orange-500 pb-1">Discover More</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 4. CAPELLA BOUTIQUE --- */}
            <section id="boutique" className="py-24 px-6 md:px-16 bg-white border-t border-gray-100">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] block mb-4">Enhance Your Stay</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-widest uppercase mb-4">Capella Boutique</h2>
                        <p className="text-sm text-gray-500 font-light tracking-wide max-w-2xl mx-auto">Tingkatkan pengalaman menginap Anda. Pesan fasilitas ekstra (Add-ons) ini sekarang dan kami akan menyiapkannya di kamar sebelum Anda tiba.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group flex flex-col bg-gray-50/50 border border-gray-100 p-8 hover:shadow-xl transition-all hover:border-orange-200">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase bg-orange-50 px-2 py-1 rounded-sm">Amenities</span>
                                        <h3 className="text-xl font-serif text-gray-900 mt-4">Aroma Diffuser Pro</h3>
                                    </div>
                                    <span className="text-2xl font-serif text-gray-900">$45</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed font-light mb-8">Hadirkan ketenangan di kamar Anda dengan pilihan wewangian khas Capella. Alat ini akan diatur di kamar Anda beserta set essential oil eksklusif.</p>
                            </div>
                            <button onClick={() => alert("Item berhasil ditambahkan ke keranjang reservasi Anda!")} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-orange-500 text-gray-900 hover:text-white border border-gray-200 hover:border-orange-500 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all">
                                <FaShoppingCart className="text-sm" /> Add to Stay
                            </button>
                        </div>

                        <div className="group flex flex-col bg-gray-50/50 border border-gray-100 p-8 hover:shadow-xl transition-all hover:border-orange-200">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase bg-orange-50 px-2 py-1 rounded-sm">Apparel</span>
                                        <h3 className="text-xl font-serif text-gray-900 mt-4">Silk Bathrobe Luxury</h3>
                                    </div>
                                    <span className="text-2xl font-serif text-gray-900">$120</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed font-light mb-8">Jubah mandi berbahan sutra 100% premium (SoftTouch) untuk kenyamanan maksimal. Dapat Anda bawa pulang sebagai suvenir manis dari Capella.</p>
                            </div>
                            <button onClick={() => alert("Item berhasil ditambahkan ke keranjang reservasi Anda!")} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-orange-500 text-gray-900 hover:text-white border border-gray-200 hover:border-orange-500 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all">
                                <FaShoppingCart className="text-sm" /> Add to Stay
                            </button>
                        </div>

                        <div className="group flex flex-col bg-gray-50/50 border border-gray-100 p-8 hover:shadow-xl transition-all hover:border-orange-200">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase bg-orange-50 px-2 py-1 rounded-sm">Beverages</span>
                                        <h3 className="text-xl font-serif text-gray-900 mt-4">Organic Green Tea</h3>
                                    </div>
                                    <span className="text-2xl font-serif text-gray-900">$12</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed font-light mb-8">Pilihan teh hijau organik eksklusif ZenBrew dari perkebunan terbaik, disiapkan di mini-bar kamar Anda lengkap dengan perlengkapan seduh.</p>
                            </div>
                            <button onClick={() => alert("Item berhasil ditambahkan ke keranjang reservasi Anda!")} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-orange-500 text-gray-900 hover:text-white border border-gray-200 hover:border-orange-500 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all">
                                <FaShoppingCart className="text-sm" /> Add to Stay
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 5. LOYALTY PROGRAM --- */}
            <section id="loyalty" className="py-24 md:py-32 px-6 md:px-16 max-w-[1400px] mx-auto bg-white border-t border-gray-100">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="w-full md:w-1/2 md:pr-12 text-center md:text-left">
                        <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] block mb-4">Loyalty Program</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-wide mb-6">Capella Circle</h2>
                        <p className="text-sm text-gray-500 leading-loose mb-10 font-light max-w-lg mx-auto md:mx-0">
                            Setiap masa inap adalah sebuah pengakuan atas kesetiaan Anda. Platform CRM kami dirancang untuk merekam preferensi Anda, memastikan pengalaman personalisasi tingkat tinggi setiap kali Anda kembali.
                        </p>
                        
                        <div className="space-y-6 mb-10 text-left max-w-md mx-auto md:mx-0">
                            <div className="flex items-start gap-4">
                                <div className="text-orange-500 mt-1"><FaStar /></div>
                                <div>
                                    <h4 className="font-serif text-gray-900">Member Exclusive Rates</h4>
                                    <p className="text-xs text-gray-400 font-light">Diskon instan hingga 15% dari harga reguler.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="text-orange-500 mt-1"><FaStar /></div>
                                <div>
                                    <h4 className="font-serif text-gray-900">Complimentary Upgrades</h4>
                                    <p className="text-xs text-gray-400 font-light">Peningkatan tipe kamar otomatis untuk level Gold & Platinum.</p>
                                </div>
                            </div>
                        </div>

                        <Link to="/register" className="inline-block bg-gray-900 hover:bg-orange-500 text-white px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all">
                            Join The Circle
                        </Link>
                    </div>
                    <div className="w-full md:w-1/2">
                        <img src="https://images.unsplash.com/photo-1562790351-d273a961e0e9?q=80&w=1200&auto=format&fit=crop" className="w-full h-[500px] object-cover" alt="VIP Experience" />
                    </div>
                </div>
            </section>

            {/* --- SECTION: GALLERY --- */}
            <section id="gallery" className="py-24 px-6 md:px-16 bg-white border-t border-gray-100">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] block mb-4">Visual Journey</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-widest uppercase mb-4">Galeri Keindahan Capella</h2>
                        <p className="text-sm text-gray-500 font-light tracking-wide max-w-2xl mx-auto">Menangkap pesona arsitektur artistik, interior mewah, dan momen-momen magis yang menanti Anda di setiap sudut resor kami.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group bg-gray-50/50 border border-gray-100 p-6 hover:shadow-xl transition-all">
                            <div className="overflow-hidden relative mb-6">
                                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop" className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-1000" alt="Resort View" />
                                <div className="absolute top-4 right-4 bg-orange-500 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1">Exterior</div>
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 mb-2">The Grand Sanctuary Vista</h3>
                            <p className="text-xs text-gray-500 font-light">Arsitektur mahakarya yang menyatu harmonis dengan alam sekitar.</p>
                        </div>

                        <div className="group bg-gray-50/50 border border-gray-100 p-6 hover:shadow-xl transition-all">
                            <div className="overflow-hidden relative mb-6">
                                <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop" className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-1000" alt="Bedroom Suite" />
                                <div className="absolute top-4 right-4 bg-orange-500 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1">Suite</div>
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 mb-2">Royal Penthouse Bedroom</h3>
                            <p className="text-xs text-gray-500 font-light">Kenyamanan istirahat absolut dengan detail interior berbahan sutra dan kayu jati.</p>
                        </div>

                        <div className="group bg-gray-50/50 border border-gray-100 p-6 hover:shadow-xl transition-all">
                            <div className="overflow-hidden relative mb-6">
                                <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop" className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-1000" alt="Spa Wellness" />
                                <div className="absolute top-4 right-4 bg-orange-500 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1">Wellness</div>
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 mb-2">Auriga Spa Treatment Room</h3>
                            <p className="text-xs text-gray-500 font-light">Ruang relaksasi privat yang tenang dan sarat akan kesejukan alami.</p>
                        </div>

                        <div className="group bg-gray-50/50 border border-gray-100 p-6 hover:shadow-xl transition-all">
                            <div className="overflow-hidden relative mb-6">
                                <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop" className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-1000" alt="Fine Dining" />
                                <div className="absolute top-4 right-4 bg-orange-500 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1">Dining</div>
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 mb-2">Michelin Dining Experience</h3>
                            <p className="text-xs text-gray-500 font-light">Suasana santapan romantis dengan sajian visual kuliner kelas dunia.</p>
                        </div>

                        <div className="group bg-gray-50/50 border border-gray-100 p-6 hover:shadow-xl transition-all">
                            <div className="overflow-hidden relative mb-6">
                                <img src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800&auto=format&fit=crop" className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-1000" alt="Sunset Pool" />
                                <div className="absolute top-4 right-4 bg-orange-500 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1">Leisure</div>
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 mb-2">Sunset Infinity Pool</h3>
                            <p className="text-xs text-gray-500 font-light">Momen matahari terbenam yang memukau dari kolam renang tanpa batas.</p>
                        </div>

                        <div className="group bg-gray-50/50 border border-gray-100 p-6 hover:shadow-xl transition-all">
                            <div className="overflow-hidden relative mb-6">
                                <img src="https://images.unsplash.com/photo-1562790351-d273a961e0e9?q=80&w=800&auto=format&fit=crop" className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-1000" alt="Lounge" />
                                <div className="absolute top-4 right-4 bg-orange-500 text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1">Lounge</div>
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 mb-2">The Living Room Lounge</h3>
                            <p className="text-xs text-gray-500 font-light">Kemegahan interior klasik modern untuk kehangatan bersosialisasi.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 6. GUEST REVIEWS SECTION (Hanya tampil jika ada review asli dari database member) --- */}
            {reviews.length > 0 && (
                <section id="reviews" className="py-24 px-6 md:px-16 bg-[#FFF4EA]/50 border-t border-gray-100">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] block mb-4">Testimonials</span>
                            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-widest uppercase mb-4">What Our Guests Say</h2>
                            <p className="text-sm text-gray-500 font-light tracking-wide max-w-xl mx-auto">Ulasan nyata dari member Capella Circle yang telah menikmati pengalaman menginap kelas dunia bersama kami.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {reviews.map((rev, idx) => (
                                <div key={rev.id || idx} className="bg-white border border-gray-200/80 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-1 text-orange-400 mb-6">
                                            {[...Array(rev.rating || 5)].map((_, i) => (
                                                <FaStar key={i} className="text-sm" />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-600 italic font-light leading-relaxed mb-8">"{rev.comment}"</p>
                                    </div>
                                    <div className="border-t border-gray-100 pt-5 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-900 text-orange-400 font-serif font-bold flex items-center justify-center text-sm uppercase shrink-0 shadow-sm">
                                            {rev.name ? rev.name.charAt(0) : "M"}
                                        </div>
                                        <div>
                                            <h4 className="font-serif font-bold text-gray-900 text-sm">{rev.name}</h4>
                                            <p className="text-[10px] text-gray-400 tracking-wider uppercase mt-0.5">{rev.room_title || "Capella Guest"}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* --- SECTION: REWARDS CATALOG PREVIEW --- */}
            <section id="rewards" className="py-24 px-6 md:px-16 bg-gray-50/50 border-t border-gray-100">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] block mb-4">Capella Circle Rewards</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-widest uppercase mb-4">Keistimewaan Penukaran Poin</h2>
                        <p className="text-sm text-gray-500 font-light tracking-wide max-w-2xl mx-auto">Kumpulkan poin dari setiap transaksi menginap & ulasan Anda. Tukarkan dengan berbagai keistimewaan mewah tak terlupakan di katalog member.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group flex flex-col bg-white border border-gray-100 p-8 hover:shadow-xl transition-all hover:border-orange-200 justify-between">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase bg-orange-50 px-2 py-1 rounded-sm">Stay Reward</span>
                                        <h3 className="text-xl font-serif text-gray-900 mt-4">1 Night Free Stay</h3>
                                    </div>
                                    <span className="text-xl font-serif text-gray-900">15,000 PTS</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed font-light mb-8">Nikmati menginap gratis 1 malam di tipe kamar Luxury Suite di seluruh properti Capella di seluruh dunia.</p>
                            </div>
                            <Link to={isLoggedIn ? "/rewards" : "/login"} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-orange-500 text-gray-900 hover:text-white border border-gray-200 hover:border-orange-500 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all">
                                Tukar Poin Sekarang →
                            </Link>
                        </div>

                        <div className="group flex flex-col bg-white border border-gray-100 p-8 hover:shadow-xl transition-all hover:border-orange-200 justify-between">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase bg-orange-50 px-2 py-1 rounded-sm">Wellness</span>
                                        <h3 className="text-xl font-serif text-gray-900 mt-4">Auriga Spa Package</h3>
                                    </div>
                                    <span className="text-xl font-serif text-gray-900">5,000 PTS</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed font-light mb-8">Voucher perawatan holistik eksklusif selama 120 menit untuk sepasang tamu di Auriga Spa.</p>
                            </div>
                            <Link to={isLoggedIn ? "/rewards" : "/login"} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-orange-500 text-gray-900 hover:text-white border border-gray-200 hover:border-orange-500 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all">
                                Tukar Poin Sekarang →
                            </Link>
                        </div>

                        <div className="group flex flex-col bg-white border border-gray-100 p-8 hover:shadow-xl transition-all hover:border-orange-200 justify-between">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="text-[9px] text-orange-500 font-bold tracking-[0.2em] uppercase bg-orange-50 px-2 py-1 rounded-sm">Dining</span>
                                        <h3 className="text-xl font-serif text-gray-900 mt-4">Romantic Dinner for 2</h3>
                                    </div>
                                    <span className="text-xl font-serif text-gray-900">8,500 PTS</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed font-light mb-8">Makan malam romantis 6-course degustation menu dengan wine pairing oleh sommelier kami.</p>
                            </div>
                            <Link to={isLoggedIn ? "/rewards" : "/login"} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-orange-500 text-gray-900 hover:text-white border border-gray-200 hover:border-orange-500 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all">
                                Tukar Poin Sekarang →
                            </Link>
                        </div>
                    </div>

                    <div className="mt-16 bg-white border border-gray-200 p-10 md:p-14 text-center max-w-4xl mx-auto shadow-sm hover:shadow-md transition-all">
                        <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] block mb-3">Exclusive Benefit</span>
                        <h3 className="text-2xl md:text-3xl font-serif text-gray-900 tracking-widest uppercase mb-4">Daftar Sekarang & Dapatkan Bonus 500 Poin</h3>
                        <p className="text-xs md:text-sm text-gray-500 font-light tracking-wide max-w-xl mx-auto mb-8">Bergabunglah dengan keanggotaan Capella Circle hari ini dan nikmati berbagai keuntungan instan sejak reservasi pertama Anda.</p>
                        <Link to="/register" className="inline-block bg-gray-900 hover:bg-orange-500 text-white px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all">
                            Join Capella Circle
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- 7. FAQ --- */}
            <section className="py-24 px-6 md:px-16 bg-gray-50/30 border-t border-gray-100">
                <div className="max-w-[800px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif text-gray-800 tracking-wide uppercase mb-4">Guest Support & FAQ</h2>
                        <p className="text-sm text-gray-500 font-light tracking-wide">Pusat bantuan mandiri. Temukan jawaban untuk memastikan kelancaran masa inap Anda.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="border border-gray-200 bg-white p-6 cursor-pointer" onClick={() => toggleFaq(1)}>
                            <div className="flex justify-between items-center">
                                <h4 className="font-serif text-gray-800 text-lg">Bagaimana cara menukarkan poin Capella Circle saya?</h4>
                                {openFaq === 1 ? <FaChevronUp className="text-orange-500 text-sm"/> : <FaChevronDown className="text-gray-400 text-sm"/>}
                            </div>
                            {openFaq === 1 && (
                                <p className="mt-4 text-sm text-gray-500 font-light leading-relaxed border-t border-gray-100 pt-4 animate-in slide-in-from-top-2">
                                    Poin CRM Anda dapat ditukarkan saat proses checkout di resepsionis, atau saat melakukan reservasi online melalui Dashboard Member dengan memilih opsi "Pay with Points".
                                </p>
                            )}
                        </div>

                        <div className="border border-gray-200 bg-white p-6 cursor-pointer" onClick={() => toggleFaq(2)}>
                            <div className="flex justify-between items-center">
                                <h4 className="font-serif text-gray-800 text-lg">Apakah saya bisa meminta preferensi kamar khusus (cth: bantal alergi)?</h4>
                                {openFaq === 2 ? <FaChevronUp className="text-orange-500 text-sm"/> : <FaChevronDown className="text-gray-400 text-sm"/>}
                            </div>
                            {openFaq === 2 && (
                                <p className="mt-4 text-sm text-gray-500 font-light leading-relaxed border-t border-gray-100 pt-4 animate-in slide-in-from-top-2">
                                    Tentu. Sistem CRM kami menyimpan rekam jejak (guest profile) Anda. Anda cukup memasukkan request tersebut pada kolom 'Special Requests' saat booking, dan sistem kami akan mengingatnya untuk kunjungan Anda berikutnya.
                                </p>
                            )}
                        </div>

                        <div className="border border-gray-200 bg-white p-6 cursor-pointer" onClick={() => toggleFaq(3)}>
                            <div className="flex justify-between items-center">
                                <h4 className="font-serif text-gray-800 text-lg">Apa kebijakan pembatalan reservasi hotel ini?</h4>
                                {openFaq === 3 ? <FaChevronUp className="text-orange-500 text-sm"/> : <FaChevronDown className="text-gray-400 text-sm"/>}
                            </div>
                            {openFaq === 3 && (
                                <p className="mt-4 text-sm text-gray-500 font-light leading-relaxed border-t border-gray-100 pt-4 animate-in slide-in-from-top-2">
                                    Pembatalan gratis dapat dilakukan maksimal 48 jam sebelum tanggal check-in untuk tipe harga Flexible. Untuk harga Promo Member, silakan merujuk pada syarat dan ketentuan spesifik penawaran.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 8. FOOTER --- */}
            <footer className="bg-white border-t border-gray-200 pt-20 pb-10 px-6 md:px-16 text-center md:text-left">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start gap-16 mb-16">
                    
                    {/* Brand Info */}
                    <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
                        <FaStar className="text-orange-500 text-xl mb-3" />
                        <h2 className="text-2xl font-serif tracking-[0.2em] uppercase text-gray-900 mb-2">Capella</h2>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-6">Hotels and Resorts</p>
                        <p className="text-xs text-gray-500 font-light leading-relaxed text-center md:text-left">
                            Menciptakan hubungan abadi melalui layanan pelanggan (CRM) yang luar biasa dan personalisasi tingkat tinggi.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="w-full md:w-1/3 flex flex-wrap justify-center md:justify-start gap-12 text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                        <div className="flex flex-col gap-4">
                            <a href="#" className="hover:text-orange-500 transition-colors">Our Story</a>
                            <a href="#offers" className="hover:text-orange-500 transition-colors">Offers</a>
                            <a href="#boutique" className="hover:text-orange-500 transition-colors">Boutique</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Link to="/login" className="hover:text-orange-500 transition-colors">Member Login</Link>
                            <Link to="/register" className="hover:text-orange-500 transition-colors">Join Circle</Link>
                            <Link to="/login" className="hover:text-orange-500 transition-colors">Staff Portal</Link>
                        </div>
                    </div>

                    {/* Lead Capture Form */}
                    <div className="w-full md:w-1/3">
                        <h4 className="text-[11px] font-bold tracking-[0.2em] text-gray-900 uppercase mb-4 text-center md:text-left">Stay Inspired</h4>
                        <p className="text-xs text-gray-500 font-light mb-4 text-center md:text-left">Daftarkan email Anda untuk menerima penawaran eksklusif dan pembaruan dari sistem CRM kami.</p>
                        <div className="flex border-b border-gray-300 pb-2">
                            <FaEnvelope className="text-gray-400 mt-1 mr-3" />
                            <input type="email" placeholder="Email Address" className="bg-transparent outline-none w-full text-gray-800 text-sm font-serif placeholder-gray-400" />
                            <button className="text-orange-500 font-bold uppercase text-[10px] tracking-widest hover:text-gray-900 transition-colors">Subscribe</button>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 tracking-wider">
                    <p>&copy; 2026 Capella Hotel Group. PFL & CRM Project.</p>
                    <div className="flex gap-4 mt-4 md:mt-0 uppercase">
                        <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                        <span>|</span>
                        <a href="#" className="hover:text-gray-900">Terms of Use</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}
