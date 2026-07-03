import type {
  Collection,
  FitType,
  Product,
  ProductImage,
  ProductVariant,
  ReviewSummary,
} from "./types";
import { inr } from "./config";

/**
 * Mock catalog — 9 real SKUs. Shapes mirror Shopify Storefront so the real
 * adapter is a drop-in. Honest data: real-ish stock, some sold-out variants,
 * some 0-review products (NO fake reviews), no fabricated discounts.
 * Every image is provenance:"placeholder" — the content gate blocks these at launch.
 */

function ph(altText: string, sq = false): ProductImage {
  return {
    url: "",
    altText,
    width: 1200,
    height: sq ? 1200 : 1600,
    provenance: "placeholder",
  };
}

type SizeStock = [size: string, qty: number];

function apparel(o: {
  n: number;
  handle: string;
  title: string;
  brandStrap: string;
  description: string;
  productType: string;
  price: number;
  colors: string[];
  sizes: SizeStock[];
  modelHeightCm: number;
  modelSizeWorn: string;
  fitType: FitType;
  specs: Product["specs"];
  builtFor: string[];
  reviews: ReviewSummary;
  tags: string[];
  collectionHandles: string[];
}): Product {
  const variants: ProductVariant[] = [];
  let i = 0;
  for (const color of o.colors) {
    for (const [size, qty] of o.sizes) {
      i += 1;
      variants.push({
        id: `gid://dmen/ProductVariant/${o.n}-${i}`,
        title: `${color} / ${size}`,
        availableForSale: qty > 0,
        quantityAvailable: qty,
        selectedOptions: [
          { name: "Color", value: color },
          { name: "Size", value: size },
        ],
        price: inr(o.price),
        compareAtPrice: null,
      });
    }
  }
  const images = [
    ph(`${o.title} — on-model front, ${o.colors[0]}`),
    ph(`${o.title} — on-model back`),
    ph(`${o.title} — fabric detail`),
  ];
  return {
    id: `gid://dmen/Product/${o.n}`,
    handle: o.handle,
    title: o.title,
    brandStrap: o.brandStrap,
    description: o.description,
    productType: o.productType,
    tags: o.tags,
    options: [
      { name: "Color", values: o.colors },
      { name: "Size", values: o.sizes.map((s) => s[0]) },
    ],
    variants,
    featuredImage: images[0],
    images,
    priceRange: { minVariantPrice: inr(o.price), maxVariantPrice: inr(o.price) },
    specs: o.specs,
    modelHeightCm: o.modelHeightCm,
    modelSizeWorn: o.modelSizeWorn,
    fitType: o.fitType,
    builtFor: o.builtFor,
    reviews: o.reviews,
    collectionHandles: o.collectionHandles,
  };
}

function accessory(o: {
  n: number;
  handle: string;
  title: string;
  brandStrap: string;
  description: string;
  price: number;
  qty: number;
  specs: Product["specs"];
  builtFor: string[];
  reviews: ReviewSummary;
  tags: string[];
  collectionHandles: string[];
}): Product {
  const images = [
    ph(`${o.title} — product, ${o.title}`, true),
    ph(`${o.title} — in use`, true),
  ];
  return {
    id: `gid://dmen/Product/${o.n}`,
    handle: o.handle,
    title: o.title,
    brandStrap: o.brandStrap,
    description: o.description,
    productType: "Accessory",
    tags: o.tags,
    options: [{ name: "Size", values: ["One Size"] }],
    variants: [
      {
        id: `gid://dmen/ProductVariant/${o.n}-1`,
        title: "One Size",
        availableForSale: o.qty > 0,
        quantityAvailable: o.qty,
        selectedOptions: [{ name: "Size", value: "One Size" }],
        price: inr(o.price),
        compareAtPrice: null,
      },
    ],
    featuredImage: images[0],
    images,
    priceRange: { minVariantPrice: inr(o.price), maxVariantPrice: inr(o.price) },
    specs: o.specs,
    modelHeightCm: 0,
    modelSizeWorn: "One Size",
    fitType: "One Size",
    builtFor: o.builtFor,
    reviews: o.reviews,
    collectionHandles: o.collectionHandles,
  };
}

export const PRODUCTS: Product[] = [
  apparel({
    n: 1,
    handle: "relentless-tee",
    title: "Relentless Tee",
    brandStrap: "The everyday armour. 240 GSM. Holds its shape. Earns its place.",
    description:
      "Built for the 5am you. A heavyweight combed-cotton crew that keeps its shape through the grind — and the wash. No slogans. Just the work.",
    productType: "T-Shirt",
    price: 899,
    colors: ["Blackout", "Bone"],
    sizes: [
      ["S", 6],
      ["M", 3],
      ["L", 12],
      ["XL", 9],
      ["XXL", 0],
    ],
    modelHeightCm: 185,
    modelSizeWorn: "M",
    fitType: "Athletic",
    specs: {
      fabric: "100% combed cotton",
      gsm: "240 GSM",
      fit: "Athletic",
      care: "Cold machine wash · do not tumble dry",
    },
    builtFor: [
      "Heavyweight 240 GSM — holds shape through 100 washes",
      "Athletic fit through chest and shoulders",
      "Flatlock seams that don't chafe under load",
      "Pre-shrunk combed cotton",
    ],
    reviews: { count: 23, average: 4.8 },
    tags: ["apparel", "tee", "bestseller"],
    collectionHandles: ["t-shirts", "apparel", "bestsellers", "all"],
  }),
  apparel({
    n: 2,
    handle: "forge-long-sleeve",
    title: "Forge Long-Sleeve",
    brandStrap: "Cover the work. Built to move when the temperature drops.",
    description:
      "A full-sleeve built for cold mornings and long sessions. Breathable, structured, relentless.",
    productType: "Full Sleeve T-Shirt",
    price: 1199,
    colors: ["Blackout", "Steel"],
    sizes: [
      ["S", 10],
      ["M", 8],
      ["L", 7],
      ["XL", 5],
      ["XXL", 4],
    ],
    modelHeightCm: 183,
    modelSizeWorn: "M",
    fitType: "Athletic",
    specs: {
      fabric: "Cotton-elastane blend",
      gsm: "220 GSM",
      fit: "Athletic",
      care: "Cold machine wash · do not tumble dry",
    },
    builtFor: [
      "Four-way stretch for full range of motion",
      "Thumbholes lock the sleeve in place",
      "Breathable mid-weight knit",
      "Athletic taper through the torso",
    ],
    reviews: { count: 9, average: 4.9 },
    tags: ["apparel", "full-sleeve", "new"],
    collectionHandles: ["full-sleeve", "apparel", "new", "all"],
  }),
  apparel({
    n: 3,
    handle: "cutoff-tank",
    title: "Cutoff Tank",
    brandStrap: "Earn the cutoff. Dropped armholes, zero restriction.",
    description:
      "The training tank for the days you let the work show. Sweat-wicking, lightweight, made to move.",
    productType: "Tank Top",
    price: 699,
    colors: ["Blackout", "Bone", "Blood Red"],
    sizes: [
      ["S", 14],
      ["M", 20],
      ["L", 12],
      ["XL", 6],
      ["XXL", 2],
    ],
    modelHeightCm: 186,
    modelSizeWorn: "M",
    fitType: "Athletic",
    specs: {
      fabric: "Cotton-modal blend",
      gsm: "180 GSM",
      fit: "Athletic",
      care: "Cold machine wash · do not tumble dry",
    },
    builtFor: [
      "Sweat-wicking, fast-drying knit",
      "Dropped armholes for full shoulder range",
      "Lightweight 180 GSM",
      "Stays put through every rep",
    ],
    reviews: { count: 14, average: 4.7 },
    tags: ["apparel", "tank", "bestseller"],
    collectionHandles: ["tank-tops", "apparel", "bestsellers", "all"],
  }),
  apparel({
    n: 4,
    handle: "hustle-joggers",
    title: "Hustle Joggers",
    brandStrap: "Engineered for the grind. Tapered, tough, all-day comfortable.",
    description:
      "From the last set to the street. A tapered jogger with the structure to train in and the cut to live in.",
    productType: "Joggers",
    price: 1799,
    colors: ["Blackout", "Steel"],
    sizes: [
      ["S", 5],
      ["M", 9],
      ["L", 11],
      ["XL", 7],
      ["XXL", 3],
    ],
    modelHeightCm: 184,
    modelSizeWorn: "M",
    fitType: "Athletic",
    specs: {
      fabric: "Cotton-poly French terry",
      gsm: "320 GSM",
      fit: "Tapered athletic",
      care: "Cold machine wash · do not tumble dry",
    },
    builtFor: [
      "Heavyweight 320 GSM French terry",
      "Tapered leg, zippered pockets",
      "Ribbed cuffs that hold their shape",
      "Gusset for unrestricted movement",
    ],
    reviews: { count: 6, average: 4.8 },
    tags: ["apparel", "joggers", "bestseller"],
    collectionHandles: ["joggers", "apparel", "bestsellers", "all"],
  }),
  apparel({
    n: 5,
    handle: "grind-shorts",
    title: "Grind Shorts",
    brandStrap: "Move without limits. 7-inch inseam, built for every plane.",
    description:
      "Squat, sprint, lift. A short that disappears so you don't think about it once.",
    productType: "Shorts",
    price: 999,
    colors: ["Blackout", "Steel"],
    sizes: [
      ["S", 8],
      ["M", 14],
      ["L", 10],
      ["XL", 6],
      ["XXL", 4],
    ],
    modelHeightCm: 182,
    modelSizeWorn: "M",
    fitType: "Athletic",
    specs: {
      fabric: "Recycled poly-elastane",
      gsm: "200 GSM",
      fit: "Athletic",
      care: "Cold machine wash · do not tumble dry",
    },
    builtFor: [
      "Four-way stretch woven shell",
      "7-inch inseam, no ride-up",
      "Hidden zip pocket",
      "Quick-dry, anti-odour finish",
    ],
    reviews: { count: 0, average: 0 },
    tags: ["apparel", "shorts", "new"],
    collectionHandles: ["shorts", "apparel", "new", "all"],
  }),
  accessory({
    n: 6,
    handle: "protein-shaker",
    title: "Steel Shaker",
    brandStrap: "750ml. Leakproof. The bottle that finishes every session.",
    description:
      "A 750ml shaker with a steel mixing ball and a lid that actually seals. Built to be thrown in the bag and forgotten.",
    price: 699,
    qty: 40,
    specs: {
      fabric: "BPA-free Tritan + stainless ball",
      gsm: "750 ml",
      fit: "One Size",
      care: "Top-rack dishwasher safe",
    },
    builtFor: [
      "Genuinely leakproof screw lid",
      "Stainless steel mixing ball",
      "Measurement markings to 750ml",
      "BPA-free, odour-resistant",
    ],
    reviews: { count: 31, average: 4.6 },
    tags: ["accessory", "shaker", "bestseller"],
    collectionHandles: ["accessories", "bestsellers", "all"],
  }),
  accessory({
    n: 7,
    handle: "gym-towel",
    title: "Grind Towel",
    brandStrap: "Quick-dry microfibre. Soaks the work, dries on the walk home.",
    description:
      "A compact, fast-drying microfibre towel with a snap loop for the rack. No more soaked cotton.",
    price: 499,
    qty: 25,
    specs: {
      fabric: "Microfibre (80/20)",
      gsm: "400 GSM",
      fit: "One Size",
      care: "Machine wash · no fabric softener",
    },
    builtFor: [
      "Absorbs 4× its weight",
      "Snap loop for the rack",
      "Anti-microbial finish",
      "Folds to fist-size",
    ],
    reviews: { count: 5, average: 4.9 },
    tags: ["accessory", "towel"],
    collectionHandles: ["accessories", "all"],
  }),
  accessory({
    n: 8,
    handle: "holdall-gym-bag",
    title: "Holdall Gym Bag",
    brandStrap: "35L. Wet pocket. Shoe tunnel. The kit that carries the kit.",
    description:
      "A 35-litre holdall engineered around the session: separate shoe tunnel, ventilated wet pocket, and straps that survive the commute.",
    price: 1999,
    qty: 12,
    specs: {
      fabric: "600D water-resistant poly",
      gsm: "35 L",
      fit: "One Size",
      care: "Wipe clean",
    },
    builtFor: [
      "Dedicated ventilated shoe tunnel",
      "Waterproof wet pocket",
      "Reinforced base + padded strap",
      "35L — a full day's kit",
    ],
    reviews: { count: 0, average: 0 },
    tags: ["accessory", "bag", "new"],
    collectionHandles: ["accessories", "new", "all"],
  }),
  accessory({
    n: 9,
    handle: "training-socks-3pack",
    title: "Training Socks (3-Pack)",
    brandStrap: "Cushioned, arch-locked, built to disappear. Three pairs.",
    description:
      "A three-pack of cushioned crew socks with arch compression that stay up through every set.",
    price: 299,
    qty: 60,
    specs: {
      fabric: "Combed cotton blend",
      gsm: "3-pack",
      fit: "One Size (UK 6–11)",
      care: "Machine wash",
    },
    builtFor: [
      "Targeted heel + toe cushioning",
      "Arch compression band",
      "Breathable mesh top",
      "Three pairs per pack",
    ],
    reviews: { count: 18, average: 4.7 },
    tags: ["accessory", "socks"],
    collectionHandles: ["accessories", "all"],
  }),
];

export const COLLECTIONS: Collection[] = [
  {
    id: "gid://dmen/Collection/all",
    handle: "all",
    title: "Shop All",
    strap: "Every piece. One standard.",
    description: "The full DMEN range — apparel and accessories for the relentless.",
    image: null,
    productHandles: PRODUCTS.map((p) => p.handle),
  },
  {
    id: "gid://dmen/Collection/bestsellers",
    handle: "bestsellers",
    title: "Best Sellers",
    strap: "Worn most by the relentless.",
    description: "The pieces rising men reach for first.",
    image: null,
    productHandles: ["relentless-tee", "cutoff-tank", "hustle-joggers", "protein-shaker"],
  },
  {
    id: "gid://dmen/Collection/new",
    handle: "new",
    title: "New Arrivals",
    strap: "Just dropped.",
    description: "The latest additions to the uniform.",
    image: null,
    productHandles: ["forge-long-sleeve", "grind-shorts", "holdall-gym-bag"],
  },
  {
    id: "gid://dmen/Collection/apparel",
    handle: "apparel",
    title: "Apparel",
    strap: "Built for your frame.",
    description: "Tees, tanks, joggers and shorts engineered for training.",
    image: null,
    productHandles: [
      "relentless-tee",
      "forge-long-sleeve",
      "cutoff-tank",
      "hustle-joggers",
      "grind-shorts",
    ],
  },
  {
    id: "gid://dmen/Collection/accessories",
    handle: "accessories",
    title: "Accessories",
    strap: "Complete the kit.",
    description: "The gear that finishes the session.",
    image: null,
    productHandles: ["protein-shaker", "gym-towel", "holdall-gym-bag", "training-socks-3pack"],
  },
  {
    id: "gid://dmen/Collection/t-shirts",
    handle: "t-shirts",
    title: "T-Shirts",
    strap: "Your everyday armour.",
    description: "Heavyweight tees that hold their shape.",
    image: null,
    productHandles: ["relentless-tee"],
  },
  {
    id: "gid://dmen/Collection/full-sleeve",
    handle: "full-sleeve",
    title: "Full-Sleeve Tees",
    strap: "Cover the work.",
    description: "Long-sleeve training tops for colder sessions.",
    image: null,
    productHandles: ["forge-long-sleeve"],
  },
  {
    id: "gid://dmen/Collection/tank-tops",
    handle: "tank-tops",
    title: "Tank Tops",
    strap: "Earn the cutoff.",
    description: "Lightweight tanks for the days the work shows.",
    image: null,
    productHandles: ["cutoff-tank"],
  },
  {
    id: "gid://dmen/Collection/joggers",
    handle: "joggers",
    title: "Joggers",
    strap: "Engineered for the grind.",
    description: "Tapered joggers built to train and live in.",
    image: null,
    productHandles: ["hustle-joggers"],
  },
  {
    id: "gid://dmen/Collection/shorts",
    handle: "shorts",
    title: "Shorts",
    strap: "Move without limits.",
    description: "Training shorts built for every plane of motion.",
    image: null,
    productHandles: ["grind-shorts"],
  },
];
