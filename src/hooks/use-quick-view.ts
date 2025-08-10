import { create } from 'zustand';
import { Prisma } from '@prisma/client';

// Define the type for a product with its variants included
type ProductWithVariants = Prisma.ProductGetPayload<{
  include: { variants: true };
}>;

// Define the state and actions for our quick view store
interface QuickViewState {
  isOpen: boolean;
  product: ProductWithVariants | null;
  open: (product: ProductWithVariants) => void;
  close: () => void;
}

export const useQuickView = create<QuickViewState>((set) => ({
  isOpen: false,
  product: null,
  open: (product) => set({ product, isOpen: true }),
  close: () => set({ isOpen: false, product: null }),
}));