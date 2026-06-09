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
    <div className="p-4 md:p-6 lg:p-8 bg-[#FFF4EA] min-h-screen font-poppins text-gray-800 overflow-x-hidden w-full">
      <div className="max-w-[1440px] mx-auto w-full">
        <PageHeader title="Dashboard" breadcrumb="Dashboard" />

        {/* 1. ROW STAT CARDS (4 Kotak) */}
        {/* PERBAIKAN: Gunakan xl:grid-cols-4. Di layar laptop biasa akan jadi 2x2 biar lega! */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 my-6 w-full">
          <DashStatCard icon={FaBed} title="Bookings" value="280" percent="+55%" bgColor="bg-[#24d29d]" />
          <DashStatCard icon={FaChartBar} title="Today Users" value="2000" percent="+8%" bgColor="bg-[#5bc8de]" />
          <DashStatCard icon={FaStore} title="Revenue" value="35k" percent="+2%" bgColor="bg-[#f97316]" />
          <DashStatCard icon={FaUserPlus} title="Followers" value="1800" percent="+35%" bgColor="bg-[#f95872]" />
        </div>

        {/* 2. ROW CHART & TRANSACTIONS */}
        {/* PERBAIKAN: Tambah min-w-0 agar elemen tidak memaksa mekar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 w-full">
          <div className="lg:col-span-2 w-full min-w-0 overflow-hidden">
            <StatisticsChart />
          </div>
          <div className="lg:col-span-1 w-full min-w-0 overflow-hidden">
            <Transactions />
          </div>
        </div>

        {/* 3. ROW TABLE, GROWTH & EARNING */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 w-full">
          <div className="lg:col-span-2 w-full min-w-0 overflow-hidden">
            <SaleByCountry />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-4 md:gap-6 w-full min-w-0 overflow-hidden">
            <GrowthCard />
            <EarningCard />
          </div>
        </div>
      </div>
    </div>
  );
}