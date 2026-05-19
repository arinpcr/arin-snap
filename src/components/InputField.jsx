export default function InputField({ label, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-gray-600">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        className="p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all"
      />
    </div>
  );
}