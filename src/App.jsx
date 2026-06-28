import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";

// Mengimport Halaman-Halaman
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const MemberPortal = React.lazy(() => import("./pages/MemberPortal")); // TAMBAHAN: Halaman Member
const Rewards = React.lazy(() => import("./pages/Rewards")); // TAMBAHAN: Halaman Penukaran Poin
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Sales = React.lazy(() => import("./pages/Sales")); 
const Bookings = React.lazy(() => import("./pages/Bookings"));
const Guests = React.lazy(() => import("./pages/Guests"));
const Inventory = React.lazy(() => import("./pages/Inventory"));
const InventoryDetail = React.lazy(() => import("./pages/InventoryDetail"));
const AdminReviews = React.lazy(() => import("./pages/AdminReviews"));
const Components = React.lazy(() => import("./pages/Components"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const MainLayout = React.lazy(() => import("./layout/MainLayout"));
const AuthLayout = React.lazy(() => import("./layout/AuthLayout"));
const ErrorPage = React.lazy(() => import("./pages/ErrorPage"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));
const Success = React.lazy(() => import("./pages/auth/Success"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        
        {/* --- RUTE GUEST (LANDING PAGE UMUM) --- */}
        {/* Tampil tanpa Sidebar Admin */}
        <Route path="/" element={<LandingPage />} /> 

        {/* --- RUTE MEMBER PORTAL --- */}
        {/* Halaman khusus pelanggan yang sudah login */}
        <Route path="/member-portal" element={<MemberPortal />} />
        <Route path="/rewards" element={<Rewards />} />

        {/* --- RUTE ADMIN (PAKAI SIDEBAR) --- */}
        <Route element={<MainLayout />}>
          {/* Dashboard sekarang pindah ke /dashboard, bukan / lagi */}
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/sales" element={<Sales />} /> 
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/:id" element={<InventoryDetail />} />
          <Route path="/reviews" element={<AdminReviews />} />
          <Route path="/components" element={<Components />} />

          {/* Rute Error Admin */}
          <Route path="/error-400" element={<ErrorPage code="400" title="BAD REQUEST" description="Oops! It Seems You Follow Backlink." />} />
          <Route path="/error-401" element={<ErrorPage code="401" title="UNAUTHORIZED" description="Maaf, kamu tidak punya izin ke ruangan ini." />} />
          <Route path="/error-403" element={<ErrorPage code="403" title="FORBIDDEN" description="Area khusus staff Elegent Hotel, kamu dilarang masuk." />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* --- RUTE AUTH (LOGIN/REGISTER) --- */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/success" element={<Success />} />
        </Route>
        
      </Routes>
     </Suspense>
  );
}

export default App;