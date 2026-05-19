import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', val: 4000 }, { name: 'Feb', val: 3000 }, { name: 'Mar', val: 2000 },
  { name: 'Apr', val: 2780 }, { name: 'May', val: 1890 }, { name: 'Jun', val: 2390 },
  { name: 'Jul', val: 3490 }, { name: 'Aug', val: 4000 },
];

export default function StatisticsChart() {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-[#1e293b] text-xl">Statistics</h3>
        <span className="text-[#f97316] text-sm font-medium cursor-pointer flex items-center gap-1">Monthly <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
      </div>
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={6} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} ticks={[0, 1000, 2000, 5000]} tickFormatter={(val) => val === 0 ? '0' : val/1000 + 'K'} dx={-10} />
            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="val" fill="#f97316" radius={[10, 10, 10, 10]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}