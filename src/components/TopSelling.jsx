const products = [
  { name: "Nike v22", sub: "Running Shoes", orders: "8000", price: "$130", ads: "$9.500", refund: "> 13", bg: "bg-[#fde047]", icon: "👟" },
  { name: "Instax Camera", sub: "Portable camera", orders: "3000", price: "$45", ads: "$4.500", refund: "> 18", bg: "bg-[#cffafe]", icon: "📷" },
  { name: "Chair", sub: "Relaxing chair", orders: "6000", price: "$80", ads: "$5.800", refund: "< 11", bg: "bg-[#bbf7d0]", icon: "🪑" },
  { name: "Laptop", sub: "Macbook pro 13", orders: "4000", price: "$500", ads: "$4.700", refund: "> 18", bg: "bg-[#dcfce7]", icon: "💻" },
  { name: "Watch", sub: "Digital watch", orders: "2000", price: "$15", ads: "$2.500", refund: "< 10", bg: "bg-[#fca5a5]", icon: "⌚" },
];

export default function TopSelling() {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 h-full flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-[22px] text-[#1e293b] mb-8">Top Selling Product</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#1e293b] border-b border-gray-100">
                <th className="pb-4 font-bold text-[15px]">Product</th>
                <th className="pb-4 font-bold text-[15px]">Orders</th>
                <th className="pb-4 font-bold text-[15px]">Price</th>
                <th className="pb-4 font-bold text-[15px]">Ads spent</th>
                <th className="pb-4 font-bold text-[15px]">Refunds</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${p.bg} flex items-center justify-center text-xl`}>
                        {p.icon}
                      </div>
                      <div>
                        <p className="font-bold text-[#1e293b] text-[15px]">{p.name}</p>
                        <p className="text-[#94a3b8] text-sm">{p.sub}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-[#64748b] font-medium">{p.orders}</td>
                  <td className="py-4 text-[#64748b] font-medium">{p.price}</td>
                  <td className="py-4 text-[#64748b] font-medium">{p.ads}</td>
                  <td className="py-4 text-[#64748b] font-medium">{p.refund}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 pt-6 text-sm">
        <span className="text-[#94a3b8] font-medium">Showing 5 of 5 products</span>
        <div className="flex items-center gap-3">
          <button className="text-[#94a3b8] font-medium hover:text-gray-600">Prev</button>
          <button className="w-8 h-8 rounded-full bg-[#f97316] text-white font-bold flex items-center justify-center">1</button>
          <button className="w-8 h-8 rounded-full bg-[#f8fafc] text-[#f97316] font-bold flex items-center justify-center">2</button>
          <button className="text-[#f97316] font-medium hover:text-orange-600">Next</button>
        </div>
      </div>
    </div>
  );
}