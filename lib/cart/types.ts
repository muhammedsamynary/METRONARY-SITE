/**
 * METRONARY Cart Data Architecture
 *
 * Designed to be hydration-safe, local-storage persistent, and fully compatible
 * with future database checkout & order persistence.
 */

export interface CartItem {
  /** Stable composite key: `${productId}-${variantId || size}` */
  id: string;
  /** Parent product ID */
  productId: string;
  /** Product slug for routing */
  slug: string;
  /** Working or official display title */
  displayName: string;
  /** Media thumbnail */
  thumbnail: string;
  /** Selected variant ID */
  variantId: string;
  /** Selected size label (e.g. S, M, L) */
  size: string;
  /** Quantity in bag */
  quantity: number;
  /** Unit price in commercial currency (null when unconfirmed) */
  unitPrice: number | null;
  /** Currency code (e.g. "EGP") */
  currency: string;
  /** Stock status at time of selection */
  stockStatus?: string;
  /** Maximum purchasable quantity if constrained by inventory */
  maxQuantity?: number | null;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface AddItemInput {
  productId: string;
  slug: string;
  displayName: string;
  thumbnail: string;
  variantId: string;
  size: string;
  quantity?: number;
  unitPrice?: number | null;
  currency?: string;
  stockStatus?: string;
  maxQuantity?: number | null;
}

export interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  uniqueItemCount: number;
  subtotal: number | null;
  isSubtotalCalculable: boolean;
  addItem: (input: AddItemInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}
