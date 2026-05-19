export default function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto bg-white rounded-[32px] border border-gray-100 shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-orange-50/50">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="p-6 text-sm font-bold text-orange-500 uppercase tracking-widest">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">{children}</tbody>
      </table>
    </div>
  );
}