import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  addItem: (item) => set((state) => {
    if (state.items.find(i => i.id === item.id)) return state;
    return { items: [...state.items, item] };
  }),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, item) => sum + item.price, 0),
}));
