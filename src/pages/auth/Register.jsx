import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaKey, FaUser } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

// IMPORT KONEKSI SUPABASE
import { supabase } from "../../lib/supabase";

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // State untuk Role & Data Form
    const [role, setRole] = useState("member"); // Pilihan: "member" atau "staff"
    const [dataForm, setDataForm] = useState({ name: "", email: "", password: "" });

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({ ...dataForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // PROSES MENYIMPAN KE DATABASE SUPABASE BESERTA ROLE-NYA
            const { data, error } = await supabase.auth.signUp({
                email: dataForm.email.trim(),
                password: dataForm.password,
                options: {
                    data: {
                        full_name: dataForm.name,
                        role: role
                    },
                    // Menambahkan opsi emailRedirectTo
                    // user langsung diarahkan ke halaman login
                    emailRedirectTo: window.location.origin + '/login' 
                }
            });

            if (error) {
                throw error;
            }

            if (data?.user) {
                const userData = {
                    id: data.user.id,
                    email: dataForm.email.trim(),
                    name: dataForm.name,
                    role: role,
                    created_at: new Date().toISOString()
                };
                await supabase.from('users').upsert([userData], { onConflict: 'id' }).catch(() => {});

                if (role === "member") {
                    const guestId = `GST-${Math.floor(Math.random() * 8999) + 1000}`;
                    await supabase.from('guest').upsert([
                        {
                            guest_id: guestId,
                            name: dataForm.name,
                            email: dataForm.email.trim(),
                            phone: "-",
                            visits: 1,
                            spent: "$ 0.00"
                        }
                    ]).catch(() => {});
                }
            }

            alert(`Registrasi ${role === "staff" ? "Staff" : "Member"} Berhasil! Silakan Login.`);
            navigate("/login");

        } catch (error) {
            if (error.message && (error.message.toLowerCase().includes("rate limit") || error.status === 429)) {
                alert("Batas pengiriman email konfirmasi Supabase (Rate Limit) telah tercapai.\n\nSOLUSI MUDAH:\n1. Buka Dashboard Supabase -> Authentication -> Providers -> Email.\n2. Matikan opsi 'Confirm email' (Enable Email Confirmations).\n3. Klik Save. Setelah dimatikan, Anda bisa mendaftar akun baru sepuasnya tanpa gangguan rate limit!");
            } else {
                alert(error.message || "Gagal mendaftar, silakan coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden min-h-[550px]">
            <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col relative">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full border-[2px] border-orange-500 flex items-center justify-center relative">
                        <div className="w-4 h-1 bg-orange-500 rounded-full absolute -ml-1"></div>
                        <div className="w-2 h-1 bg-orange-500 rounded-full absolute mt-3 -ml-2"></div>
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight">Capella</span>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Create Account</h2>

                    {/* TOGGLE PILIHAN ROLE DAFTAR */}
                    <div className="flex bg-gray-100 p-1 rounded-full mb-6">
                        <button type="button" onClick={() => setRole("member")} className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${role === "member" ? "bg-white text-orange-500 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                            Member
                        </button>
                        <button type="button" onClick={() => setRole("staff")} className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${role === "staff" ? "bg-white text-orange-500 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                            Staff
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2">Full Name</label>
                            <div className="relative">
                                <input type="text" name="name" value={dataForm.name} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-full py-4 pl-5 pr-12 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all" placeholder="Enter your full name" required />
                                <FaUser className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2">Email Address</label>
                            <div className="relative">
                                <input type="email" name="email" value={dataForm.email} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-full py-4 pl-5 pr-12 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all" placeholder="Enter your email" required />
                                <FaEnvelope className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2">Password (Min. 6 Karakter)</label>
                            <div className="relative">
                                <input type="password" name="password" value={dataForm.password} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-full py-4 pl-5 pr-12 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all" placeholder="Create password" minLength="6" required />
                                <FaKey className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full mt-4 bg-[#f98829] hover:bg-orange-500 text-white font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_8px_20px_rgba(249,115,22,0.25)]">
                            {loading && <ImSpinner2 className="animate-spin" />}
                            {loading ? "Signing up..." : `Register as ${role === "staff" ? "Staff" : "Member"}`}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 font-medium mt-6">
                        Already have an account? <Link to="/login" className="text-orange-400 font-bold hover:underline">Log in</Link>
                    </p>
                </div>
            </div>

            <div className="hidden md:block w-1/2 bg-[#fa8620] relative overflow-hidden">
                <div className="absolute -top-32 -left-20 w-[450px] h-[450px] rounded-full bg-white/10 blur-[2px]"></div>
                <div className="absolute top-10 right-0 w-[350px] h-[350px] rounded-full bg-white/5 blur-[2px] translate-x-1/4"></div>
                <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full bg-gradient-to-tr from-orange-300/60 to-orange-400/60 shadow-lg"></div>

               
<div className="absolute bottom-16 left-12">
    <h2 className="text-[40px] font-bold text-white leading-tight tracking-wide whitespace-pre-line">
        {role === "staff" ? "Join The\nCapella\nTeam" : "Join The\nCapella\nCircle"}
    </h2>
</div>
            </div>
        </div>
    );
}