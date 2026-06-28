import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { FaStar, FaCrown, FaGift, FaAward, FaTicketAlt, FaArrowLeft, FaCheckCircle, FaHistory, FaSignOutAlt, FaTimes } from "react-icons/fa";

export default function Rewards() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [points, setPoints] = useState(0);
    const [tierInfo, setTierInfo] = useState({ tier: "GOLD", discount: 15 });
    const [redemptions, setRedemptions] = useState([]);
    const [claimedVouchers, setClaimedVouchers] = useState([]);
    const [toastMessage, setToastMessage] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);

    const catalogItems = [
        { id: 1, name: "Afternoon Tea Exclusive Lounge", cost: 1500, category: "Dining", desc: "Teh premium & kudapan artisan eksklusif untuk 2 orang di Capella Lounge dengan pemandangan matahari terbenam." },
        { id: 2, name: "Voucher Spa Aura Retreat", cost: 2500, category: "Wellness", desc: "Sesi pijat aromaterapi relaksasi 60 menit untuk 2 orang di terapis holistik terbaik kami." },
        { id: 3, name: "Makan Malam Romantis VIP", cost: 5000, category: "Dining", desc: "Sesi private dining romantis dengan menu 5-course chef curated dan sebotol anggur pilihan." },
        { id: 4, name: "Airport Transfer Luxury Limousine", cost: 7500, category: "Privilege", desc: "Layanan antar-jemput pribadi dari bandara langsung ke resor menggunakan armada mewah Capella." },
        { id: 5, name: "Upgrade Kamar ke Penthouse", cost: 10000, category: "Stay", desc: "Upgrade gratis ke kamar kategori suite tertinggi / Penthouse saat proses Check-In." },
        { id: 6, name: "Menginap Gratis 1 Malam", cost: 15000, category: "Stay", desc: "Voucher menginap 1 malam gratis di seluruh properti Capella di seluruh dunia." }
    ];

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3500);
    };

    const calculateTier = (pts) => {
        if (pts >= 25000) return { tier: "PLATINUM", discount: 20 };
        if (pts >= 10000) return { tier: "GOLD", discount: 15 };
        if (pts >= 2500) return { tier: "SILVER", discount: 10 };
        return { tier: "BRONZE", discount: 5 };
    };

    const fetchData = async (currentUser) => {
        try {
            // Fetch Points
            const { data: ptsData } = await supabase
                .from('member_points')
                .select('*')
                .eq('user_id', currentUser.id)
                .single();

            if (ptsData) {
                setPoints(ptsData.points);
                setTierInfo(calculateTier(ptsData.points));
            } else {
                setPoints(12500);
                setTierInfo(calculateTier(12500));
            }

            // Fetch Redemptions
            const { data: rdmData } = await supabase
                .from('redemptions')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false });

            if (rdmData) {
                setRedemptions(rdmData);
                setClaimedVouchers(rdmData.map(r => r.reward_name));
            }
        } catch (e) {
            console.error("Error fetching rewards data:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) {
                navigate("/login");
                return;
            }
            setUser(currentUser);
            await fetchData(currentUser);
        };
        initAuth();
    }, [navigate]);

    const handleOpenConfirm = (item) => {
        if (points < item.cost) {
            showToast(`⚠️ Poin Anda tidak cukup! Anda memiliki ${points.toLocaleString()} PTS, dibutuhkan ${item.cost.toLocaleString()} PTS.`);
            return;
        }
        setSelectedReward(item);
        setShowConfirmModal(true);
    };

    const executeRedeem = async () => {
        if (!selectedReward || !user) return;
        const item = selectedReward;
        setShowConfirmModal(false);

        const newPts = points - item.cost;
        const newTier = calculateTier(newPts);
        const rdmId = `RDM-${Math.floor(Math.random() * 8999) + 1000}`;
        const fullName = user.user_metadata?.full_name || localStorage.getItem("registeredName") || (user.email ? user.email.split('@')[0] : "Capella Member");

        try {
            // 1. Kurangi Poin di member_points
            await supabase.from('member_points').upsert({
                user_id: user.id,
                points: newPts,
                tier: newTier.tier
            }, { onConflict: 'user_id' });

            // 2. Simpan Riwayat Penukaran ke database redemptions
            const { data: newRdm, error: rdmErr } = await supabase.from('redemptions').insert([{
                redemption_id: rdmId,
                user_id: user.id,
                name: fullName,
                reward_name: item.name,
                cost: item.cost,
                status: 'Success',
                created_at: new Date().toISOString()
            }]).select().single();

            if (rdmErr) throw rdmErr;

            setPoints(newPts);
            setTierInfo(newTier);
            setClaimedVouchers(prev => [...prev, item.name]);
            if (newRdm) {
                setRedemptions(prev => [newRdm, ...prev]);
            } else {
                await fetchData(user);
            }
            showToast(`🎉 Berhasil menukarkan ${item.name}! (-${item.cost.toLocaleString()} PTS)`);
        } catch (err) {
            showToast("❌ Gagal menukarkan poin: " + (err.message || "Pastikan tabel redemptions sudah ada di database."));
        }
    };

    const handleLogout = async () => {
        if (!window.confirm("Apakah Anda yakin ingin keluar?")) return;
        await supabase.auth.signOut();
        localStorage.clear();
        window.location.href = "/";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF4EA] flex items-center justify-center font-serif text-xl text-gray-800">
                Memuat Katalog Rewards...
            </div>
        );
    }

    const fullName = user?.user_metadata?.full_name || localStorage.getItem("registeredName") || (user?.email ? user.email.split('@')[0] : "Member");

    return (
        <div className="min-h-screen bg-[#FFF4EA] text-gray-800 font-poppins selection:bg-orange-500 selection:text-white pb-20 relative">
            
            {/* Toast Notification */}
            <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
                <div className="bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl border border-orange-500/50 flex items-center gap-3 text-sm font-medium">
                    <span>{toastMessage}</span>
                </div>
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/60 py-4 px-6 md:px-12 flex justify-between items-center shadow-xs">
                <button 
                    onClick={() => navigate("/member-portal")}
                    className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-gray-600 hover:text-orange-600 uppercase transition-colors cursor-pointer"
                >
                    <FaArrowLeft /> Kembali ke Portal
                </button>

                <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate("/")}>
                    <FaStar className="text-orange-500 text-lg mb-1" />
                    <h1 className="text-xl font-serif tracking-[0.2em] uppercase text-gray-900">Capella Rewards</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-3 bg-orange-50 border border-orange-200 px-4 py-2 rounded-xl">
                        <FaCrown className="text-orange-500 text-sm" />
                        <span className="text-xs font-bold text-gray-800">{points.toLocaleString()} <span className="text-[10px] text-orange-600">PTS</span></span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="bg-gray-900 hover:bg-orange-600 text-white p-3 md:px-5 md:py-2.5 text-[11px] font-bold tracking-[0.15em] uppercase transition-all flex items-center gap-2 rounded-xl cursor-pointer"
                    >
                        <span className="hidden md:inline">Sign Out</span> <FaSignOutAlt />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative bg-gray-900 text-white py-20 px-6 overflow-hidden min-h-[380px] flex items-center">
                <img 
                    src="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=2000" 
                    alt="Capella Rewards Lounge" 
                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900/80 to-black/40 z-10"></div>
                <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 opacity-15 pointer-events-none z-10">
                    <FaGift className="text-[400px] text-orange-500" />
                </div>
                <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <span className="bg-orange-500 text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full inline-block mb-4">
                            Privilege Program
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif tracking-wide mb-4">Katalog Penukaran Poin</h2>
                        <p className="text-sm text-gray-400 font-light max-w-xl leading-relaxed">
                            Nikmati hasil dari kesetiaan Anda. Tukarkan saldo poin Anda dengan fasilitas VIP, makan malam romantis, sesi relaksasi spa, hingga gratis menginap di suite termewah kami.
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl w-full md:w-auto min-w-[280px] text-center">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-gray-300 block mb-1">Saldo Poin Saat Ini</span>
                        <div className="text-4xl font-serif font-bold text-orange-400 mb-2">
                            {points.toLocaleString()} <span className="text-sm font-normal text-white">PTS</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs text-white">
                            <FaCrown className="text-orange-300" /> Tier {tierInfo.tier} ({tierInfo.discount}% Diskon Kamar)
                        </div>
                    </div>
                </div>
            </header>

            {/* Catalog Section */}
            <main className="max-w-6xl mx-auto px-6 mt-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-serif text-gray-900">Daftar Rewards Tersedia</h3>
                        <p className="text-xs text-gray-500 mt-1">Pilih hadiah eksklusif yang ingin Anda klaim</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {catalogItems.map((item) => {
                        const isClaimed = claimedVouchers.includes(item.name);
                        const canAfford = points >= item.cost;
                        return (
                            <div key={item.id} className={`bg-white border rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${isClaimed ? 'border-emerald-300 bg-emerald-50/30' : 'border-gray-200 hover:border-orange-400 hover:shadow-xl'}`}>
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">
                                            {item.category}
                                        </span>
                                        <FaAward className={`text-2xl ${isClaimed ? 'text-emerald-500' : 'text-orange-400'}`} />
                                    </div>
                                    <h4 className="font-serif text-xl text-gray-900 mb-3">{item.name}</h4>
                                    <p className="text-xs text-gray-500 font-light leading-relaxed mb-6">{item.desc}</p>
                                </div>

                                <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] text-gray-400 uppercase block">Harga Tukar</span>
                                        <span className="text-lg font-serif font-bold text-orange-600">{item.cost.toLocaleString()} PTS</span>
                                    </div>
                                    <button 
                                        onClick={() => !isClaimed && handleOpenConfirm(item)}
                                        disabled={isClaimed}
                                        className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.1em] transition-all flex items-center gap-2 ${
                                            isClaimed 
                                            ? 'bg-emerald-600 text-white cursor-not-allowed shadow-sm' 
                                            : canAfford 
                                            ? 'bg-gray-900 hover:bg-orange-500 text-white cursor-pointer shadow-md' 
                                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300 cursor-pointer'
                                        }`}
                                    >
                                        {isClaimed ? <>Klaim ✓</> : <>Tukarkan</>}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Redemption History Table */}
                <div className="mt-16 bg-white border border-gray-200/80 rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <FaHistory className="text-orange-500 text-2xl" />
                        <div>
                            <h3 className="text-xl font-serif text-gray-900">Riwayat Penukaran Poin (Redemptions)</h3>
                            <p className="text-xs text-gray-500">Daftar reward yang telah berhasil Anda tukarkan</p>
                        </div>
                    </div>

                    {redemptions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 text-[11px] font-bold tracking-[0.15em] text-gray-400 uppercase">
                                        <th className="py-4 px-4">ID Penukaran</th>
                                        <th className="py-4 px-4">Nama Reward</th>
                                        <th className="py-4 px-4">Poin Dipotong</th>
                                        <th className="py-4 px-4">Tanggal</th>
                                        <th className="py-4 px-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {redemptions.map((rdm, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 font-mono font-medium text-gray-600">{rdm.redemption_id || `#RDM-${idx+100}`}</td>
                                            <td className="py-4 px-4 font-serif font-bold text-gray-900">{rdm.reward_name}</td>
                                            <td className="py-4 px-4 font-bold text-red-500">-{rdm.cost?.toLocaleString() || 0} PTS</td>
                                            <td className="py-4 px-4 text-xs text-gray-500">
                                                {rdm.created_at ? new Date(rdm.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Baru saja"}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                    <FaCheckCircle className="text-emerald-600 text-xs" /> Berhasil
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <FaTicketAlt className="text-4xl text-gray-300 mx-auto mb-3" />
                            <p className="text-sm font-medium text-gray-600">Belum ada riwayat penukaran poin.</p>
                            <p className="text-xs text-gray-400 mt-1">Pilih reward di atas untuk mulai menikmati fasilitas eksklusif Anda.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Confirmation Modal */}
            {showConfirmModal && selectedReward && (
                <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 relative text-center">
                        <button onClick={() => setShowConfirmModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 text-xl cursor-pointer">
                            <FaTimes />
                        </button>
                        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-5">
                            <FaAward />
                        </div>
                        <h3 className="text-2xl font-serif text-gray-900 mb-2">Konfirmasi Penukaran</h3>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                            Apakah Anda yakin ingin menukarkan <span className="font-bold text-gray-800">{selectedReward.name}</span> seharga <span className="font-bold text-orange-600">{selectedReward.cost.toLocaleString()} PTS</span>?
                        </p>
                        <div className="bg-gray-50 p-4 rounded-2xl text-xs text-left mb-6 space-y-2 border border-gray-200/60">
                            <div className="flex justify-between"><span>Saldo Poin Saat Ini:</span> <span className="font-bold">{points.toLocaleString()} PTS</span></div>
                            <div className="flex justify-between text-red-600"><span>Dipotong:</span> <span className="font-bold">-{selectedReward.cost.toLocaleString()} PTS</span></div>
                            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900"><span>Sisa Poin Anda:</span> <span>{(points - selectedReward.cost).toLocaleString()} PTS</span></div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                                Batal
                            </button>
                            <button onClick={executeRedeem} className="flex-1 py-3 bg-gray-900 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer">
                                Ya, Tukarkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
