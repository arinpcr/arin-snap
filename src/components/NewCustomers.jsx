import { FaEnvelope } from "react-icons/fa";

const customers = [
  { name: "Roselle Ehrman", country: "Brazil", img: "https://i.pravatar.cc/150?u=1" },
  { name: "Jone Smith", country: "Australia", img: "https://i.pravatar.cc/150?u=2" },
  { name: "Darron Handler", country: "Pakistan", img: "https://i.pravatar.cc/150?u=3" },
  { name: "Leatrice Kulik", country: "Mascow", img: "https://i.pravatar.cc/150?u=4" },
];

export default function NewCustomers() {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#1e293b] text-lg">New Customers</h3>
        <span className="text-gray-400 font-bold tracking-widest cursor-pointer">•••</span>
      </div>
      
      <div className="space-y-6">
        {customers.map((c, i) => (
          <div key={i} className="flex items-center gap-4">
            <img src={c.img} alt={c.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1">
              <p className="font-bold text-[#1e293b] text-[15px]">{c.name}</p>
              <p className="text-[13px] text-[#94a3b8] font-medium">{c.country}</p>
            </div>
            {/* Amplop dengan background putih abu */}
            <div className="w-10 h-10 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#f97316] cursor-pointer">
              <FaEnvelope className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}