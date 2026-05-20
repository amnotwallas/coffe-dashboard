import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Clock, ChefHat, CheckCircle2, Package, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../../services/api';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered';

interface OrderItem {
  product_id: string;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
  personalizaciones: Record<string, string>;
}

interface OrderTracking {
  preparando: boolean;
  listo: boolean;
  enCamino: boolean;
  entregado: boolean;
}

interface Order {
  id: string;
  user_id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  time: string;
  rawDate: Date;
  tracking: OrderTracking;
}

const columnAccents: Record<OrderStatus, { bar: string; dot: string; header: string }> = {
  pending: { bar: '#f59e0b', dot: 'bg-amber-400', header: 'bg-amber-400/8' },
  preparing: { bar: '#3b82f6', dot: 'bg-blue-400', header: 'bg-blue-400/8' },
  ready: { bar: '#10b981', dot: 'bg-emerald-400', header: 'bg-emerald-400/8' },
  delivered: { bar: '#94a3b8', dot: 'bg-slate-300', header: 'bg-slate-100/60' },
};

export function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  // Update current time every minute to refresh "elapsed time"
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await api.getOrders();
      const mappedOrders: Order[] = data.map((apiOrder: any) => {
        // Ensure date is treated as UTC if it doesn't have a timezone offset
        const dateStr = apiOrder.fecha.endsWith('Z') ? apiOrder.fecha : `${apiOrder.fecha}Z`;
        const dateObj = new Date(dateStr);
        
        return {
          id: apiOrder.id,
          user_id: apiOrder.user_id,
          customerName: apiOrder.customerName || `Cliente ${apiOrder.user_id.split('-')[0]}`,
          items: apiOrder.items.map((item: any) => ({
            product_id: item.product_id,
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio,
            subtotal: item.subtotal,
            personalizaciones: item.personalizaciones || {},
          })),
          total: apiOrder.total,
          status: apiOrder.status as OrderStatus,
          time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          rawDate: dateObj,
          tracking: apiOrder.tracking || { preparando: false, listo: false, enCamino: false, entregado: false },
        };
      });
      setOrders(mappedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const statusConfig: Record<OrderStatus, {
    label: string;
    variant: 'default' | 'secondary' | 'outline';
    icon: any;
    nextStatus?: OrderStatus;
    nextLabel?: string;
  }> = {
    pending: {
      label: 'Pendiente',
      variant: 'secondary',
      icon: Clock,
      nextStatus: 'preparing',
      nextLabel: 'Iniciar Preparación',
    },
    preparing: {
      label: 'Preparando',
      variant: 'outline',
      icon: ChefHat,
      nextStatus: 'ready',
      nextLabel: 'Marcar Listo',
    },
    ready: {
      label: 'Listo',
      variant: 'default',
      icon: CheckCircle2,
      nextStatus: 'delivered',
      nextLabel: 'Entregar',
    },
    delivered: {
      label: 'Entregado',
      variant: 'outline',
      icon: Package,
    },
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getOrdersByStatus = (status: OrderStatus) =>
    orders.filter(order => order.status === status);

  const getMinutesElapsed = (date: Date) => {
    const diff = now.getTime() - date.getTime();
    // Use Math.max to prevent negative numbers due to timezone/clock sync issues
    return Math.max(0, Math.floor(diff / 60000));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#482C20] tracking-tight">Gestión de Pedidos</h1>
            <p className="text-muted-foreground mt-1 font-medium">Administra el flujo de pedidos en tiempo real</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={fetchOrders}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {(['pending', 'preparing', 'ready', 'delivered'] as OrderStatus[]).map(status => {
          const config = statusConfig[status];
          const accent = columnAccents[status];
          const Icon = config.icon;
          const statusOrders = getOrdersByStatus(status);

          return (
            <div key={status} className="flex flex-col">
              {/* Column Header */}
              <div
                className="rounded-[24px] px-4 py-3 mb-3"
                style={{
                  border: '1px solid var(--border)',
                  borderTop: `2px solid ${accent.bar}`,
                  backgroundColor: 'var(--card)',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex items-center justify-center rounded-lg bg-muted"
                    style={{ width: '28px', height: '28px' }}
                  >
                    <Icon className="text-foreground/70" style={{ width: '13px', height: '13px' }} />
                  </div>
                  <span className="text-foreground" style={{ fontSize: '13px', fontWeight: 500 }}>
                    {config.label}
                  </span>
                  <div
                    className="ml-auto rounded-full flex items-center justify-center text-muted-foreground"
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'var(--muted)',
                      fontSize: '10px',
                      fontWeight: 600,
                    }}
                  >
                    {statusOrders.length}
                  </div>
                </div>
                <div className="mt-2.5 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(statusOrders.length / Math.max(orders.length, 1)) * 100}%`,
                      backgroundColor: accent.bar,
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>

              {/* Orders */}
              <div className="space-y-3 flex-1">
                {statusOrders.map((order, index) => {
                  const minutes = getMinutesElapsed(order.rawDate);
                  const isDelayed = (status === 'pending' && minutes > 5) || 
                                   (status === 'preparing' && minutes > 10);
                  const isCritical = (status === 'pending' && minutes > 10) || 
                                    (status === 'preparing' && minutes > 15);

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <Card
                        className={`relative hover:shadow-md transition-all duration-300 overflow-hidden p-0 border border-white/20 bg-card/80 backdrop-blur-md rounded-[32px] ${
                          isCritical ? 'bg-red-50/50 border-red-200' : 
                          isDelayed ? 'bg-amber-50/30 border-amber-100' : ''
                        }`}
                      >
                        {/* Left accent strip */}
                        <div
                          className="absolute left-0 top-3 bottom-3 rounded-r-full"
                          style={{ 
                            width: '3px', 
                            backgroundColor: isCritical ? '#ef4444' : isDelayed ? '#f59e0b' : accent.bar, 
                            opacity: 0.6 
                          }}
                        />
                        <div className="px-4 pt-3.5 pb-3 relative">
                          {/* Order header */}
                          <div className="flex items-start justify-between mb-2.5">
                            <div>
                              <p className="text-foreground" style={{ fontSize: '13px', fontWeight: 500 }}>
                                {order.customerName}
                              </p>
                              <p className="text-muted-foreground" style={{ fontSize: '11px' }}>{order.id.split('-')[0].toUpperCase()}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge variant={config.variant} className="text-[10px] h-5 px-1.5 shrink-0">
                                {config.label}
                              </Badge>
                              {status !== 'delivered' && (
                                <div className={`flex items-center gap-1 font-bold ${
                                  isCritical ? 'text-red-600' : isDelayed ? 'text-amber-600' : 'text-muted-foreground/60'
                                }`} style={{ fontSize: '10px' }}>
                                  <Clock style={{ width: '10px', height: '10px' }} />
                                  {minutes}m
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Items Enriquecidos */}
                          <div className="mb-4 space-y-3">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-[#482C20]/10 text-[#482C20] text-[10px] font-black w-5 h-5 rounded-md flex items-center justify-center">
                                      {item.cantidad}
                                    </span>
                                    <p className="text-[#482C20] font-bold text-[13px] leading-tight">
                                      {item.nombre}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Personalizaciones */}
                                {Object.keys(item.personalizaciones).length > 0 && (
                                  <div className="ml-7 flex flex-wrap gap-x-2 gap-y-1">
                                    {Object.entries(item.personalizaciones).map(([key, value]) => (
                                      <div key={key} className="flex items-center gap-1 text-[10px]">
                                        <span className="text-muted-foreground/40">•</span>
                                        <span className="text-muted-foreground font-medium">{key}:</span>
                                        <span className="text-[#A78D7B] font-bold">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Footer */}
                          <div
                            className="flex items-center justify-between pt-2.5"
                            style={{ borderTop: '1px solid var(--border)' }}
                          >
                            <div className="flex items-center gap-1.5">
                              {isCritical && (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, duration: 1 }}
                                >
                                  <AlertCircle className="text-red-500" style={{ width: '12px', height: '12px' }} />
                                </motion.div>
                              )}
                              <span className="text-muted-foreground" style={{ fontSize: '11px' }}>
                                {order.time}
                              </span>
                            </div>
                            <p className="text-primary" style={{ fontSize: '13px', fontWeight: 600 }}>
                              ${order.total.toFixed(2)}
                            </p>
                          </div>

                          {/* Action */}
                          {config.nextStatus && (
                            <Button
                              variant={isCritical ? "destructive" : "default"}
                              size="sm"
                              className="w-full mt-3 h-8 text-xs font-semibold"
                              onClick={() => handleStatusChange(order.id, config.nextStatus!)}
                            >
                              {config.nextLabel}
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}

                {!isLoading && statusOrders.length === 0 && (
                  <div className="text-center py-10">
                    <div
                      className="mx-auto mb-3 rounded-full bg-muted flex items-center justify-center"
                      style={{ width: '36px', height: '36px' }}
                    >
                      <Icon className="text-muted-foreground/40" style={{ width: '16px', height: '16px' }} />
                    </div>
                    <p className="text-muted-foreground" style={{ fontSize: '12px' }}>Sin pedidos</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
