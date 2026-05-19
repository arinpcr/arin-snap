export default function Alert({ type = "info", children }) {
    const styles = {
        info: "bg-blue-50 text-blue-600 border-blue-200",
        success: "bg-emerald-50 text-emerald-600 border-emerald-200",
        danger: "bg-rose-50 text-rose-600 border-rose-200",
    };
    return <div className={`p-4 rounded-2xl border ${styles[type]} font-bold`}>{children}</div>;
}