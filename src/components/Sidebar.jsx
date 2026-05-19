import { useState } from "react";
import { FaHome, FaBed, FaUserFriends, FaSignOutAlt, FaSignInAlt, FaBan, FaBox, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // STATE UNTUK DROPDOWN HOME
  // Default true agar langsung terbuka (bisa diset false jika ingin tertutup di awal)
  const [isHomeOpen, setIsHomeOpen] = useState(true);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const handleAuthAction = () => {
      if (isLoggedIn) {
          localStorage.removeItem("isLoggedIn");
          window.location.href = "/"; 
      } else {
          navigate("/login"); 
      }
  };

  const menuClass = ({ isActive }) =>
    `flex cursor-pointer items-center rounded-xl p-4 space-x-3 transition-all font-medium
    ${isActive ? "text-white bg-[#f97316] shadow-md shadow-orange-200" : "text-gray-500 hover:text-orange-500 hover:bg-orange-50"}`;

  // Mengecek apakah kita sedang berada di halaman "/" atau "/sales"
  const isHomeActive = location.pathname === '/' || location.pathname === '/sales';

  return (
    <div id="sidebar" className="flex flex-col w-64 h-[calc(100vh-32px)] sticky top-4 bg-white m-4 rounded-[32px] shadow-sm p-4">
      
      <div id="sidebar-logo" className="flex items-center gap-3 mb-10 px-4 pt-6">
        <div className="w-10 h-10 rounded-full border-[3px] border-[#FF8E29] flex items-center justify-center relative">
            <div className="w-5 h-1.5 bg-[#FF8E29] rounded-full absolute -ml-1"></div>
            <div className="w-3 h-1.5 bg-[#FF8E29] rounded-full absolute mt-4 -ml-3"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Capella</h1>
      </div>

      <div id="sidebar-menu" className="flex-1 overflow-y-auto px-2">
        <ul id="menu-list" className="space-y-2">
          
          {/* MENU DROPDOWN HOME (Sesuai Gambar) */}
          <li className={`rounded-xl overflow-hidden transition-all ${isHomeActive || isHomeOpen ? "bg-[#f97316] shadow-md shadow-orange-200 text-white" : ""}`}>
            <div 
              onClick={() => setIsHomeOpen(!isHomeOpen)}
              className={`flex justify-between items-center cursor-pointer p-4 transition-all font-medium ${!(isHomeActive || isHomeOpen) ? "text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl" : ""}`}
            >
              <div className="flex items-center gap-3">
                <FaHome className="text-xl" />
                <span>Home</span>
              </div>
              {isHomeOpen ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
            </div>
            
            {/* Isi Dropdown: Dashboard & Sales */}
            {isHomeOpen && (
              <div className="flex flex-col pb-3 border-t border-orange-400/50">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => `pl-[52px] py-2.5 mt-2 pr-4 font-medium block transition-colors ${isActive ? "text-white" : "text-orange-200 hover:text-white"}`}
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/sales" 
                  className={({ isActive }) => `pl-[52px] py-2.5 pr-4 font-medium block transition-colors ${isActive ? "text-white" : "text-orange-200 hover:text-white"}`}
                >
                  Sales
                </NavLink>
              </div>
            )}
          </li>

          <li><NavLink to="/bookings" className={menuClass}><FaBed className="text-xl" /> <span>Bookings</span></NavLink></li>
          <li><NavLink to="/guests" className={menuClass}><FaUserFriends className="text-xl" /> <span>Guests</span></NavLink></li>
          <li><NavLink to="/inventory" className={menuClass}><FaBox className="text-xl" /> <span>Inventory</span></NavLink></li>
          
          <li className="mt-8 pt-6 border-t border-gray-100">
            <span className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Error Pages</span>
          </li>
          <li><NavLink to="/error-400" className={menuClass}><FaBan className="text-xl" /> <span>Error 400</span></NavLink></li>
          <li><NavLink to="/error-401" className={menuClass}><FaBan className="text-xl" /> <span>Error 401</span></NavLink></li>
          <li><NavLink to="/error-403" className={menuClass}><FaBan className="text-xl" /> <span>Error 403</span></NavLink></li>
        </ul>
      </div>

      <div id="sidebar-footer" className="mt-auto px-2 pb-4">
          <button onClick={handleAuthAction} className="flex items-center gap-3 text-[#FF8E29] font-bold hover:text-orange-700 p-4 w-full rounded-xl hover:bg-orange-50 transition-all">
              {isLoggedIn ? (
                  <><FaSignOutAlt className="text-xl" /><span>Logout</span></>
              ) : (
                  <><FaSignInAlt className="text-xl" /><span>Login</span></>
              )}
          </button>
      </div>
    </div>
  );
}