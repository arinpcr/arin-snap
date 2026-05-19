import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Male', value: 50, color: '#f97316' },
  { name: 'Female', value: 35, color: '#24d29d' },
  { name: 'Others', value: 15, color: '#f95872' },
];

export default function BuyersProfile() {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#1e293b] text-lg">Buyers Profile</h3>
        <span className="text-gray-400 font-bold tracking-widest cursor-pointer">•••</span>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Chart Donut */}
        <div className="w-[120px] h-[120px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={35} outerRadius={60} dataKey="value" stroke="none">
                {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Detail Persentase */}
        <div className="flex-1 space-y-4">
          {data.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-[15px]">
              <span className="flex items-center gap-3 text-[#64748b] font-medium">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div> 
                {item.name}
              </span>
              <span className="font-bold text-[#1e293b]">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}