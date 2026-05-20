import { useState } from 'react';
import { Layout } from './components/Layout';
import { DashboardView } from './components/dashboard/DashboardView';
import { CatalogView } from './components/catalog/CatalogView';
import { OrdersView } from './components/orders/OrdersView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginView } from './components/auth/LoginView';
import { Toaster } from './components/ui/sonner';
import { motion } from 'motion/react';
import { Coffee } from 'lucide-react';

type View = 'dashboard' | 'catalog' | 'orders' | 'notifications';

function MainFlow() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F6F2]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center gap-5"
        >
          {/* Logo Container */}
          <div className="relative">
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut"
              }}
              className="w-20 h-20 rounded-[24px] bg-[#A78D7B] flex items-center justify-center shadow-xl shadow-[#A78D7B]/20 relative z-10"
            >
              <Coffee className="text-white w-10 h-10" />
            </motion.div>
            {/* Soft pulse behind logo */}
            <motion.div 
              animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0, 0.1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-[#A78D7B] rounded-[24px] -z-0"
            />
          </div>

          <div className="flex flex-col items-center">
            <motion.h1 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[#482C20] font-bold text-2xl tracking-tight"
            >
              Casa Chill
            </motion.h1>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[#A78D7B] text-[10px] font-bold uppercase tracking-[0.3em] -mt-1"
            >
              Coffee & Bakery Admin
            </motion.p>
          </div>

          {/* Elegant Loading Bar */}
          <div className="w-40 h-[3px] bg-[#A78D7B]/10 rounded-full overflow-hidden mt-2">
            <motion.div 
              className="h-full bg-[#A78D7B]"
              animate={{ 
                x: [-160, 160],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.8, 
                ease: "easeInOut" 
              }}
              style={{ width: '40%' }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'catalog' && <CatalogView />}
        {currentView === 'orders' && <OrdersView />}
        {currentView === 'notifications' && <NotificationsView />}
      </motion.div>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainFlow />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
