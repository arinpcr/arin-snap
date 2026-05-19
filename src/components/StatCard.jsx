import { FaChartLine } from "react-icons/fa";

export default function StatCard({ title, value, date, percent, icon: Icon, bgColor }) {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center gap-5">
      {/* Kotak Ikon Solid */}
      <div className={`w-[84px] h-[84px] rounded-[24px] flex items-center justify-center text-white text-3xl flex-shrink-0 ${bgColor}`}>
        <Icon />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center w-full mb-1">
          <h3 className="text-[#1e293b] font-bold text-[17px]">{title}</h3>
          <span className="text-gray-400 text-sm">{date}</span>
        </div>
        <p className="text-[26px] font-bold text-[#64748b] leading-none mb-2.5">{value}</p>
        
        {/* Trend Line */}
        <div className="flex items-center gap-2 text-sm font-medium text-[#f97316]">
          <FaChartLine className="w-3.5 h-3.5" />
          <span>{percent} last month</span>
        </div>
      </div>
    </div>
  );
}