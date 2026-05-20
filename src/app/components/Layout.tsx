import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Coffee, Bell, Search, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationPanel } from './notifications/NotificationPanel';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { toast } from 'sonner';

type View = 'dashboard' | 'catalog' | 'orders' | 'notifications';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const lastNotifId = useRef<string | null>(null);

  // Poll for notifications every 30 seconds
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const data = await api.getNotifications();
        const unread = data.filter((n: any) => !n.read);
        setUnreadCount(unread.length);

        // If there are new notifications, show a toast
        if (data.length > 0) {
          const latest = data[0];
          if (lastNotifId.current && latest.id !== lastNotifId.current && !latest.read) {
            toast.info(latest.title, {
              description: latest.body,
              action: {
                label: 'Ver',
                onClick: () => {
                  setNotificationsOpen(true);
                  onViewChange('notifications');
                }
              }
            });
          }
          lastNotifId.current = latest.id;
        }
      } catch (error) {
        console.error('Error polling notifications:', error);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard' as const, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'catalog' as const, icon: Package, label: 'Catálogo' },
    { id: 'orders' as const, icon: ShoppingBag, label: 'Pedidos', badge: 2 },
  ];

  const viewTitles: Record<View, string> = {
    dashboard: 'Dashboard',
    catalog: 'Catálogo de Productos',
    orders: 'Gestión de Pedidos',
    notifications: 'Centro de Notificaciones',
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 bg-[#2C3639]/95 backdrop-blur-lg flex flex-col h-screen sticky top-0 border-r border-white/5">
        {/* Brand */}
        <div className="h-14 px-4 flex items-center" style={{ borderBottom: '1px solid rgba(255,249,242,0.08)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#A78D7B] flex items-center justify-center shrink-0">
              <Coffee className="text-white" style={{ width: '14px', height: '14px' }} />
            </div>
            <div>
              <p className="text-sidebar-foreground leading-none mb-[3px]" style={{ fontSize: '13px', fontWeight: 600 }}>Casa Chill</p>
              <p className="text-sidebar-foreground/40 leading-none" style={{ fontSize: '10px' }}>& Coffee</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          <p className="px-2 mb-2 text-sidebar-foreground/25 uppercase tracking-widest" style={{ fontSize: '9px', fontWeight: 700 }}>
            Principal
          </p>
          <ul className="space-y-[2px]">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-all duration-150 relative ${
                      isActive
                        ? 'bg-white/10 text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-md'
                        : 'text-sidebar-foreground/40 hover:bg-white/5 hover:text-sidebar-foreground/70'
                    }`}
                    style={{ fontSize: '13px' }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navPill"
                        className="absolute left-0 bg-[#A78D7B] rounded-r-full"
                        style={{ top: '6px', bottom: '6px', width: '3px' }}
                      />
                    )}
                    <Icon
                      className={`shrink-0 ${isActive ? 'text-[#A78D7B]' : ''}`}
                      style={{ width: '15px', height: '15px' }}
                    />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge ? (
                      <span
                        className="bg-[#A78D7B]/25 text-[#A78D7B] px-1.5 py-0.5 rounded-full"
                        style={{ fontSize: '10px', fontWeight: 600 }}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </motion.button>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,249,242,0.06)' }}>
            <p className="px-2 mb-2 text-sidebar-foreground/25 uppercase tracking-widest" style={{ fontSize: '9px', fontWeight: 700 }}>
              Sistema
            </p>
            <button
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sidebar-foreground/40 hover:bg-white/5 hover:text-sidebar-foreground/70 transition-all duration-150"
              style={{ fontSize: '13px' }}
            >
              <Settings className="shrink-0" style={{ width: '15px', height: '15px' }} />
              <span>Configuración</span>
            </button>
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sidebar-foreground/40 hover:bg-white/5 hover:text-sidebar-foreground/70 transition-all duration-150"
              style={{ fontSize: '13px' }}
            >
              <LogOut className="shrink-0 text-destructive/70" style={{ width: '15px', height: '15px' }} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-2" style={{ borderTop: '1px solid rgba(255,249,242,0.08)' }}>
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors">
            <div
              className="rounded-full bg-[#A78D7B]/20 border border-[#A78D7B]/40 flex items-center justify-center shrink-0"
              style={{ width: '28px', height: '28px' }}
            >
              <span className="text-[#A78D7B]" style={{ fontSize: '11px', fontWeight: 600 }}>
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground/80 truncate leading-none mb-[3px]" style={{ fontSize: '12px', fontWeight: 500 }}>
                Administrador
              </p>
              <p className="text-sidebar-foreground/35 truncate leading-none" style={{ fontSize: '10px' }}>
                {user?.email || 'admin@casachill.co'}
              </p>
            </div>
          </div>
        </div>
      </aside>


      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header
          className="h-14 bg-card flex items-center px-6 gap-4 shrink-0 sticky top-0 z-10"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <span className="flex-1 text-foreground" style={{ fontSize: '13px', fontWeight: 600 }}>
            {viewTitles[currentView]}
          </span>

          {/* Search */}
          <div
            className="hidden sm:flex items-center gap-1.5 bg-muted rounded-lg px-3 text-muted-foreground w-44 cursor-text"
            style={{ height: '32px', fontSize: '12px', border: '1px solid var(--border)' }}
          >
            <Search className="shrink-0" style={{ width: '12px', height: '12px' }} />
            <span>Buscar...</span>
          </div>

          {/* Bell */}
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`relative rounded-lg flex items-center justify-center transition-colors ${
              notificationsOpen || currentView === 'notifications' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            style={{ width: '32px', height: '32px' }}
          >
            <Bell style={{ width: '15px', height: '15px' }} />
            {unreadCount > 0 && (
              <span
                className="absolute rounded-full bg-destructive border-card flex items-center justify-center text-white"
                style={{ 
                  top: '4px', 
                  right: '4px', 
                  width: '14px', 
                  height: '14px', 
                  borderWidth: '1.5px',
                  fontSize: '8px',
                  fontWeight: 700
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Avatar */}
          <div
            className="rounded-full bg-[#A78D7B] flex items-center justify-center cursor-pointer"
            style={{ width: '32px', height: '32px' }}
          >
            <span className="text-white" style={{ fontSize: '11px', fontWeight: 600 }}>A</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-12">
          {children}
        </main>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {notificationsOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setNotificationsOpen(false)} />
            <NotificationPanel 
              onClose={() => setNotificationsOpen(false)} 
              onViewAll={() => {
                onViewChange('notifications');
                setNotificationsOpen(false);
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
