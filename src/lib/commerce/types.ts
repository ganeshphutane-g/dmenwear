/**
 * Commerce types — deliberately shaped to mirror the Shopify Storefront API
 * so the mock adapter can be swapped for a real @shopify/storefront adapter
 * with ZERO UI changes (premortem risk #2).
 *
 * Rules baked into the shapes:
 *  - Money is always { amount, currencyCode } — never a raw number.
 *  - ids are opaque GID strings.
 *  - variants are an option-matrix (selectedOptions + availableForSale).
 *  - cart cost/totals are OWNED by the adapter, never computed in components.
 */

export type CurrencyCode = "INR";

export interface Money {
  amount: string; // decimal string, e.g. "1499.00"
  currencyCode: CurrencyCode;
}

/** Image provenance is a launch gate: production may not ship `placeholder`. */
export type ImageProvenance = "commissioned" | "licensed" | "placeholder";

export interface ProductImage {
  url: string; // empty string allowed only when provenance === "placeholder"
  altText: string;
  width: number;
  height: number;
  provenance: ImageProvenance;
}

export interface SelectedOption {
  name: string; // "Size" | "Color"
  value: string; // "M" | "Blackout"
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string; // GID
  title: string;
  availableForSale: boolean;
  quantityAvailable: number;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
}

export interface ReviewSummary {
  count: number; // honest — may be small or 0 (use the low-count component)
  average: number; // 0–5
}

export interface ProductSpec {
  fabric: string;
  gsm: string;
  fit: string;
  care: string;
}

export type FitType = "Athletic" | "Regular" | "Relaxed" | "Compression" | "One Size";

export interface Product {
  id: string; // GID
  handle: string;
  title: string;
  brandStrap: string; // one-line brand voice descriptor
  description: string;
  productType: string;
  tags: string[];
  options: ProductOption[];
  variants: ProductVariant[];
  featuredImage: ProductImage;
  images: ProductImage[];
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  specs: ProductSpec;
  /** Fit-certainty fields are REQUIRED (premortem content gate). */
  modelHeightCm: number;
  modelSizeWorn: string;
  fitType: FitType;
  builtFor: string[]; // benefit bullets
  reviews: ReviewSummary;
  collectionHandles: string[];
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  strap: string; // pillar-tied one-liner
  description: string;
  image: ProductImage | null;
  productHandles: string[];
}

export interface CartLineMerchandise {
  variantId: string;
  productHandle: string;
  productTitle: string;
  selectedOptions: SelectedOption[];
  image: ProductImage;
  price: Money;
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: CartLineMerchandise;
  cost: { totalAmount: Money };
}

export interface CartCost {
  subtotalAmount: Money;
  totalAmount: Money;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  cost: CartCost;
  totalQuantity: number;
  /** The real Shopify hosted-checkout URL. In mock phase this is a placeholder. */
  checkoutUrl: string;
}

export interface UserError {
  field: string[] | null;
  message: string;
}

export interface CartResult {
  cart: Cart;
  userErrors: UserError[];
}

export interface CartLineInput {
  variantId: string;
  quantity: number;
}

/** The single boundary between UI and data. Mock now, Shopify later. */
export interface CommerceAdapter {
  getAllProducts(): Promise<Product[]>;
  getProductByHandle(handle: string): Promise<Product | null>;
  getCollections(): Promise<Collection[]>;
  getCollectionByHandle(handle: string): Promise<Collection | null>;
  getProductsByHandles(handles: string[]): Promise<Product[]>;

  createCart(): Promise<Cart>;
  getCart(cartId: string): Promise<Cart | null>;
  addLines(cartId: string, lines: CartLineInput[]): Promise<CartResult>;
  updateLines(
    cartId: string,
    lines: { id: string; quantity: number }[],
  ): Promise<CartResult>;
  removeLines(cartId: string, lineIds: string[]): Promise<CartResult>;
}

/**
 * India delivery/serviceability — a SEPARATE port from checkout (premortem #6).
 * Mock now; real Shiprocket/Delhivery/GoKwik adapter later.
 */
export interface DeliveryEstimate {
  pincode: string;
  serviceable: boolean;
  codEligible: boolean;
  codFee: Money | null;
  prepaidEligible: boolean;
  etaText: string; // always reassuring; never a bare "not serviceable"
  etaDate: string | null;
}

export interface DeliveryEstimateProvider {
  estimate(input: {
    pincode: string;
    variantIds: string[];
  }): Promise<DeliveryEstimate>;
}
