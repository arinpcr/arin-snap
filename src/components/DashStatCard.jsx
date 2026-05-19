export default function DashStatCard({ title, value, percent, icon: Icon, bgColor }) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-white text-3xl flex-shrink-0 ${bgColor}`}>
        <Icon />
      </div>
      <div>
        <h3 className="font-bold text-[#1e293b] text-lg mb-0.5">{title}</h3>
        <div className="flex items-baseline gap-3">
          <p className="text-[22px] font-bold text-gray-500 leading-none">{value}</p>
          <span className="flex items-center text-sm font-bold text-[#f97316]">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            {percent}
          </span>
        </div>
      </div>
    </div>
  );
}