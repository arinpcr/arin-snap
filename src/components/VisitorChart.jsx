import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Direct', value: 43, color: '#f97316' },
  { name: 'Organic', value: 27, color: '#10b981' },
  { name: 'Paid', value: 16, color: '#06b6d4' },
  { name: 'Social', value: 33, color: '#f43f5e' },
];

export default function VisitorChart() {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 h-full flex flex-col justify-between">
      <h3 className="font-bold text-[#1e293b] text-[20px] mb-6">Website Visitors</h3>
      
      {/* flex-1 akan mendorong area chart agar pas dengan sisa ruang */}
      <div className="flex-1 relative min-h-[180px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
              {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center font-black text-3xl text-[#1e293b]">18K</div>
      </div>

      <div className="flex flex-col border-t border-gray-100 pt-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0">
            <span className="flex items-center gap-3 text-gray-500 font-medium text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div> 
              {item.name}
            </span>
            <span className="font-bold text-[#1e293b]">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}