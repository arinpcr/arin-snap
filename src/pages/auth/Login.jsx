import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaKey } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

// IMPORT KONEKSI SUPABASE
import { supabase } from "../../lib/supabase";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataForm, setDataForm] = useState({ email: "", password: "" });
    const [role, setRole] = useState("member"); 

    const emailInputRef = useRef(null);

    useEffect(() => {
        if (emailInputRef.current) {
            emailInputRef.current.focus();
        }
    }, [role]); 

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({ ...dataForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1. FALLBACK DARURAT ADMIN (Jaga-jaga kalau database error)
            if (role === "staff" && (dataForm.email === "a" || dataForm.email === "admin") && dataForm.password === "a") {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userRole", "staff"); 
                navigate("/dashboard"); 
                return; 
            }

            // 2. CEK SUPABASE
            const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
                email: dataForm.email.trim(),
                password: dataForm.password,
            });

            if (supabaseError) {
                throw supabaseError;
            }

            // 3. CEK ROLE DARI DATABASE
            // Mengambil role dari user_metadata (default-nya 'member' kalau kosong)
            const dbRole = data.user?.user_metadata?.role || "member"; 

            // Cek apakah tab yang dipilih cocok dengan role di database
            if (role === "staff" && dbRole !== "staff") {
                await supabase.auth.signOut(); // Keluarkan lagi
                setError("Akses Ditolak: Akun Anda bukan terdaftar sebagai Staff.");
                setLoading(false);
                return;
            }

            if (role === "member" && dbRole === "staff") {
                await supabase.auth.signOut(); // Keluarkan lagi
                setError("Anda adalah Staff. Silakan pindah ke tab Staff Portal.");
                setLoading(false);
                return;
            }

            // KALAU COCOK, IZINKAN MASUK!
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userRole", dbRole); 
            
            if (data.user?.user_metadata?.full_name) {
                localStorage.setItem("registeredName", data.user.user_metadata.full_name);
            }

            // ARAHKAN SESUAI ROLE DATABASE
            if (dbRole === "staff") {
                navigate("/dashboard");
            } else {
                navigate("/");
            }

        } catch (err) {
            setError("Email atau Password salah. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden min-h-[550px]">
            <div className="w-full md:w-1/2 p-10 md:p-12 flex flex-col relative">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-full border-[2px] border-orange-500 flex items-center justify-center relative">
                        <div className="w-4 h-1 bg-orange-500 rounded-full absolute -ml-1"></div>
                        <div className="w-2 h-1 bg-orange-500 rounded-full absolute mt-3 -ml-2"></div>
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight">Capella</span>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Login</h2>
                    
                    <div className="flex bg-gray-100 p-1 rounded-full mb-6">
                        <button type="button" onClick={() => { setRole("member"); setError(""); }} className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${role === "member" ? "bg-white text-orange-500 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                            Member
                        </button>
                        <button type="button" onClick={() => { setRole("staff"); setError(""); }} className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${role === "staff" ? "bg-white text-orange-500 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                            Staff Portal
                        </button>
                    </div>

                    {error && <div className="bg-rose-50 text-rose-500 text-sm p-3 rounded-lg mb-4 text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2">Email Address</label>
                            <div className="relative">
                                <input type="email" name="email" value={dataForm.email} onChange={handleChange} ref={emailInputRef} className="w-full bg-gray-50 border-none rounded-full py-4 pl-5 pr-12 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all" placeholder="Enter your email" required />
                                <FaEnvelope className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2">Password</label>
                            <div className="relative">
                                <input type="password" name="password" value={dataForm.password} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-full py-4 pl-5 pr-12 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all" placeholder="********" required />
                                <FaKey className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex justify-end pt-1">
                            <a href="#" className="text-xs font-semibold text-orange-400 hover:text-orange-500">Forget password?</a>
                        </div>

                        <button type="submit" disabled={loading} className="w-full mt-2 bg-[#f98829] hover:bg-orange-500 text-white font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_8px_20px_rgba(249,115,22,0.25)]">
                            {loading && <ImSpinner2 className="animate-spin" />}
                            {loading ? "Authenticating..." : `Log in as ${role === "staff" ? "Staff" : "Member"}`}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 font-medium mt-8">
                        {role === "member" ? (
                            <>Don't have an account? <Link to="/register" className="text-orange-400 font-bold hover:underline">Sign up</Link></>
                        ) : (
                            <>Need access? <Link to="/register" className="text-orange-400 font-bold hover:underline">Register as Staff</Link></>
                        )}
                    </p>
                </div>
            </div>

            <div className="hidden md:block w-1/2 bg-[#fa8620] relative overflow-hidden">
                <div className="absolute -top-32 -left-20 w-[450px] h-[450px] rounded-full bg-white/10 blur-[2px]"></div>
                <div className="absolute top-10 right-0 w-[350px] h-[350px] rounded-full bg-white/5 blur-[2px] translate-x-1/4"></div>
                <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full bg-gradient-to-tr from-orange-300/60 to-orange-400/60 shadow-lg"></div>

                <div className="absolute bottom-16 left-12">
                    <h2 className="text-[40px] font-bold text-white leading-tight tracking-wide">
                        {role === "staff" ? (
                            <>Capella<br />Staff<br />Portal</>
                        ) : (
                            <>Welcome<br />Back to<br />Capella</>
                        )}
                    </h2>
                </div>
            </div>
        </div>
    );
}