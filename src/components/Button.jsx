export default function Button({ children, type = "primary", onClick, className = "" }) {
    const types = {
        primary: "bg-orange-500 hover:bg-orange-600 text-white shadow-[0_8px_15px_rgba(249,115,22,0.2)] border border-orange-500",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-600 border border-transparent",
        success: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_8px_15px_rgba(16,185,129,0.2)] border border-emerald-500",
        danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_8px_15px_rgba(244,63,94,0.2)] border border-rose-500",
        outline: "bg-transparent hover:bg-orange-50 text-orange-500 border-2 border-orange-500",
    };

    return (
        <button 
            onClick={onClick} 
            className={`${types[type]} px-6 py-2.5 rounded-full font-bold transition-all active:scale-95 text-sm flex items-center justify-center gap-2 ${className}`}
        >
            {children}
        </button>
    );
}