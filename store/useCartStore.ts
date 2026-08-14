import { create } from "zustand";

export interface CartItem {
  /** `${beatId}:${licenseId}` — a beat can be in the cart under two licenses. */
  id: string;
  beatId: number;
  slug: string;
  title: string;
  art: number;
  licenseId: string;
  licenseName: string;
  price: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
  has: (id: string) => boolean;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      if (state.items.some((i) => i.id === item.id)) return state;
      return { items: [...state.items, item] };
    }),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, item) => sum + item.price, 0),
  has: (id) => get().items.some((i) => i.id === id),
}));

export const cartItemId = (beatId: number, licenseId: string) => `${beatId}:${licenseId}`;
