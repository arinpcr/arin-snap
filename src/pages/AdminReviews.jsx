import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabase";
import { FaTrash, FaStar, FaCommentDots, FaPlus, FaSearch } from "react-icons/fa";

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newReview, setNewReview] = useState({
        name: "",
        room_title: "Oceanview Pool Villa",
        rating: 5,
        comment: ""
    });

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setReviews(data || []);
        } catch (err) {
            console.error("Error fetching reviews:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) return;
        try {
            const { error } = await supabase.from('reviews').delete().eq('id', id);
            if (error) throw error;
            fetchReviews();
        } catch (err) {
            alert("Gagal menghapus: " + err.message);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!newReview.name || !newReview.comment) {
            alert("Nama dan ulasan wajib diisi!");
            return;
        }
        try {
            const { error } = await supabase.from('reviews').insert([{
                name: newReview.name,
                room_title: newReview.room_title,
                rating: parseInt(newReview.rating),
                comment: newReview.comment,
                created_at: new Date().toISOString()
            }]);
            if (error) throw error;
            alert("Ulasan berhasil ditambahkan!");
            setShowAddModal(false);
            setNewReview({ name: "", room_title: "Oceanview Pool Villa", rating: 5, comment: "" });
            fetchReviews();
        } catch (err) {
            alert("Gagal menambah ulasan: " + err.message);
        }
    };

    const filteredReviews = reviews.filter(r => 
        (r.name && r.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.room_title && r.room_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.comment && r.comment.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 
        ? (reviews.reduce((acc, curr) => acc + (curr.rating || 5), 0) / totalReviews).toFixed(1)
        : "5.0";

    return (
        <div className="min-h-screen bg-[#FFF4EA] p-6 md:p-10 font-sans">
            <div className="max-w-[1400px] mx-auto">
                <PageHeader title="Guest Reviews" breadcrumb="Feedback & Testimonials Management" />

                {/* SUMMARY STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center text-2xl font-bold">
                            <FaCommentDots />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Reviews</p>
                            <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{totalReviews}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-yellow-50 text-yellow-500 flex items-center justify-center text-2xl font-bold">
                            <FaStar />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Average Rating</p>
                            <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{avgRating} <span className="text-sm font-normal text-gray-400">/ 5.0</span></h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Landing Page Sync</p>
                            <p className="text-sm font-semibold text-emerald-600 mt-1 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active & Live
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-md shadow-orange-200 flex items-center gap-2"
                        >
                            <FaPlus /> Add Testimonial
                        </button>
                    </div>
                </div>

                {/* FILTER & SEARCH */}
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Cari nama member, kamar, atau komentar..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-colors"
                        />
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                        Menampilkan <strong className="text-gray-700">{filteredReviews.length}</strong> ulasan dari database
                    </div>
                </div>

                {/* TABLE REVIEWS */}
                <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400 bg-gray-50/50">
                                    <th className="p-4 font-extrabold rounded-l-2xl">Member Name</th>
                                    <th className="p-4 font-extrabold">Stay / Room</th>
                                    <th className="p-4 font-extrabold text-center">Rating</th>
                                    <th className="p-4 font-extrabold">Comment / Ulasan</th>
                                    <th className="p-4 font-extrabold">Date</th>
                                    <th className="p-4 font-extrabold text-center rounded-r-2xl">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12 text-gray-400 font-medium">Memuat data ulasan dari database...</td>
                                    </tr>
                                ) : filteredReviews.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12 text-gray-400 font-medium italic">Belum ada ulasan yang sesuai.</td>
                                    </tr>
                                ) : (
                                    filteredReviews.map((rev) => (
                                        <tr key={rev.id} className="hover:bg-orange-50/20 transition-colors group">
                                            <td className="p-4 font-bold text-gray-800">{rev.name || "Member"}</td>
                                            <td className="p-4 text-gray-500 text-xs font-semibold">{rev.room_title || "Luxury Suite"}</td>
                                            <td className="p-4 text-center">
                                                <div className="inline-flex items-center gap-1 text-orange-400 font-bold bg-orange-50 px-3 py-1 rounded-full text-xs">
                                                    <FaStar /> {rev.rating || 5}
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600 italic max-w-md">"{rev.comment}"</td>
                                            <td className="p-4 text-xs text-gray-400">
                                                {rev.created_at ? new Date(rev.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => handleDelete(rev.id)} className="text-rose-400 hover:text-rose-600 p-2 bg-rose-50 rounded-lg transition-colors" title="Hapus Ulasan">
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

                {/* MODAL ADD TESTIMONIAL */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Add Testimonial</h3>
                            <form onSubmit={handleAddSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Nama Pelanggan</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newReview.name} 
                                        onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                                        placeholder="Contoh: Eleanor Vance"
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Tipe Kamar / Layanan</label>
                                    <input 
                                        type="text" 
                                        value={newReview.room_title} 
                                        onChange={(e) => setNewReview({...newReview, room_title: e.target.value})}
                                        placeholder="Contoh: Oceanview Pool Villa"
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Rating</label>
                                    <select 
                                        value={newReview.rating} 
                                        onChange={(e) => setNewReview({...newReview, rating: e.target.value})}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                                    >
                                        <option value="5">⭐⭐⭐⭐⭐ (5 Bintang)</option>
                                        <option value="4">⭐⭐⭐⭐ (4 Bintang)</option>
                                        <option value="3">⭐⭐⭐ (3 Bintang)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Komentar Ulasan</label>
                                    <textarea 
                                        required
                                        rows="3"
                                        value={newReview.comment} 
                                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                        placeholder="Tulis testimoni pelanggan..."
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                                    ></textarea>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-3 text-sm font-bold text-gray-400 hover:bg-gray-50 rounded-xl transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow-md transition-all"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
