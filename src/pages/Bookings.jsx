import { useState, useEffect } from "react"; // Tambah useEffect di sini
import PageHeader from "../components/PageHeader";

export default function Bookings() {
    const [showForm, setShowForm] = useState(false);
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // --- TUGAS PFL: Implementasi useEffect ---
    // Efek: Mengubah judul Tab Browser saat halaman Booking dibuka
    useEffect(() => {
        document.title = "Capella - 3 Pesanan Pending";

        // Cleanup: Kembalikan judul saat pindah ke halaman lain
        return () => {
            document.title = "Capella CRM";
        };
    }, []); // Array kosong berarti hanya jalan 1x saat render pertama
    // ----------------------------------------

    const bookingsData = isLoggedIn ? Array.from({ length: 15 }, (_, i) => ({
        id: `#BKG-${1000 + i}`,
        name: ["Aiden Max", "Bella Swan", "Carter Dan", "Diana Prince", "Ethan Hunt"][i % 5],
        status: ["Pending", "Completed", "Cancelled"][i % 3],
        price: `$ ${(i + 1) * 125}.00`,
        date: `03 May 2026`
    })) : [];

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
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-orange-50/50">
                            <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">Booking ID</th>
                            <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">Guest Name</th>
                            <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest text-center">Status</th>
                            <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">Amount</th>
                            <th className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">Check-in Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {!isLoggedIn ? (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-gray-400 font-semibold">
                                    Please login to view data
                                </td>
                            </tr>
                        ) : (
                            bookingsData.map((booking, i) => (
                                <tr key={i} className="hover:bg-orange-50/30 transition-colors group">
                                    <td className="p-6 font-bold text-gray-800">{booking.id}</td>
                                    <td className="p-6 font-extrabold text-gray-700">{booking.name}</td>
                                    <td className="p-6 text-center">
                                        <div className={`mx-auto w-fit px-5 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 ${
                                            booking.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                                            booking.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                booking.status === 'Completed' ? 'bg-emerald-600' : 
                                                booking.status === 'Pending' ? 'bg-amber-600' : 'bg-rose-600'
                                            }`} />
                                            {booking.status}
                                        </div>
                                    </td>
                                    <td className="p-6 font-black text-gray-800">{booking.price}</td>
                                    <td className="p-6 text-xs font-bold text-gray-400">{booking.date}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-2xl animate-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-left">Create New Booking</h2>
                        <div className="space-y-4 text-left">
                            <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="Guest Name" />
                            <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 text-gray-500">
                                <option>Pending</option>
                                <option>Completed</option>
                            </select>
                            <input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="Total Price ($)" />
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setShowForm(false)} className="flex-1 font-bold text-gray-400 hover:bg-gray-50 rounded-2xl">Discard</button>
                            <button onClick={() => setShowForm(false)} className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600">Submit Booking</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}