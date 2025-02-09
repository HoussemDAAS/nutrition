/* eslint-disable @typescript-eslint/ban-ts-comment */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Produit } from './sanity.types';
import { CartProduit } from './types';
import toast from 'react-hot-toast';

export interface CartItem {
  product: CartProduit;
  quantity: number;
}


interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (product: Produit) => void;
  removeItem: (productId: string) => void;
  DeleteItem: (productId: string) => void;
clearCart: () => void;
getTotalPrice: () => number;
getSubTotalPrice: () => number;
getItemCount:(productId: string) => number;
getGroupedItems: () => CartItem[];
openCart: () => void; // Add this
closeCart: () => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set,get) => ({
      items: [],
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      // Update the addItem function in your cart store
addItem: (productWithFlavor) => {
  set((state) => {
    const normalizedProduct = {
      ...productWithFlavor,
      // Ensure slug is properly formatted
      slug: productWithFlavor.slug?.current || productWithFlavor.slug,
      // Preserve selected flavor when adding existing items
      selectedFlavor: productWithFlavor.selectedFlavor || 
        (productWithFlavor.gouts?.length === 1 ? productWithFlavor.gouts[0] : undefined)
    };

    const existingItem = state.items.find(item =>
      item.product._id === normalizedProduct._id &&
      item.product.selectedFlavor === normalizedProduct.selectedFlavor
    );

    // Check stock before adding
    if (existingItem && existingItem.quantity >= (normalizedProduct.stock || 0)) {
      toast.error('Quantité non disponible en stock');
      return state;
    }

    if (existingItem) {
      return {
        items: state.items.map(item =>
          item.product._id === normalizedProduct._id &&
          item.product.selectedFlavor === normalizedProduct.selectedFlavor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    } else {
      return { 
        items: [...state.items, { 
          product: normalizedProduct,
          quantity: 1 
        }] 
      };
    }
  });
},
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, []as CartItem[]),
                 

        })); // remove product from cart
      },
      DeleteItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        }));
      },
      
        clearCart: () => set({ items: [] }), // clear cart
        getTotalPrice: () => {
          const total = get().items.reduce((acc, item) => {
            return acc + (item.product.prix ?? 0) * item.quantity;
          }, 0);
          return total;
        },
        getSubTotalPrice: () => {
            const total = get().items.reduce((acc, item) => {
                const price=item.product.prix ?? 0;
                const discount = (item.product.remise ?? 0) * price / 100;
                const discountedPrice = price + discount;
                return acc + discountedPrice * item.quantity;

            }, 0);
            return total;
            },
            getItemCount: (productId) => {
              const item = get().items.find((item) => item.product._id === productId);
              return item?.quantity ?? 0;
            },
            getGroupedItems: () => get().items,

    }),
    { name: 'user-cart' }
  )
);

export default useCartStore;
