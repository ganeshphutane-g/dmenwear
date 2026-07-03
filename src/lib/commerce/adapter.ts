import type {
  Cart,
  CartLine,
  CartLineInput,
  CartResult,
  CommerceAdapter,
  Product,
  ProductVariant,
  UserError,
} from "./types";
import { PRODUCTS, COLLECTIONS } from "./fixtures";
import { addMoney, multiplyMoney, zeroMoney } from "./money";
import { CURRENCY } from "./config";

/**
 * In-memory mock CommerceAdapter. Conforms to the Storefront-shaped interface.
 * - Every method is async with injectable latency + userErrors.
 * - Cart totals are computed HERE and read back by the UI (never in components).
 * - Swap this module for a real @shopify/storefront adapter; UI is untouched.
 */

const LATENCY = 160;
const delay = () => new Promise((r) => setTimeout(r, LATENCY));

// variantId → { product, variant } index for cart resolution.
const VARIANT_INDEX = new Map<string, { product: Product; variant: ProductVariant }>();
for (const product of PRODUCTS) {
  for (const variant of product.variants) {
    VARIANT_INDEX.set(variant.id, { product, variant });
  }
}

const carts = new Map<string, Cart>();
let counter = 1000;
const nextId = (kind: string) => `gid://dmen/${kind}/${(counter += 1)}`;

function recost(cart: Cart): Cart {
  let subtotal = zeroMoney(CURRENCY);
  let qty = 0;
  const lines = cart.lines.map((line) => {
    const lineTotal = multiplyMoney(line.merchandise.price, line.quantity);
    subtotal = addMoney(subtotal, lineTotal);
    qty += line.quantity;
    return { ...line, cost: { totalAmount: lineTotal } };
  });
  return {
    ...cart,
    lines,
    totalQuantity: qty,
    cost: { subtotalAmount: subtotal, totalAmount: subtotal },
  };
}

const clone = (cart: Cart): Cart => structuredClone(cart);

export const mockAdapter: CommerceAdapter = {
  async getAllProducts() {
    await delay();
    return structuredClone(PRODUCTS);
  },

  async getProductByHandle(handle) {
    await delay();
    return structuredClone(PRODUCTS.find((p) => p.handle === handle) ?? null);
  },

  async getProductsByHandles(handles) {
    await delay();
    return handles
      .map((h) => PRODUCTS.find((p) => p.handle === h))
      .filter((p): p is Product => Boolean(p))
      .map((p) => structuredClone(p));
  },

  async getCollections() {
    await delay();
    return structuredClone(COLLECTIONS);
  },

  async getCollectionByHandle(handle) {
    await delay();
    return structuredClone(COLLECTIONS.find((c) => c.handle === handle) ?? null);
  },

  async createCart() {
    await delay();
    const id = nextId("Cart");
    const cart: Cart = {
      id,
      lines: [],
      cost: { subtotalAmount: zeroMoney(CURRENCY), totalAmount: zeroMoney(CURRENCY) },
      totalQuantity: 0,
      // Placeholder. Real Shopify supplies cart.checkoutUrl (hosted checkout).
      checkoutUrl: `/checkout?cart=${encodeURIComponent(id)}`,
    };
    carts.set(id, cart);
    return clone(cart);
  },

  async getCart(cartId) {
    await delay();
    const cart = carts.get(cartId);
    return cart ? clone(cart) : null;
  },

  async addLines(cartId, inputs: CartLineInput[]) {
    await delay();
    const cart = carts.get(cartId);
    const userErrors: UserError[] = [];
    if (!cart) {
      throw new Error(`Cart not found: ${cartId}`);
    }

    for (const input of inputs) {
      const entry = VARIANT_INDEX.get(input.variantId);
      if (!entry) {
        userErrors.push({ field: ["variantId"], message: "This item is unavailable." });
        continue;
      }
      const { product, variant } = entry;
      if (!variant.availableForSale || variant.quantityAvailable <= 0) {
        userErrors.push({ field: ["variantId"], message: "Sold out." });
        continue;
      }
      const existing = cart.lines.find((l) => l.merchandise.variantId === variant.id);
      const current = existing?.quantity ?? 0;
      const desired = current + input.quantity;
      const capped = Math.min(desired, variant.quantityAvailable);
      if (capped < desired) {
        userErrors.push({
          field: ["quantity"],
          message: `Only ${variant.quantityAvailable} left in ${variant.selectedOptions
            .map((o) => o.value)
            .join(" / ")}.`,
        });
      }
      if (existing) {
        existing.quantity = capped;
      } else if (capped > 0) {
        const line: CartLine = {
          id: nextId("CartLine"),
          quantity: capped,
          merchandise: {
            variantId: variant.id,
            productHandle: product.handle,
            productTitle: product.title,
            selectedOptions: variant.selectedOptions,
            image: product.featuredImage,
            price: variant.price,
          },
          cost: { totalAmount: multiplyMoney(variant.price, capped) },
        };
        cart.lines.push(line);
      }
    }

    const updated = recost(cart);
    carts.set(cartId, updated);
    return { cart: clone(updated), userErrors };
  },

  async updateLines(cartId, updates) {
    await delay();
    const cart = carts.get(cartId);
    const userErrors: UserError[] = [];
    if (!cart) throw new Error(`Cart not found: ${cartId}`);

    for (const u of updates) {
      const line = cart.lines.find((l) => l.id === u.id);
      if (!line) continue;
      const entry = VARIANT_INDEX.get(line.merchandise.variantId);
      if (!entry) {
        // Out of sync with catalog → drop rather than silently uncap the line.
        userErrors.push({ field: ["variantId"], message: "This item is no longer available." });
        cart.lines = cart.lines.filter((l) => l.id !== u.id);
        continue;
      }
      const max = entry.variant.quantityAvailable;
      if (u.quantity <= 0) {
        cart.lines = cart.lines.filter((l) => l.id !== u.id);
      } else {
        const capped = Math.min(u.quantity, max);
        if (capped < u.quantity) {
          userErrors.push({ field: ["quantity"], message: `Only ${max} available.` });
        }
        line.quantity = capped;
      }
    }

    const updated = recost(cart);
    carts.set(cartId, updated);
    return { cart: clone(updated), userErrors };
  },

  async removeLines(cartId, lineIds) {
    await delay();
    const cart = carts.get(cartId);
    if (!cart) throw new Error(`Cart not found: ${cartId}`);
    cart.lines = cart.lines.filter((l) => !lineIds.includes(l.id));
    const updated = recost(cart);
    carts.set(cartId, updated);
    return { cart: clone(updated), userErrors: [] };
  },
};
