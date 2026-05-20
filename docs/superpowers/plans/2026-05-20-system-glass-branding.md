# Casa Chill Glass & High Density Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Catalog for high density (4-5 columns) and apply "Casa Chill Glass" branding system-wide (Dashboard, Orders, Notifications).

**Architecture:** Use Glassmorphism (backdrop-blur + traslúcido) for components, adjust Grid layouts for density, and move metadata to overlays.

**Tech Stack:** React, Tailwind CSS, Lucide React, Framer Motion.

---

### Task 1: Catalog Redesign (High Density + Glass)

**Files:**
- Modify: `src/app/components/catalog/CatalogView.tsx`

- [ ] **Step 1: Update Grid Layout and Card Structure**
  Change the grid to support more columns and reduce gaps.
  
```tsx
// Around line 220
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
```

- [ ] **Step 2: Redesign Card with Glassmorphism and Overlays**
  Apply `bg-card/80 backdrop-blur-md` and move Category/Rating to overlays.

```tsx
<Card className="overflow-hidden border border-white/20 bg-card/80 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-500 rounded-[32px] group relative">
  {/* Image Section */}
  <div className="relative aspect-square overflow-hidden m-3 rounded-[24px]">
    <img 
      src={product.imagenes[0]} 
      alt={product.nombre}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    {/* Glass Overlays */}
    <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-white/40 backdrop-blur-md border border-white/20">
      <span className="text-[9px] font-black text-[#482C20] uppercase tracking-wider">
        {product.categoria.nombre}
      </span>
    </div>
    <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-white/40 backdrop-blur-md border border-white/20 flex items-center gap-1">
      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
      <span className="text-[10px] font-black text-[#482C20]">{product.rating_avg}</span>
    </div>
    
    {/* Hover Actions */}
    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
      <Button 
        variant="secondary" 
        size="icon"
        className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-[#482C20] border-none shadow-lg"
        onClick={(e) => { e.stopPropagation(); handleOpenDialog(product); }}
      >
        <Edit2 className="w-4 h-4" />
      </Button>
      <Button 
        variant="destructive" 
        size="icon"
        className="w-9 h-9 rounded-full bg-red-500/80 backdrop-blur-sm hover:bg-red-500 text-white border-none shadow-lg"
        onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </div>

  {/* Content Section */}
  <div className="px-5 pb-5 pt-1">
    <div className="flex items-start justify-between gap-2 mb-2">
      <h3 className="text-[#482C20] font-black text-base leading-tight truncate">
        {product.nombre}
      </h3>
      <span className="text-lg font-black text-[#A78D7B] tracking-tighter">${product.precio.toFixed(0)}</span>
    </div>
    <p className="text-muted-foreground text-[11px] leading-snug mb-4 line-clamp-2 font-medium">
      {product.descripcion}
    </p>
    {/* Rest of the expandable logic... */}
  </div>
</Card>
```

- [ ] **Step 3: Commit Catalog Changes**

```bash
git add src/app/components/catalog/CatalogView.tsx
git commit -m "feat(catalog): implement high-density glass grid"
```

---

### Task 2: Dashboard Branding (Glass KPIs)

**Files:**
- Modify: `src/app/components/dashboard/DashboardView.tsx`

- [ ] **Step 1: Apply Glassmorphism to KPI Cards**
  Update the stat cards to use the glass style.

```tsx
// Inside statCards map
<Card className="relative overflow-hidden hover:shadow-md transition-shadow duration-200 border border-white/20 bg-card/80 backdrop-blur-md">
  {/* Colored accent bar */}
  <div
    className="absolute top-0 left-0 right-0"
    style={{ height: '2px', backgroundColor: stat.accentColor }}
  />
  {/* Content... */}
</Card>
```

- [ ] **Step 2: Commit Dashboard Changes**

```bash
git add src/app/components/dashboard/DashboardView.tsx
git commit -m "style(dashboard): apply glass branding to KPI cards"
```

---

### Task 3: Orders Branding (Glass Kanban)

**Files:**
- Modify: `src/app/components/orders/OrdersView.tsx`

- [ ] **Step 1: Apply Glass Style to Order Cards**
  Update the Kanban cards with traslúcido backgrounds.

```tsx
<Card
  className={`relative hover:shadow-md transition-all duration-300 overflow-hidden p-0 border border-white/20 bg-card/80 backdrop-blur-md ${
    isCritical ? 'bg-red-50/50 border-red-200' : 
    isDelayed ? 'bg-amber-50/30 border-amber-100' : ''
  }`}
>
  {/* Content... */}
</Card>
```

- [ ] **Step 2: Commit Orders Changes**

```bash
git add src/app/components/orders/OrdersView.tsx
git commit -m "style(orders): apply glass branding to order cards"
```

---

### Task 4: Notifications Branding (Glass List)

**Files:**
- Modify: `src/app/components/notifications/NotificationsView.tsx`

- [ ] **Step 1: Apply Glass Style to Notification Items**
  Update the notification items to feel like "glass layers".

```tsx
<motion.div 
  layout
  key={n.id}
  className={`p-6 flex gap-5 transition-colors hover:bg-muted/10 border-b border-border/50 ${
    !n.read ? 'bg-white/40 backdrop-blur-sm' : ''
  }`}
>
  {/* Content... */}
</motion.div>
```

- [ ] **Step 2: Commit Notifications Changes**

```bash
git add src/app/components/notifications/NotificationsView.tsx
git commit -m "style(notifications): apply glass branding to notification list"
```
