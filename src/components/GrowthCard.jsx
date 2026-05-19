import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function GrowthCard() {
  const data = [{ value: 78, fill: '#f97316' }, { value: 22, fill: '#fff7ed' }];
  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-[#1e293b] text-lg">Growth</h3>
        <span className="text-[#f97316] text-sm font-medium flex items-center gap-1">2022 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
      </div>
      <div className="h-32 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
              {data.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="font-black text-2xl text-[#1e293b]">78%</span>
          <span className="text-gray-400 text-sm font-medium">Growth</span>
        </div>
      </div>
    </div>
  );
}