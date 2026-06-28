import { useState, useRef, useEffect } from "react"; 
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabase"; // Import Supabase
import { FaTrash, FaStar, FaCommentDots } from "react-icons/fa"; // Import ikon hapus & star

export default function Guests() {
    const [showForm, setShowForm] = useState(false);
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // STATE UNTUK SUPABASE
    const [guestsData, setGuestsData] = useState([]); // Menyimpan data dari database
    const [reviewsData, setReviewsData] = useState([]);
    const [loading, setLoading] = useState(true);

    // STATE UNTUK FORM INPUT (Menangkap ketikan user)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        visits: "",
        loyalty: "Bronze"
    });

    // --- TUGAS PFL: Implementasi useRef ---
    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        // Membajak klik dan mengarahkannya ke input file yang tersembunyi
        fileInputRef.current.click();
    };
    // -------------------------------------

    // ==========================================
    // 1. FUNGSI READ (Mengambil data dari Supabase)
    // ==========================================
    const fetchGuests = async () => {
        if (!isLoggedIn) return;
        setLoading(true);
        try {
            // Mengambil data dari tabel 'guest'
            const { data, error } = await supabase
                .from('guest')
                .select('*')
                .order('id', { ascending: false }); // Urutkan dari yang paling baru

            if (error) throw error;
            setGuestsData(data || []);
        } catch (error) {
            console.error("Error fetching guests:", error.message);
        } finally {
            setLoading(false);
        }

        try {
            const { data: revs } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
            setReviewsData(revs || []);
        } catch (e) {
            console.error("Error fetching reviews:", e);
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm("Hapus ulasan member ini?")) return;
        try {
            await supabase.from('reviews').delete().eq('id', id);
            fetchGuests();
        } catch (e) {
            alert("Error: " + e.message);
        }
    };

    // Otomatis mengambil data saat halaman dibuka
    useEffect(() => {
        fetchGuests();
    }, [isLoggedIn]);

    // ==========================================
    // 2. FUNGSI CREATE (Menambah data ke Supabase)
    // ==========================================
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddGuest = async () => {
        // Validasi simpel
        if (!formData.name || !formData.email) {
            alert("Nama dan Email wajib diisi!");
            return;
        }

        try {
            // Membuat Guest ID otomatis
            const newGuestId = `GST-00${Math.floor(Math.random() * 100) + 1}`;

            const { error } = await supabase
                .from('guest')
                .insert([
                    { 
                        guest_id: newGuestId,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone || "-",
                        visits: parseInt(formData.visits) || 0,
                        loyalty: formData.loyalty
                    }
                ]);

            if (error) throw error;

            alert("Guest berhasil ditambahkan!");
            setShowForm(false); // Tutup modal
            setFormData({ name: "", email: "", phone: "", visits: "", loyalty: "Bronze" }); // Reset form
            fetchGuests(); // Refresh data di tabel

        } catch (error) {
            alert("Gagal menambahkan guest: " + error.message);
        }
    };

    // ==========================================
    // 3. FUNGSI DELETE (Menghapus data dari Supabase)
    // ==========================================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Yakin ingin menghapus tamu ini?");
        if (!confirmDelete) return;

        try {
            const { error } = await supabase
                .from('guest')
                .delete()
                .eq('id', id); // Hapus berdasarkan ID tabel

            if (error) throw error;
            fetchGuests(); // Refresh data setelah dihapus
        } catch (error) {
            alert("Gagal menghapus: " + error.message);
        }
    };

    return (
        <div id="dashboard-container" className="p-2 md:p-4 lg:p-6 font-poppins overflow-x-hidden w-full">
            <div className="max-w-[1440px] mx-auto w-full">
                <PageHeader title="Guests" breadcrumb="Guest Directory">
                    {isLoggedIn && (
                        <button 
                            onClick={() => setShowForm(true)}
                            className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-[0_10px_20px_rgba(249,115,22,0.3)] active:scale-95"
                        >
                            + Add Guest
                        </button>
                    )}
                </PageHeader>

                <div className="mt-8 bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden w-full">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="bg-orange-50/50">
                                    <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">ID</th>
                                    <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">Guest Profile</th>
                                    <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">Contact</th>
                                    <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest text-center">Kunjungan (SCM)</th>
                                    <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest text-center">Loyalty Tier</th>
                                    <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {!isLoggedIn ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-10 text-gray-400 font-semibold">
                                            Please login to view data
                                        </td>
                                    </tr>
                                ) : loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-10 text-gray-400 font-semibold">
                                            Mengambil data dari Supabase...
                                        </td>
                                    </tr>
                                ) : guestsData.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-10 text-gray-400 font-semibold">
                                            Belum ada data tamu. Silakan klik + Add Guest.
                                        </td>
                                    </tr>
                                ) : (
                                    guestsData.map((guest) => (
                                        <tr key={guest.id} className="hover:bg-orange-50/30 transition-colors group">
                                            <td className="p-6 font-bold text-gray-400 group-hover:text-orange-500">{guest.guest_id}</td>
                                            <td className="p-6">
                                                <div className="font-extrabold text-gray-800">{guest.name}</div>
                                                <div className="text-xs text-gray-400 mt-1">{guest.email}</div>
                                            </td>
                                            <td className="p-6 text-sm text-gray-500 font-medium">{guest.phone}</td>
                                            
                                            <td className="p-6 text-center font-bold text-gray-700 bg-orange-50/20">{guest.visits}x</td>
                                            
                                            <td className="p-6 text-center">
                                                <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                                    guest.loyalty === 'Gold' ? 'bg-yellow-400 text-white shadow-yellow-200' : 
                                                    guest.loyalty === 'Silver' ? 'bg-gray-300 text-gray-700 shadow-gray-200' : 'bg-orange-300 text-white shadow-orange-200'
                                                }`}>
                                                    {guest.loyalty}
                                                </span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <button onClick={() => handleDelete(guest.id)} className="text-rose-400 hover:text-rose-600 p-2 bg-rose-50 rounded-lg transition-colors">
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- SECTION ADMIN: REVIEW & FEEDBACK DATABASE --- */}
                <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 mt-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 text-xl shadow-sm">
                            <FaCommentDots />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">Member Reviews & Feedback</h3>
                            <p className="text-sm text-gray-400">Daftar ulasan yang dikirimkan member melalui Member Portal (Ditampilkan di Landing Page)</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400 bg-gray-50/50">
                                    <th className="p-4 font-extrabold rounded-l-2xl">Member Name</th>
                                    <th className="p-4 font-extrabold">Room / Stay</th>
                                    <th className="p-4 font-extrabold text-center">Rating</th>
                                    <th className="p-4 font-extrabold">Comment / Ulasan</th>
                                    <th className="p-4 font-extrabold text-center rounded-r-2xl">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {reviewsData.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-gray-400 font-medium italic">Belum ada ulasan masuk dari database.</td>
                                    </tr>
                                ) : (
                                    reviewsData.map((rev) => (
                                        <tr key={rev.id} className="hover:bg-orange-50/20 transition-colors">
                                            <td className="p-4 font-bold text-gray-800">{rev.name || "Member"}</td>
                                            <td className="p-4 text-gray-500 text-xs font-semibold">{rev.room_title || "Luxury Suite"}</td>
                                            <td className="p-4 text-center">
                                                <div className="inline-flex items-center gap-1 text-orange-400 font-bold bg-orange-50 px-3 py-1 rounded-full text-xs">
                                                    <FaStar /> {rev.rating || 5}
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600 italic max-w-md">"{rev.comment}"</td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => handleDeleteReview(rev.id)} className="text-rose-400 hover:text-rose-600 p-2 bg-rose-50 rounded-lg transition-colors" title="Hapus Ulasan">
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-2xl animate-in zoom-in duration-200">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">New Guest Entry</h2>
                            <div className="space-y-4">
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="Full Name" />
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="Email Address" />
                                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="Phone Number (+62...)" />
                                
                                {/* INPUT TAMBAHAN UNTUK SCM */}
                                <input type="number" name="visits" value={formData.visits} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="Total Kunjungan Awal" />
                                
                                <select name="loyalty" value={formData.loyalty} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 text-gray-500">
                                    <option value="Gold">Gold</option>
                                    <option value="Silver">Silver</option>
                                    <option value="Bronze">Bronze</option>
                                </select>

                                {/* --- TUGAS PFL: Elemen Tombol useRef --- */}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/png, image/jpeg, application/pdf" 
                                />
                                <button 
                                    onClick={handleUploadClick}
                                    className="w-full p-4 bg-orange-50 border border-orange-200 text-orange-600 rounded-2xl font-semibold hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    📁 Upload KTP / Bukti Identitas
                                </button>
                                {/* -------------------------------------- */}

                            </div>
                            <div className="flex gap-4 mt-8">
                                <button onClick={() => setShowForm(false)} className="flex-1 font-bold text-gray-400 hover:bg-gray-50 rounded-2xl">Cancel</button>
                                <button onClick={handleAddGuest} className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600">Save Guest</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}