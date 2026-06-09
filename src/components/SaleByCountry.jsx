export default function SaleByCountry() {
  const data = [
    { flag: "🇬🇧", country: "England", cust: "1200", sale: "1400", val: "$190,700", bounce: "23.44%" },
    { flag: "🇧🇷", country: "Brazil", cust: "400", sale: "562", val: "$143,960", bounce: "32.14%" },
    { flag: "🇺🇸", country: "United State", cust: "1200", sale: "2500", val: "$230,900", bounce: "29.9%" },
    { flag: "🇿🇦", country: "Africa", cust: "800", sale: "1200", val: "$120,300", bounce: "22.45%" },
    { flag: "🇦🇺", country: "Australia", cust: "2500", sale: "3300", val: "$350,000", bounce: "38.40%" },
    { flag: "🇩🇪", country: "Germany", cust: "2500", sale: "3900", val: "$440,000", bounce: "40.22%" },
  ];

  return (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-gray-100 h-full w-full">
      <h3 className="font-bold text-[20px] text-[#1e293b] mb-8">Sale by country</h3>
      
      {/* Tambahan w-full agar kontainer scroll penuh */}
      <div className="overflow-x-auto w-full">
        {/* min-w-[600px] mencegah tabel memampat sampai hancur di layar HP/layar di-zoom */}
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="text-[#1e293b] border-b border-gray-100">
              <th className="pb-4 font-bold">🌐</th>
              <th className="pb-4 font-bold text-[15px]">Country</th>
              <th className="pb-4 font-bold text-[15px]">Customer</th>
              <th className="pb-4 font-bold text-[15px]">Sale</th>
              <th className="pb-4 font-bold text-[15px]">Value</th>
              <th className="pb-4 font-bold text-[15px]">Bounce</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-orange-50/30">
                <td className="py-4 text-2xl">{row.flag}</td>
                <td className="py-4 text-[#64748b] font-medium">{row.country}</td>
                <td className="py-4 text-[#64748b] font-medium">{row.cust}</td>
                <td className="py-4 text-[#64748b] font-medium">{row.sale}</td>
                <td className="py-4 text-[#64748b] font-medium">{row.val}</td>
                <td className="py-4 text-[#64748b] font-medium">{row.bounce}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}