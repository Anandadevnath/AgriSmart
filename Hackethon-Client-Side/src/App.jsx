import "./styles/App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroBanner from "./components/HeroBanner";
import FeaturesSection from "./components/FeaturesSection";
import StatsSection from "./components/StatsSection";
import LiveUpdatesSection from "./components/LiveUpdatesSection";
import HowItWorks from "./components/HowItWorks";
import TipsPreview from "./components/TipsPreview";
import CallToAction from "./components/CallToAction";
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Verify = lazy(() => import("./pages/Verify"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const ScanCrop = lazy(() => import("./pages/ScanCrop"));
const About = lazy(() => import("./pages/About"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Chat = lazy(() => import("./pages/Chat"));
const Prices = lazy(() => import("./pages/Prices"));
const Tips = lazy(() => import("./pages/Tips"));
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Toaster position="top-right" />
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-green-100 border-t-[#0b6b3a] animate-spin" />
              <span className="text-green-700 text-sm font-semibold">AgriSmart BD</span>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/scan-crop" element={<ScanCrop />} />
            <Route path="/about" element={<About />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/prices" element={<Prices />} />
            <Route path="/tips" element={<Tips />} />
            <Route
              path="/"
              element={
                <>
                  <HeroBanner />
                  <FeaturesSection />
                  <StatsSection />
                  <LiveUpdatesSection />
                  <HowItWorks />
                  <TipsPreview />
                  <CallToAction />
                </>
              }
            />
          </Routes>
        </Suspense>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
