# [Developer Agent Guidelines] Architecture & Implementation Standard

## 1. Project Setup Requirements
- Framework: Next.js 14+ App Router
- Styling: Tailwind CSS + `clsx` + `tailwind-merge`
- Icons: `lucide-react`
- State Management: `zustand`

## 2. Directory Structure Protocol
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── products/page.tsx
│   ├── products/[id]/page.tsx
│   └── cart/page.tsx
├── components/
│   ├── common/
│   ├── product/
│   └── cart/
├── store/
│   └── useCartStore.ts
└── types/
    └── index.ts
```

## 3. Code Generation Rules & Snippets

### Rule 1: Zustand Cart Store Example
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedOption?: string;
  isOverseas?: boolean;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart-storage' }
  )
);
```

### Rule 2: Clean Server vs Client Component Boundary
- Keep interactive elements like buttons, counters, inputs inside client components (`'use client'`).
- Layouts and static product listings should remain Server Components for fast SEO rendering.