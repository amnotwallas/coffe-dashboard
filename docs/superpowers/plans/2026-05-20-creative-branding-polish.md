# Creative Branding & UX Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Login, Sidebar, and core UI components into the "Casa Chill Glass" premium aesthetic.

**Architecture:** Use high-blur factors (`backdrop-blur-xl`), ultra-rounded corners (`rounded-[48px]`), and glass-layered effects.

**Tech Stack:** React, Tailwind CSS, Framer Motion, Lucide React.

---

### Task 1: LoginView Transformation (The Glass Portal)

**Files:**
- Modify: `src/app/components/auth/LoginView.tsx`

- [ ] **Step 1: Redesign Background and Card**
  Use a premium gradient and an ultra-glass card.

```tsx
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF9F2] via-[#F5EDE4] to-[#A78D7B]/20 p-4 font-sans relative overflow-hidden">
  {/* Abstract Glass Background Elements */}
  <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#A78D7B]/10 rounded-full blur-[120px]" />
  <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#482C20]/5 rounded-full blur-[120px]" />

  <Card className="w-full max-w-md border border-white/40 bg-white/40 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(72,44,32,0.1)] rounded-[48px] overflow-hidden relative z-10">
    <div className="h-1.5 bg-gradient-to-r from-[#A78D7B] to-[#482C20] opacity-50" />
    <CardHeader className="space-y-2 flex flex-col items-center pt-10 pb-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/60 backdrop-blur-md p-5 rounded-[24px] mb-4 shadow-sm border border-white/40"
      >
        <Coffee className="w-12 h-12 text-[#482C20]" />
      </motion.div>
      <CardTitle className="text-4xl font-black text-[#482C20] tracking-tighter text-center">
        Casa Chill
      </CardTitle>
      <CardDescription className="text-[#A78D7B] font-bold uppercase tracking-[0.2em] text-[10px]">
        Panel de Administración
      </CardDescription>
    </CardHeader>
    {/* Form with glass inputs... */}
  </Card>
</div>
```

- [ ] **Step 2: Update Form Inputs to Glass Style**

```tsx
<Input 
  className="pl-11 h-12 border-white/40 bg-white/40 backdrop-blur-md focus:bg-white/60 transition-all rounded-2xl placeholder:text-muted-foreground/50"
  // ...props
/>
```

---

### Task 2: Sidebar & Layout Polish (Translucent Navigation)

**Files:**
- Modify: `src/app/components/Layout.tsx`

- [ ] **Step 1: Make Sidebar Translucent**
  Adjust the sidebar background and blur.

```tsx
<aside className="w-[240px] shrink-0 bg-[#2C3639]/95 backdrop-blur-lg flex flex-col h-screen sticky top-0 border-r border-white/5">
```

- [ ] **Step 2: Refine Navigation Pills**
  Use a glass effect for the active state.

```tsx
// Inside navItems map
isActive
  ? 'bg-white/10 text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-md'
  : 'text-sidebar-foreground/40 hover:bg-white/5 hover:text-sidebar-foreground/70'
```

---

### Task 3: Global UI Polish (Dialogs & Buttons)

**Files:**
- Modify: `src/app/components/catalog/CatalogView.tsx` (Dialog part)
- Modify: `src/app/components/ui/button.tsx` (Variants)

- [ ] **Step 1: Redesign Dialogs as Glass Layers**

```tsx
<Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[48px] p-10 w-full max-w-2xl z-50 shadow-2xl">
```

- [ ] **Step 2: Add Micro-interactions to Buttons**
  Add a subtle scale effect to all buttons.

```tsx
// button.tsx
const buttonVariants = cva(
  "inline-flex ... active:scale-95 transition-all duration-200",
  // ...
)
```
