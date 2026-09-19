import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import { LandingPage } from './pages/LandingPage';
import { PricingPage } from './pages/PricingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TradesPage } from './pages/TradesPage';
import { AddTradePage } from './pages/AddTradePage';
import { TradeDetailPage } from './pages/TradeDetailPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SetupAnalyticsPage } from './pages/SetupAnalyticsPage';
import { PsychologyPage } from './pages/PsychologyPage';
import { CalendarPage } from './pages/CalendarPage';
import { GoalsPage } from './pages/GoalsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-dark-bg text-dark-text">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Marketing Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* App Shell Routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/trades" element={<TradesPage />} />
              <Route path="/trades/new" element={<AddTradePage />} />
              <Route path="/trades/edit/:id" element={<AddTradePage isEdit={true} />} />
              <Route path="/trades/:id" element={<TradeDetailPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/setups" element={<SetupAnalyticsPage />} />
              <Route path="/psychology" element={<PsychologyPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
