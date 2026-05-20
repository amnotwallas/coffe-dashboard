import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/skeleton';
import { ShoppingBag, AlertTriangle, Users, Info, CheckCircle2, Clock, Filter, Trash2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../services/api';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'order' | 'inventory' | 'staff' | 'system';
  title: string;
  body: string;
  time: string;
  fullDate: string;
  read: boolean;
}

const typeConfig = {
  order: { icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Pedidos' },
  inventory: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Inventario' },
  staff: { icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Staff' },
  system: { icon: Info, color: 'text-[#A78D7B]', bg: 'bg-[#f5ede4]', label: 'Sistema' },
};

export function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      setNotifications(data.map((n: any) => ({
        id: n.id,
        type: n.type as any,
        title: n.title,
        body: n.body,
        read: n.read,
        time: new Date(n.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
        fullDate: new Date(n.created_at).toLocaleDateString('es', { day: '2-digit', month: 'long', year: 'numeric' })
      })));
    } catch (error) {
      toast.error('Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = notifications.filter(n => {
    const matchesFilter = filter === 'all' || (filter === 'unread' ? !n.read : n.read);
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         n.body.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const markRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      toast.error('No se pudo marcar como leída');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#482C20] tracking-tight">Centro de Notificaciones</h1>
            <p className="text-muted-foreground mt-1 font-medium">Gestiona el historial completo de alertas del sistema</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === 'all' ? 'bg-[#A78D7B] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              Todas
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === 'unread' ? 'bg-[#A78D7B] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              No leídas
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-0 overflow-hidden rounded-[32px] border border-white/20 bg-card/80 backdrop-blur-md">
          <div className="p-4 bg-muted/30 border-b border-border flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Buscar en notificaciones..."
                className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#A78D7B]/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="divide-y divide-border">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="p-6 flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="p-20 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <h3 className="text-lg font-medium text-[#482C20]">Sin resultados</h3>
                <p className="text-muted-foreground text-sm">No encontramos notificaciones que coincidan con tu búsqueda.</p>
              </div>
            ) : (
              filtered.map((n) => {
                const config = typeConfig[n.type] || typeConfig.system;
                const Icon = config.icon;
                return (
                  <motion.div 
                    layout
                    key={n.id}
                    className={`p-6 flex gap-5 transition-colors hover:bg-muted/10 border-b border-border/50 ${
                      !n.read ? 'bg-white/40 backdrop-blur-sm' : ''
                    }`}
                  >
                    <div className={`${config.bg} ${config.color} w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-semibold ${!n.read ? 'text-[#482C20]' : 'text-muted-foreground'}`}>
                            {n.title}
                          </h4>
                          {!n.read && <Badge className="bg-[#482C20] text-white text-[9px] px-1.5 py-0">NUEVO</Badge>}
                        </div>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {n.fullDate} • {n.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {n.body}
                      </p>
                      <div className="flex items-center gap-4">
                        {!n.read && (
                          <button 
                            onClick={() => markRead(n.id)}
                            className="text-xs font-bold text-[#A78D7B] hover:text-[#482C20] transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Marcar como leída
                          </button>
                        )}
                        <span className="text-[11px] font-medium text-muted-foreground/60 px-2 py-0.5 bg-muted rounded uppercase tracking-wider">
                          {config.label}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Just to avoid missing icons if Bell was not imported
function Bell(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
