import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', fb: 20, google: 60 },
  { name: 'Feb', fb: 130, google: 220 },
  { name: 'Mar', fb: 60, google: 140 },
  { name: 'Apr', fb: 40, google: 135 },
  { name: 'May', fb: 200, google: 90 },
  { name: 'Jun', fb: 300, google: 50 },
  { name: 'Jul', fb: 110, google: 120 },
  { name: 'Aug', fb: 180, google: 40 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0]?.value;
    return (
      <div className="bg-[#1a1f2e] text-white rounded-xl px-4 py-2 shadow-xl text-center min-w-[80px]">
        <p className="text-gray-400 text-xs font-medium mb-1">{label}</p>
        <p className="text-xl font-bold m-0">${value}</p>
      </div>
    );
  }
  return null;
};

const CustomActiveDot = (props) => {
  const { cx, cy, stroke } = props;
  return <circle cx={cx} cy={cy} r={6} fill="white" stroke={stroke} strokeWidth={3} />;
};

export default function RevenueChart() {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[20px] font-bold text-[#1e293b]">Revenue</h3>
        <div className="flex gap-5 text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
            Facebook ads
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#34d399]"></div>
            Google ads
          </div>
        </div>
      </div>

      {/* flex-1 akan membuat grafik ini memanjang menyesuaikan tinggi VisitorChart */}
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13 }} domain={[0, 400]} ticks={[0, 100, 200, 300, 400]} dx={-10} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
            <Line type="monotone" dataKey="fb" stroke="#f97316" strokeWidth={4} dot={false} activeDot={<CustomActiveDot />} />
            <Line type="monotone" dataKey="google" stroke="#34d399" strokeWidth={4} dot={false} activeDot={<CustomActiveDot />} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}