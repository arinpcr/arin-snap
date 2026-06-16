import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabase";
import { FaTrash } from "react-icons/fa"; // Icon hapus

export default function Inventory() {
    const [showForm, setShowForm] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // State form input
    const [formData, setFormData] = useState({
        title: "",
        category: "Amenities",
        stock: "",
        price: ""
    });

    // 1. READ: Fetch dari Supabase
    const fetchInventory = async () => {
        if (!isLoggedIn) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inventory')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error("Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, [isLoggedIn]);

    // 2. CREATE: Tambah ke Supabase
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddItem = async () => {
        if (!formData.title || !formData.stock || !formData.price) {
            alert("Harap isi semua data!");
            return;
        }

        try {
            const newItemCode = `CP-${Math.floor(Math.random() * 9000) + 1000}`; // Generate Code otomatis
            const defaultThumbnail = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=200&auto=format&fit=crop";

            const { error } = await supabase
                .from('inventory')
                .insert([
                    { 
                        code: newItemCode,
                        title: formData.title,
                        category: formData.category,
                        stock: parseInt(formData.stock),
                        price: parseInt(formData.price),
                        brand: "Capella Exclusive",
                        thumbnail: defaultThumbnail
                    }
                ]);

            if (error) throw error;

            alert("Item berhasil ditambahkan!");
            setShowForm(false);
            setFormData({ title: "", category: "Amenities", stock: "", price: "" }); // Reset
            fetchInventory(); // Refresh
        } catch (error) {
            alert("Gagal menambah: " + error.message);
        }
    };

    // 3. DELETE: Hapus Item
    const handleDelete = async (id) => {
        if (!window.confirm("Yakin hapus barang ini?")) return;
        try {
            const { error } = await supabase.from('inventory').delete().eq('id', id);
            if (error) throw error;
            fetchInventory();
        } catch (error) {
            alert("Gagal menghapus: " + error.message);
        }
    };

    return (
        <div id="dashboard-container" className="p-2 font-poppins">
            <PageHeader title="Inventory" breadcrumb="Stock & Amenities">
                {isLoggedIn && (
                    <button 
                        onClick={() => setShowForm(true)} 
                        className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-[0_10px_20px_rgba(249,115,22,0.3)]"
                    >
                        + Add Item
                    </button>
                )}
            </PageHeader>

            <div className="mt-8 bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="bg-orange-50/50">
                                <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">Item Code</th>
                                <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">Item Name</th>
                                <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">Category</th>
                                <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest text-center">Stock</th>
                                <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">Price</th>
                                <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {!isLoggedIn ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-400 font-semibold">Please login to view data</td></tr>
                            ) : loading ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-400 font-semibold">Memuat Data Supabase...</td></tr>
                            ) : items.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-400 font-semibold">Inventaris kosong. Tambahkan barang baru.</td></tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="p-6 font-bold text-gray-400">{item.code}</td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-gray-100"/>
                                                <div>
                                                    <div className="font-extrabold text-gray-800">{item.title}</div>
                                                    <div className="text-xs text-gray-400 font-normal mt-1">{item.brand}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-sm font-semibold text-gray-500 capitalize">{item.category}</td>
                                        <td className="p-6 text-center">
                                            <div className={`mx-auto w-fit px-5 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 ${
                                                item.stock > 50 ? 'bg-emerald-100 text-emerald-600' : 
                                                item.stock > 20 ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${item.stock > 50 ? 'bg-emerald-600' : item.stock > 20 ? 'bg-amber-600' : 'bg-rose-600'}`} />
                                                {item.stock} in stock
                                            </div>
                                        </td>
                                        <td className="p-6 font-black text-gray-800">${item.price}</td>
                                        <td className="p-6 text-center">
                                            <button onClick={() => handleDelete(item.id)} className="text-rose-400 hover:text-rose-600 p-2 bg-rose-50 rounded-lg transition-colors">
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
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-left">Add New Item</h2>
                        <div className="space-y-4 text-left">
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="Item Name" />
                            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 text-gray-500">
                                <option value="Amenities">Amenities</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Beverages">Beverages</option>
                                <option value="Snacks">Snacks</option>
                            </select>
                            <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="Stock Amount" />
                            <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="Price ($)" />
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setShowForm(false)} className="flex-1 font-bold text-gray-400 hover:bg-gray-50 rounded-2xl">Discard</button>
                            <button onClick={handleAddItem} className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600">Save Item</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}