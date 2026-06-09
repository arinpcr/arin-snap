import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaKey } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

export default function Login() {
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataForm, setDataForm] = useState({ email: "", password: "" });

    // --- TUGAS PFL: Implementasi useRef & useEffect ---
    const emailInputRef = useRef(null);

    useEffect(() => {
        if (emailInputRef.current) {
            emailInputRef.current.focus();
        }
    }, []);
    // --------------------------------------------------

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({ ...dataForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // 1. --- JALUR LOGIN CEPAT (VIP) ---
        if ((dataForm.email === "a" || dataForm.email === "a@gmail.com") && dataForm.password === "a") {
            localStorage.setItem("isLoggedIn", "true");
            setLoading(false);
            navigate("/"); 
            return; 
        }

        // 2. --- LOGIKA A: CEK LOCALSTORAGE BROWSER ---
        const savedEmail = localStorage.getItem("registeredEmail");
        const savedPass = localStorage.getItem("registeredPass");
        const savedName = localStorage.getItem("registeredName"); 

        // Trik Sakti: Ubah semua jadi huruf kecil dan buang spasi nyasar biar nggak gampang error!
        const inputUser = dataForm.email.trim().toLowerCase();
        const dbEmail = (savedEmail || "").trim().toLowerCase();
        const dbName = (savedName || "").trim().toLowerCase();

        // Cek kecocokan setelah dibersihkan
        if (
            (dbEmail || dbName) && 
            (inputUser === dbEmail || inputUser === dbName) && 
            dataForm.password === savedPass // Password tetap sensitif besar-kecil
        ) {
            localStorage.setItem("isLoggedIn", "true");
            setLoading(false);
            navigate("/success"); 
            return; 
        }

        // 3. --- LOGIKA B: TEMBAK KE SERVER API (axios) ---
        try {
            const response = await axios.post("https://dummyjson.com/user/login", {
                username: dataForm.email, 
                password: dataForm.password,
            });

            if (response.status === 200) {
                localStorage.setItem("isLoggedIn", "true");
                navigate("/success"); 
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials. Have you registered?");
        } finally {
            setLoading(false);
        }
    };

    // UI DI BAWAH INI 100% ASLI MILIKMU
    return (
        <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden min-h-[550px]">
            <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col relative">
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-8 h-8 rounded-full border-[2px] border-orange-500 flex items-center justify-center relative">
                        <div className="w-4 h-1 bg-orange-500 rounded-full absolute -ml-1"></div>
                        <div className="w-2 h-1 bg-orange-500 rounded-full absolute mt-3 -ml-2"></div>
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight">Elegent</span>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Login</h2>
                    {error && <div className="bg-rose-50 text-rose-500 text-sm p-3 rounded-lg mb-4 text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2">Email / Username</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    name="email" 
                                    value={dataForm.email} 
                                    onChange={handleChange} 
                                    ref={emailInputRef} 
                                    className="w-full bg-gray-50 border-none rounded-full py-4 pl-5 pr-12 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all" 
                                    placeholder="Enter your email" 
                                    required 
                                />
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
                            <a href="#" className="text-xs font-semibold text-orange-400 hover:text-orange-500">Forget password</a>
                        </div>

                        <button type="submit" disabled={loading} className="w-full mt-2 bg-[#f98829] hover:bg-orange-500 text-white font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_8px_20px_rgba(249,115,22,0.25)]">
                            {loading && <ImSpinner2 className="animate-spin" />}
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 font-medium mt-8">
                        Don't have an account ? <Link to="/register" className="text-orange-400 font-bold hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>

            <div className="hidden md:block w-1/2 bg-[#fa8620] relative overflow-hidden">
                <div className="absolute -top-32 -left-20 w-[450px] h-[450px] rounded-full bg-white/10 blur-[2px]"></div>
                <div className="absolute top-10 right-0 w-[350px] h-[350px] rounded-full bg-white/5 blur-[2px] translate-x-1/4"></div>
                <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full bg-gradient-to-tr from-orange-300/60 to-orange-400/60 shadow-lg"></div>

                <div className="absolute bottom-16 left-12">
                    <h2 className="text-[40px] font-bold text-white leading-tight tracking-wide">Hey<br />Welcome<br />Back</h2>
                </div>
            </div>
        </div>
    );
}