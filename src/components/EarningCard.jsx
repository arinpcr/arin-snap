import { FaArrowTrendUp } from "react-icons/fa6";

export default function EarningCard() {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 text-center relative flex-1 flex flex-col justify-center">
      <div className="absolute top-6 left-6 font-bold text-[#1e293b] text-lg">Earning</div>
      <div className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-[#24d29d] flex items-center justify-center text-white">
        <FaArrowTrendUp size={14} />
      </div>
      
      <div className="mt-8">
        <h2 className="text-4xl font-bold text-[#1e293b] mb-2">$89,670</h2>
        <p className="text-[#f97316] font-bold mb-1">+28.8%</p>
        <p className="text-gray-400 text-sm font-medium mb-6">This month growth</p>
        <button className="bg-[#f97316] hover:bg-orange-600 text-white w-full py-3 rounded-full font-bold shadow-lg shadow-orange-200 transition-all active:scale-95">
          Withdraw money
        </button>
      </div>
    </div>
  );
}