# System-Wide Aesthetic Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the aesthetics of all pages to match the "Casa Chill Glass" Catalog redesign, specifically focusing on border-radii (`rounded-[32px]`) and page header styles.

**Architecture:** Apply consistent Tailwind classes for headers and card radii across Dashboard, Orders, and Notifications.

**Tech Stack:** React, Tailwind CSS.

---

### Task 1: Dashboard Aesthetic Unification

**Files:**
- Modify: `src/app/components/dashboard/DashboardView.tsx`

- [ ] **Step 1: Standardize Page Header**
  Update the header to match the Catalog style.
  
```tsx
// Header section
<div className="flex flex-col gap-8 mb-12">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div>
      <h1 className="text-4xl font-black text-[#482C20] tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground mt-1 font-medium">Resumen de actividad en tiempo real</p>
    </div>
    {/* Keep the refresh button logic but styled consistently if needed */}
  </div>
</div>
```

- [ ] **Step 2: Update Card Radii**
  Change all `Card` components to use `rounded-[32px]`.

```tsx
// For KPI cards and Chart cards
<Card className="... rounded-[32px]">
```

---

### Task 2: Orders Aesthetic Unification

**Files:**
- Modify: `src/app/components/orders/OrdersView.tsx`

- [ ] **Step 1: Standardize Page Header**
  Update the header to match the Catalog style.

```tsx
<div className="flex flex-col gap-8 mb-12">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div>
      <h1 className="text-4xl font-black text-[#482C20] tracking-tight">Gestión de Pedidos</h1>
      <p className="text-muted-foreground mt-1 font-medium">Administra el flujo de pedidos en tiempo real</p>
    </div>
    {/* Keep Action button */}
  </div>
</div>
```

- [ ] **Step 2: Update Kanban and Card Radii**
  Update column headers to `rounded-[24px]` and cards to `rounded-[32px]`.

```tsx
// Column Header
<div className="rounded-[24px] px-4 py-3 mb-3" ...>

// Order Card
<Card className="... rounded-[32px]">
```

---

### Task 3: Notifications Aesthetic Unification

**Files:**
- Modify: `src/app/components/notifications/NotificationsView.tsx`

- [ ] **Step 1: Standardize Page Header**
  Update the header to match the Catalog style.

```tsx
<div className="flex flex-col gap-8 mb-12">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div>
      <h1 className="text-4xl font-black text-[#482C20] tracking-tight">Centro de Notificaciones</h1>
      <p className="text-muted-foreground mt-1 font-medium">Gestiona el historial completo de alertas del sistema</p>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Update Main Container Card Radius**
  Change the main card to `rounded-[32px]`.

```tsx
<Card className="p-0 overflow-hidden rounded-[32px] border border-white/20 bg-card/80 backdrop-blur-md">
```
