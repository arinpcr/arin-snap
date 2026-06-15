import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaChevronDown, FaChevronUp, FaEnvelope, FaShoppingCart, FaQuoteLeft } from "react-icons/fa";

export default function LandingPage() {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const testimonials = [
        {
            name: "Amelia Richardson",
            origin: "London, UK",
            tier: "Platinum Member",
            rating: 5,
            comment: "Dari momen pertama check-in hingga checkout, setiap detail diperhatikan. Tim Capella bahkan mengingat preferensi bantal saya dari kunjungan sebelumnya — benar-benar personalisasi yang luar biasa.",
        },
        {
            name: "Hiroshi Tanaka",
            origin: "Tokyo, Japan",
            tier: "Gold Member",
            rating: 5,
            comment: "Pengalaman menginap di Capella adalah definisi kemewahan sejati. Fasilitas Boutique add-on yang saya pesan sudah tersedia rapi di kamar sebelum saya tiba. Tidak ada hotel lain yang mampu menandingi standar ini.",
        },
        {
            name: "Sofia Andersen",
            origin: "Copenhagen, Denmark",
            tier: "Silver Member",
            rating: 5,
            comment: "Capella Circle membership benar-benar memberikan nilai yang sepadan. Complimentary upgrade kamar dan layanan concierge 24 jam membuat liburan keluarga kami menjadi momen tak terlupakan.",
        },
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans scroll-smooth">
            
            {/* --- 1. NAVBAR --- */}
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300 hover:bg-white">
                <div className="hidden md:flex gap-10 text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                    <a href="#offers" className="hover:text-orange-500 transition-colors">Exclusive Offers</a>
                    <a href="#boutique" className="hover:text-orange-500 transition-colors">Boutique</a>
                    <a href="#loyalty" className="hover:text-orange-500 transition-colors">Capella Circle</a>
                </div>

                <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2 cursor-pointer">
                    <FaStar className="text-orange-500 text-lg mb-1" />
                    <h1 className="text-xl md:text-2xl font-serif tracking-[0.2em] uppercase text-gray-900">Capella</h1>
                </div>

                <div className="flex items-center gap-6 ml-auto">
                    <Link to="/login" className="text-[11px] font-bold tracking-[0.2em] text-gray-400 hover:text-orange-500 transition-colors hidden md:block uppercase">
                        Staff Login
                    </Link>
                    <a href="#book" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-all">
                        Book Your Stay
                    </a>
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
                    
                    <p className="text-lg md:text-2xl font-serif tracking-wide mt-12 md:mt-24 drop-shadow-md">Discover Your Bespoke Journey</p>
                </div>

                <div id="book" className="absolute bottom-10 md:bottom-20 w-full max-w-[1000px] px-6 z-30">
                    <div className="bg-white p-4 md:p-6 flex flex-col md:flex-row gap-4 items-end shadow-2xl border-t-4 border-orange-500">
                        <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
                            <label className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase block mb-2">Check In</label>
                            <input type="date" className="w-full outline-none text-gray-800 text-sm font-serif" />
                        </div>
                        <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4 md:pl-4">
                            <label className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase block mb-2">Check Out</label>
                            <input type="date" className="w-full outline-none text-gray-800 text-sm font-serif" />
                        </div>
                        <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4 md:pl-4">
                            <label className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase block mb-2">Promo Code</label>
                            <input type="text" placeholder="e.g. CAPELLA2026" className="w-full outline-none text-gray-800 text-sm font-serif placeholder-gray-300 uppercase" />
                        </div>
                        <div className="md:pl-4 w-full md:w-auto">
                            <button className="w-full bg-gray-900 hover:bg-orange-500 text-white px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all">
                                Check Rates
                            </button>
                        </div>
                    </div>
                </div>
            </header>

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

            {/* --- 6. FAQ --- */}
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

            {/* --- 7. GUEST TESTIMONIALS --- */}
            <section className="py-24 px-6 md:px-16 bg-white border-t border-gray-100">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] block mb-4">Guest Voices</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-widest uppercase mb-4">What Our Guests Say</h2>
                        <p className="text-sm text-gray-500 font-light tracking-wide">Cerita nyata dari tamu setia Capella di seluruh dunia.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, index) => (
                            <div key={index} className="flex flex-col bg-gray-50/50 border border-gray-100 p-8 hover:shadow-xl transition-all hover:border-orange-100">
                                {/* Quote Icon */}
                                <FaQuoteLeft className="text-orange-200 text-3xl mb-6" />

                                {/* Stars */}
                                <div className="flex gap-1 mb-5">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <FaStar key={i} className="text-orange-400 text-xs" />
                                    ))}
                                </div>

                                {/* Comment */}
                                <p className="text-sm text-gray-500 font-light leading-relaxed flex-1 mb-8 font-serif italic">
                                    "{t.comment}"
                                </p>

                                {/* Divider */}
                                <div className="border-t border-gray-200 pt-6 flex items-center justify-between">
                                    <div>
                                        <p className="font-serif text-gray-900 text-base">{t.name}</p>
                                        <p className="text-[10px] text-gray-400 tracking-[0.15em] uppercase mt-1">{t.origin}</p>
                                    </div>
                                    <span className="text-[9px] text-orange-500 font-bold tracking-[0.15em] uppercase bg-orange-50 px-3 py-1 rounded-sm">
                                        {t.tier}
                                    </span>
                                </div>
                            </div>
                        ))}
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
