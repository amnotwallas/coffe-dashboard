import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ShoppingBag, AlertTriangle, Users, Info, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface Notification {
  id: string;
  type: 'order' | 'inventory' | 'staff' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const typeConfig = {
  order: {
    icon: ShoppingBag,
    iconClass: 'text-blue-500',
    bgClass: 'bg-blue-50',
  },
  inventory: {
    icon: AlertTriangle,
    iconClass: 'text-amber-500',
    bgClass: 'bg-amber-50',
  },
  staff: {
    icon: Users,
    iconClass: 'text-purple-500',
    bgClass: 'bg-purple-50',
  },
  system: {
    icon: Info,
    iconClass: 'text-[#A78D7B]',
    bgClass: 'bg-[#f5ede4]',
  },
  support: {
    icon: Users,
    iconClass: 'text-purple-500',
    bgClass: 'bg-purple-50',
  },
};

interface NotificationPanelProps {
  onClose: () => void;
  onViewAll: () => void;
}

export function NotificationPanel({ onClose, onViewAll }: NotificationPanelProps) {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      setItems(data.map((n: any) => ({
        id: n.id,
        type: n.type as any,
        title: n.title,
        body: n.body,
        read: n.read,
        time: new Date(n.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
      })));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = items.filter(n => !n.read).length;

  const markAll = async () => {
    try {
      await api.markAllNotificationsRead();
      setItems(items.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const markOne = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setItems(items.map(n => (n.id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <motion.aside
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.14, ease: 'easeOut' }}
      className="fixed bg-card z-30 overflow-hidden"
      style={{
        right: '16px',
        top: '58px',
        width: '340px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 40px rgba(44, 54, 57, 0.12), 0 2px 8px rgba(44, 54, 57, 0.06)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-foreground" style={{ fontSize: '13px', fontWeight: 600 }}>
            Notificaciones
          </span>
          {unreadCount > 0 && (
            <span
              className="bg-[#482C20] text-[#FFF9F2] px-1.5 py-0.5 rounded-full"
              style={{ fontSize: '10px', fontWeight: 600 }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAll}
              className="text-[#A78D7B] hover:text-foreground transition-colors"
              style={{ fontSize: '11px' }}
            >
              Marcar leídas
            </button>
          )}
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X style={{ width: '15px', height: '15px' }} />
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
        {loading ? (
          <div className="px-4 py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#A78D7B]" />
            <p style={{ fontSize: '13px' }}>Cargando notificaciones...</p>
          </div>
        ) : items.filter(n => !n.read).length === 0 ? (
          <div className="px-4 py-12 text-center text-muted-foreground">
            <p style={{ fontSize: '13px' }}>No tienes notificaciones pendientes</p>
          </div>
        ) : (
          items
            .filter(n => !n.read)
            .map((item, index, filteredArray) => {
              const config = typeConfig[item.type as keyof typeof typeConfig] || typeConfig.system;
              const { icon: Icon, iconClass, bgClass } = config;
              const isLast = index === filteredArray.length - 1;
              return (
                <div
                  key={item.id}
                  onClick={() => markOne(item.id)}
                  className="flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30 bg-[#FFF9F2]"
                  style={!isLast ? { borderBottom: '1px solid var(--border)' } : undefined}
                >
                  <div
                    className={`${bgClass} flex items-center justify-center shrink-0`}
                    style={{ width: '32px', height: '32px', borderRadius: '8px', marginTop: '2px' }}
                  >
                    <Icon className={iconClass} style={{ width: '14px', height: '14px' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`leading-snug ${item.read ? 'text-muted-foreground' : 'text-foreground'}`}
                        style={{ fontSize: '12px', fontWeight: item.read ? 400 : 500 }}
                      >
                        {item.title}
                      </p>
                      {!item.read && (
                        <span
                          className="rounded-full bg-[#482C20] shrink-0"
                          style={{ width: '6px', height: '6px', marginTop: '5px' }}
                        />
                      )}
                    </div>
                    <p className="text-muted-foreground leading-snug mt-0.5" style={{ fontSize: '11px' }}>
                      {item.body}
                    </p>
                    <p className="text-muted-foreground/60 mt-1.5" style={{ fontSize: '10px' }}>
                      {item.time}
                    </p>
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2.5 bg-muted/20"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <button
          onClick={onViewAll}
          className="text-[#A78D7B] hover:text-foreground transition-colors w-full text-center"
          style={{ fontSize: '11px' }}
        >
          Ver todas las notificaciones
        </button>
      </div>
    </motion.aside>
  );
}
