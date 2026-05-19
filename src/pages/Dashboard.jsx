import { FaBed, FaChartBar, FaStore, FaUserPlus } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import DashStatCard from "../components/DashStatCard";
import StatisticsChart from "../components/StatisticsChart";
import Transactions from "../components/Transactions";
import SaleByCountry from "../components/SaleByCountry";
import GrowthCard from "../components/GrowthCard";
import EarningCard from "../components/EarningCard";

export default function Dashboard() {
  return (
    <div className="p-8 bg-[#FFF4EA] min-h-screen font-poppins text-gray-800">
      <PageHeader title="Dashboard" breadcrumb="Dashboard" />

      {/* 1. ROW STAT CARDS (4 Kotak) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
        <DashStatCard icon={FaBed} title="Bookings" value="280" percent="+55%" bgColor="bg-[#24d29d]" />
        <DashStatCard icon={FaChartBar} title="Today Users" value="2000" percent="+8%" bgColor="bg-[#5bc8de]" />
        <DashStatCard icon={FaStore} title="Revenue" value="35k" percent="+2%" bgColor="bg-[#f97316]" />
        <DashStatCard icon={FaUserPlus} title="Followers" value="1800" percent="+35%" bgColor="bg-[#f95872]" />
      </div>

      {/* 2. ROW CHART & TRANSACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <StatisticsChart />
        </div>
        <div className="lg:col-span-1">
          <Transactions />
        </div>
      </div>

      {/* 3. ROW TABLE, GROWTH & EARNING */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SaleByCountry />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <GrowthCard />
          <EarningCard />
        </div>
      </div>
      
    </div>
  );
}