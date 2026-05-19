export default function SelectField({ label, options }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-gray-600">{label}</label>
      <select className="p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 text-gray-500">
        {options.map((opt, i) => <option key={i}>{opt}</option>)}
      </select>
    </div>
  );
}