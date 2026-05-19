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
    <div className="bg-transparent font-poppins text-gray-800">
      <PageHeader title="Sales" breadcrumb="Dashboard Overview" />

      {/* 1. ROW STATISTIK */}
      <div className="grid md:grid-cols-3 gap-6 my-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <VisitorChart />
        </div>
      </div>

      {/* 3. ROW TABLE & CUSTOMERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopSelling />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <NewCustomers />
          <BuyersProfile />
        </div>
      </div>
    </div>
  );
}