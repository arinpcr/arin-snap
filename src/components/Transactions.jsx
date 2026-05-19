import { FaWallet, FaCreditCard, FaArrowTrendUp, FaPaypal } from "react-icons/fa6";

export default function Transactions() {
  const trans = [
    { icon: FaWallet, title: "Wallet", sub: "Starbucks", val: "+70.20 $" },
    { icon: FaCreditCard, title: "Credit card", sub: "Order food", val: "-20.20 $" },
    { icon: FaArrowTrendUp, title: "Transfer", sub: "Refund", val: "+30.20 $" },
    { icon: FaPaypal, title: "Paypal", sub: "Send money", val: "+20.20 $" },
    { icon: FaWallet, title: "Wallet", sub: "Mac'D", val: "+50.20 $" },
  ];

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#1e293b] text-xl">Transactions</h3>
        <span className="text-gray-400 font-bold tracking-widest cursor-pointer">•••</span>
      </div>
      <div className="space-y-6">
        {trans.map((t, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-[#24d29d] flex items-center justify-center text-white text-xl shadow-sm">
                <t.icon />
              </div>
              <div>
                <p className="text-[#94a3b8] text-xs font-medium">{t.title}</p>
                <p className="font-bold text-[#1e293b]">{t.sub}</p>
              </div>
            </div>
            <span className="font-bold text-[#64748b] text-sm">{t.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}