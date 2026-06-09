import { FaChartLine } from "react-icons/fa";

export default function StatCard({ title, value, date, percent, icon: Icon, bgColor }) {
  return (
    // Menggunakan struktur layout, rounded, padding, dan gap yang sama persis dengan DashStatCard
    <div className="w-full h-full bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-4 overflow-hidden">
      
      {/* Ukuran kotak ikon disamakan persis dengan DashStatCard (72px) */}
      <div className={`w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl flex-shrink-0 ${bgColor}`}>
        <Icon />
      </div>
      
      <div className="flex-1 min-w-0">
        {/* Bagian Judul dan Teks Tanggal Kecil */}
        <div className="flex justify-between items-baseline w-full mb-0.5 flex-wrap gap-x-2">
          <h3 className="font-bold text-[#1e293b] text-base sm:text-lg truncate">{title}</h3>
          {date && <span className="text-gray-400 text-xs truncate">{date}</span>}
        </div>
        
        {/* Nilai utama dan Persentase diletakkan sejajar (inline) menggunakan pola baseline seperti DashStatCard */}
        <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
          <p className="text-[20px] sm:text-[22px] font-bold text-gray-500 leading-none truncate">{value}</p>
          
          <span className="flex items-center text-xs sm:text-sm font-bold text-[#f97316] whitespace-nowrap">
            {/* Menggunakan ikon panah Svg bawaan DashStatCard agar bentuknya seragam */}
            <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {percent}
          </span>
        </div>
      </div>

    </div>
  );
}