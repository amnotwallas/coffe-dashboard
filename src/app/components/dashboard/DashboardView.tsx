import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../ui/utils';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Coffee,
  Clock,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'motion/react';
import { api } from '../../services/api';

const statusConfig = {
  pending: { label: 'Pendiente', variant: 'outline' as const, className: 'bg-amber-50 text-amber-700 border-amber-200' },
  preparing: { label: 'Preparando', variant: 'outline' as const, className: 'bg-blue-50 text-blue-700 border-blue-200' },
  ready: { label: 'Listo', variant: 'outline' as const, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  delivered: { label: 'Entregado', variant: 'default' as const, className: '' },
};

const chartTooltipStyle = {
  backgroundColor: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  color: 'var(--foreground)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
  fontSize: '12px',
};

function DashboardSkeleton() {
  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-8 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="p-5 rounded-[32px]">
            <div className="flex items-start justify-between mb-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-[34px] w-[34px] rounded-lg" />
            </div>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {[1, 2].map(i => (
          <Card key={i} className="rounded-[32px]">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[240px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[32px]">
        <div className="px-6 py-4 border-b border-border">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}

export function DashboardView() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0,
  });
  const [salesData, setSalesData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsData, ordersData] = await Promise.all([
        api.getAnalytics(),
        api.getOrders()
      ]);

      setStats(prev => ({
        ...prev,
        revenue: analyticsData.ventasHoy ?? 0,
        orders: analyticsData.pedidosPendientes ?? 0,
        customers: analyticsData.clientesTotales ?? 0,
        products: analyticsData.productosTotales ?? 0,
      }));

      if (analyticsData.ventasSemanales) {
        setSalesData(analyticsData.ventasSemanales);
      }

      if (analyticsData.productosPopulares) {
        setTopProducts(analyticsData.productosPopulares.map((p: any) => ({
          name: p.nombre ?? 'Sin nombre',
          cantidad: p.ventas ?? 0
        })));
      }

      // Process orders: take 5 most recent and map fields
      const processedOrders = (ordersData || [])
        .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 5)
        .map((order: any) => ({
          id: order.id, // Keep full ID for React key
          displayId: order.id.split('-')[0].toUpperCase(),
          customer: order.customerName || `Cliente ${order.user_id.split('-')[0]}`,
          items: Array.isArray(order.items) 
            ? order.items.map((i: any) => `${i.nombre} x${i.cantidad}`).join(', ')
            : (order.items || 'N/A'),
          total: order.total || 0,
          status: (statusConfig[order.status as keyof typeof statusConfig] ? order.status : 'pending') as keyof typeof statusConfig,
          time: order.fecha ? new Date(order.fecha).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }) : '--:--'
        }));
      
      setRecentOrders(processedOrders);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError('No se pudo conectar con el servidor de analíticas. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && stats.revenue === 0) {
    return <DashboardSkeleton />;
  }

  const statCards = [
    {
      title: 'Ingresos Hoy',
      value: `$${(stats.revenue ?? 0).toLocaleString()}`,
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      accentColor: '#10b981',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Pedidos',
      value: (stats.orders ?? 0).toString(),
      change: '+8.2%',
      isPositive: true,
      icon: ShoppingCart,
      accentColor: '#3b82f6',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Clientes',
      value: (stats.customers ?? 0).toString(),
      change: '+5.3%',
      isPositive: true,
      icon: Users,
      accentColor: '#8b5cf6',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Productos',
      value: (stats.products ?? 0).toString(),
      change: '0%',
      isPositive: true,
      icon: Coffee,
      accentColor: '#f59e0b',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#482C20] tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1 font-medium">Resumen de actividad en tiempo real</p>
          </div>
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-white/20 shadow-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 text-muted-foreground" style={{ fontSize: '12px' }}>
              <Clock className="w-4 h-4 text-[#A78D7B]" />
              <span className="font-medium whitespace-nowrap">Actualizado {lastUpdated.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            <button 
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#A78D7B] hover:bg-[#8B735B] text-white rounded-xl transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-50"
              title="Refrescar datos"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-bold">Refrescar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">Error:</span>
            <span>{error}</span>
          </div>
          <button onClick={fetchData} className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded-md transition-colors font-medium">
            Reintentar
          </button>
        </motion.div>
      )}

      {/* KPI Cards (Symmetric Glass Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
            >
              <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/20 bg-card/80 backdrop-blur-md rounded-[32px] group p-6">
                {/* Colored accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: stat.accentColor }}
                />
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <p className="text-muted-foreground uppercase tracking-[0.15em] font-bold text-[10px]">
                      {stat.title}
                    </p>
                    <div
                      className={`${stat.iconBg} ${stat.iconColor} flex items-center justify-center rounded-xl shadow-sm group-hover:scale-110 transition-transform w-9 h-9`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                  </div>

                  <div>
                    <motion.h2
                      key={stat.value}
                      initial={{ scale: 1.04 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-[#482C20] font-serif text-4xl leading-none tracking-tighter mb-3"
                    >
                      {stat.value}
                    </motion.h2>
                    <div className="flex items-center gap-2 bg-white/40 w-fit px-2.5 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                      {stat.isPositive ? (
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span
                        className={stat.isPositive ? 'text-emerald-600' : 'text-red-500'}
                        style={{ fontSize: '11px', fontWeight: 700 }}
                      >
                        {stat.change}
                      </span>
                      <span className="text-muted-foreground/60 font-medium" style={{ fontSize: '10px' }}>vs ayer</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Weekly Sales - Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
        >
          <Card className="rounded-[32px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Ventas de la Semana
                  <Badge variant="outline" className="text-[10px] py-0 h-4 bg-muted/30 text-muted-foreground border-muted font-normal">
                    DEMO
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-1 text-emerald-600" style={{ fontSize: '12px' }}>
                  <ArrowUpRight style={{ width: '13px', height: '13px' }} />
                  <span style={{ fontWeight: 500 }}>+18% esta semana</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={salesData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A78D7B" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#A78D7B" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} />
                  <Area
                    type="monotone"
                    dataKey="ventas"
                    stroke="#A78D7B"
                    strokeWidth={2}
                    fill="url(#salesGradient)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#A78D7B', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.3 }}
        >
          <Card className="rounded-[32px]">
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={topProducts} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'var(--muted)', opacity: 0.5 }} />
                  <Bar dataKey="cantidad" fill="#A78D7B" radius={[5, 5, 0, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <Card className="p-0 rounded-[32px] overflow-hidden">
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <CardTitle>Pedidos Recientes</CardTitle>
              <button
                className="text-[#A78D7B] hover:text-foreground transition-colors"
                style={{ fontSize: '12px' }}
              >
                Ver todos
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div
            className="grid px-6 py-2.5 bg-muted/40"
            style={{ gridTemplateColumns: '1fr 1.4fr 2fr 80px 100px 60px', gap: '12px', fontSize: '11px', fontWeight: 600 }}
          >
            <span className="text-muted-foreground uppercase tracking-wide">Pedido</span>
            <span className="text-muted-foreground uppercase tracking-wide">Cliente</span>
            <span className="text-muted-foreground uppercase tracking-wide">Items</span>
            <span className="text-muted-foreground uppercase tracking-wide text-right">Total</span>
            <span className="text-muted-foreground uppercase tracking-wide">Estado</span>
            <span className="text-muted-foreground uppercase tracking-wide text-right">Hora</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-border/60">
            {recentOrders.map(order => {
              const sc = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
              return (
                <div
                  key={order.id}
                  className="grid px-6 py-3.5 hover:bg-muted/20 transition-colors items-center"
                  style={{ gridTemplateColumns: '1fr 1.4fr 2fr 80px 100px 60px', gap: '12px' }}
                >
                  <span className="text-foreground" style={{ fontSize: '12px', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                    {order.displayId}
                  </span>
                  <span className="text-foreground" style={{ fontSize: '12px' }}>{order.customer}</span>
                  <span className="text-muted-foreground truncate" style={{ fontSize: '12px' }}>{order.items}</span>
                  <span className="text-foreground text-right" style={{ fontSize: '12px', fontWeight: 600 }}>
                    ${(order.total ?? 0).toFixed(2)}
                  </span>
                  <div>
                    <Badge variant={sc.variant} className={cn("text-xs", sc.className)}>{sc.label}</Badge>
                  </div>
                  <span className="text-muted-foreground text-right" style={{ fontSize: '11px' }}>{order.time}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
