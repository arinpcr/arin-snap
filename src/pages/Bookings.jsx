import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabase";
import { FaTrash } from "react-icons/fa";

export default function Bookings() {
    const [showForm, setShowForm] = useState(false);
    const [bookingsData, setBookingsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const [formData, setFormData] = useState({
        name: "",
        status: "Pending",
        price: ""
    });

    // 1. READ: Fetch dari Supabase
    const fetchBookings = async () => {
        if (!isLoggedIn) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('booking')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;
            setBookingsData(data || []);
        } catch (error) {
            console.error("Error fetching bookings:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [isLoggedIn]);

    // Update Title dinamis PFL
    useEffect(() => {
        const pendingCount = bookingsData.filter(b => b.status === 'Pending').length;
        document.title = `Capella - ${pendingCount} Pesanan Pending`;
        return () => { document.title = "Capella CRM"; };
    }, [bookingsData]);

    // 2. CREATE: Insert ke Supabase
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddBooking = async () => {
        if (!formData.name || !formData.price) return alert("Isi semua form!");

        try {
            const newBookingId = `#BKG-${Math.floor(Math.random() * 9000) + 1000}`;
            const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

            const { error } = await supabase
                .from('booking')
                .insert([
                    { 
                        booking_id: newBookingId,
                        name: formData.name,
                        status: formData.status,
                        price: `$ ${formData.price}.00`,
                        date: today
                    }
                ]);

            if (error) throw error;
            
            alert("Booking tersimpan!");
            setShowForm(false);
            setFormData({ name: "", status: "Pending", price: "" });
            fetchBookings();
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    // 3. DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Batalkan booking ini?")) return;
        try {
            const { error } = await supabase.from('booking').delete().eq('id', id);
            if (error) throw error;
            fetchBookings();
        } catch (error) {
            alert("Error delete: " + error.message);
        }
    };

    return (
        <div id="dashboard-container" className="p-2 font-poppins">
            <PageHeader title="Bookings" breadcrumb="Booking Management">
                {isLoggedIn && (
                    <button 
                        onClick={() => setShowForm(true)} 
                        className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-[0_10px_20px_rgba(249,115,22,0.3)]"
                    >
                        + New Booking
                    </button>
                )}
            </PageHeader>

            <div className="mt-8 bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="bg-orange-50/50">
                                <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">Booking ID</th>
                                <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">Guest Name</th>
                                <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest text-center">Status</th>
                                <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">Amount</th>
                                <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">Date</th>
                                <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {!isLoggedIn ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-400 font-semibold">Please login to view data</td></tr>
                            ) : loading ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-400 font-semibold">Memuat Data...</td></tr>
                            ) : bookingsData.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-400 font-semibold">Belum ada booking.</td></tr>
                            ) : (
                                bookingsData.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="p-6 font-bold text-gray-800">{booking.booking_id}</td>
                                        <td className="p-6 font-extrabold text-gray-700">{booking.name}</td>
                                        <td className="p-6 text-center">
                                            <div className={`mx-auto w-fit px-5 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 ${
                                                booking.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                                                booking.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${booking.status === 'Completed' ? 'bg-emerald-600' : booking.status === 'Pending' ? 'bg-amber-600' : 'bg-rose-600'}`} />
                                                {booking.status}
                                            </div>
                                        </td>
                                        <td className="p-6 font-black text-gray-800">{booking.price}</td>
                                        <td className="p-6 text-xs font-bold text-gray-400">{booking.date}</td>
                                        <td className="p-6 text-center">
                                            <button onClick={() => handleDelete(booking.id)} className="text-rose-400 hover:text-rose-600 p-2 bg-rose-50 rounded-lg transition-colors">
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
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-left">Create New Booking</h2>
                        <div className="space-y-4 text-left">
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="Guest Name" />
                            <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 text-gray-500">
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="Total Price ($)" />
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setShowForm(false)} className="flex-1 font-bold text-gray-400 hover:bg-gray-50 rounded-2xl">Discard</button>
                            <button onClick={handleAddBooking} className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600">Submit Booking</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}