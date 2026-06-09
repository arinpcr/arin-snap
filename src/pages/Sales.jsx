import { FaTag, FaShoppingCart, FaDollarSign } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import VisitorChart from "../components/VisitorChart";
import TopSelling from "../components/TopSelling";
import NewCustomers from "../components/NewCustomers";
import BuyersProfile from "../components/BuyersProfile";

export default function Sales() {
  return (
    <div className="p-4 md:p-6 lg:p-8 bg-transparent font-poppins text-gray-800 overflow-x-hidden w-full">
      
      <div className="max-w-[1440px] mx-auto w-full">
        <PageHeader title="Sales" breadcrumb="Dashboard Overview" />

        {/* 1. ROW STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 my-6 w-full">
          {/* Kita asumsikan StatCard akan mengikuti grid, pastikan di dalam StatCard.jsx ada flex-wrap jika teks kepanjangan */}
          <StatCard 
            icon={FaTag} 
            title="Sales" 
            value="$230,220" 
            date="May 2022" 
            percent="+55%" 
            bgColor="bg-[#24d29d]" 
          />
          <StatCard 
            icon={FaShoppingCart} 
            title="Customers" 
            value="3,200" 
            date="May 2022" 
            percent="+12%" 
            bgColor="bg-[#5bc8de]" 
          />
          <StatCard 
            icon={FaDollarSign} 
            title="Avg Revenue" 
            value="$2,300" 
            date="May 2022" 
            percent="+210%" 
            bgColor="bg-[#f95872]" 
          />
        </div>

        {/* 2. ROW CHART & VISITORS */}
        {/* PERBAIKAN: Tambahkan min-w-0 di setiap lg:col-span agar elemen dalamnya bisa mengecil saat di-zoom */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 w-full">
          <div className="lg:col-span-2 w-full min-w-0 overflow-hidden">
            <RevenueChart />
          </div>
          <div className="lg:col-span-1 w-full min-w-0 overflow-hidden">
            <VisitorChart />
          </div>
        </div>

        {/* 3. ROW TABLE & CUSTOMERS */}
        {/* PERBAIKAN: Tambahkan min-w-0 di setiap lg:col-span */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 w-full">
          <div className="lg:col-span-2 w-full min-w-0 overflow-hidden">
            <TopSelling />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-4 md:gap-6 w-full min-w-0 overflow-hidden">
            <NewCustomers />
            <BuyersProfile />
          </div>
        </div>
      </div>

    </div>
  );
}