export default function Avatar({ name = "User" }) {
    return (
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 border-2 border-white shadow-sm">
            {name.charAt(0).toUpperCase()}
        </div>
    );
}