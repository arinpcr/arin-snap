import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', fb: 20 },
  { name: 'Feb', fb: 130 },
  { name: 'Mar', fb: 60 },
  { name: 'Apr', fb: 40 },
  { name: 'May', fb: 200 },
  { name: 'Jun', fb: 100 },
  { name: 'Jul', fb: 110 },
  { name: 'Aug', fb: 180 },
];

export default function FacebookAdsChart() {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Revenue</h3>
        <div className="flex gap-2 text-sm text-gray-500">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div> Facebook ads
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
            <Line type="monotone" dataKey="fb" stroke="#f97316" strokeWidth={4} dot={false} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}