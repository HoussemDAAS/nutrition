import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Produit } from './sanity.types';
export interface CartProduit extends Produit {
  selectedFlavor?: string;
}
interface CartItem {
  product: CartProduit;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (productWithFlavor: CartProduit) => void;
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
      addItem: (productWithFlavor) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => 
              item.product._id === productWithFlavor._id &&
              item.product.selectedFlavor === productWithFlavor.selectedFlavor
          );
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === productWithFlavor._id &&
                item.product.selectedFlavor === productWithFlavor.selectedFlavor
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return { 
              items: [...state.items, { 
                product: productWithFlavor, 
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
