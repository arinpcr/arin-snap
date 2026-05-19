import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', google: 60 },
  { name: 'Feb', google: 220 },
  { name: 'Mar', google: 140 },
  { name: 'Apr', google: 135 },
  { name: 'May', google: 90 },
  { name: 'Jun', google: 50 },
  { name: 'Jul', google: 120 },
  { name: 'Aug', google: 40 },
];

export default function GoogleAdsChart() {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Revenue</h3>
        <div className="flex gap-2 text-sm text-gray-500">
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div> Google ads
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
            <Line type="monotone" dataKey="google" stroke="#34d399" strokeWidth={4} dot={false} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}