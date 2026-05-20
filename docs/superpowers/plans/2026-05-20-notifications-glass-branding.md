# Notifications Branding (Glass List) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply glassmorphism branding to notification items in the dashboard.

**Architecture:** Update Tailwind classes on the notification item container (`motion.div`) to include backdrop blur and semi-transparent backgrounds for unread states.

**Tech Stack:** React, Tailwind CSS, Framer Motion.

---

### Task 1: Update NotificationsView Styles

**Files:**
- Modify: `src/app/components/notifications/NotificationsView.tsx`

- [x] **Step 1: Locate notification item container**

Search for the `motion.div` inside the `notifications.map` loop.

- [x] **Step 2: Apply glass styling classes**

Replace existing classes with the requested ones.

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

- [x] **Step 3: Verify changes**

Ensure the layout remains consistent and the new classes are correctly applied.
