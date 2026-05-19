export default function Badge({ children, type = "primary" }) {
    const types = {
        primary: "bg-orange-100 text-orange-600",
        success: "bg-emerald-100 text-emerald-600",
        warning: "bg-amber-100 text-amber-600",
        danger: "bg-rose-100 text-rose-600",
        secondary: "bg-gray-100 text-gray-500",
    };

    const dotColors = {
        primary: "bg-orange-600",
        success: "bg-emerald-600",
        warning: "bg-amber-600",
        danger: "bg-rose-600",
        secondary: "bg-gray-500",
    }

    return (
        <span className={`${types[type]} px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 w-fit`}>
            <div className={`w-1.5 h-1.5 rounded-full ${dotColors[type]}`} />
            {children}
        </span>
    );
}