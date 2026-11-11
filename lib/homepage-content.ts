// Only owner-approved product groups. No wall adapters, inferred brands or stock claims.
// Owner-supplied product references only. Marketplace overlays were removed for a
// consistent presentation; no unrelated products or retailer branding are used.
export type HomeProduct = {
  id: string;
  name: string;
  detail: string;
  image: string | null;
  alt: string;
};
export const homeProducts: HomeProduct[] = [
  {
    id: "nylon-braided-cable",
    name: "4-in-1 Nylon-Braided Cable",
    detail: "Braided multi-connector design",
    image: "/images/homepage/4-in-1-braided-cable.webp",
    alt: "Dark nylon-braided multi-connector cable with four connector options",
  },
  {
    id: "lightning-cable",
    name: "USB-C to Lightning Cable",
    detail: "White · 2 metre",
    image: "/images/homepage/usb-c-to-lightning-cable.webp",
    alt: "White two-metre cable with USB-C and Lightning connectors",
  },
  {
    id: "usb-c-cable",
    name: "USB-C to USB-C Cable",
    detail: "USB-C connectors at both ends",
    image: null,
    alt: "Supplied USB-C to USB-C cable showing both USB-C connectors",
  },
  {
    id: "car-accessories",
    name: "Compact Car Charger",
    detail: "USB-A and USB-C ports",
    image: "/images/homepage/compact-car-charger.webp",
    alt: "Compact black in-car charger with USB-A and USB-C ports",
  },
  {
    id: "rfid-wallets",
    name: "Aluminium RFID Card Holder",
    detail: "Accordion-style card case",
    image: "/images/homepage/rfid-card-holder.webp",
    alt: "Black aluminium RFID card holder with accordion-style compartments",
  },
];
export const homeSlides = [
  {
    id: "cables",
    label: "Charging Cables",
    description: "Lightning · USB-C to USB-C · Braided options",
    products: homeProducts.slice(0, 3),
  },
  {
    id: "automotive",
    label: "Car Accessories",
    description: "Explore the range",
    products: [homeProducts[3]],
  },
  {
    id: "wallets",
    label: "RFID Wallets",
    description: "Everyday carry essentials",
    products: [homeProducts[4]],
  },
];
export const homeCategories = [
  {
    label: "View All Products",
    href: "/shop",
    description: "Browse the existing catalogue",
  },
  {
    label: "Charging Cables",
    href: "/#charging-cables",
    description: "Braided, Lightning & USB-C options",
  },
  {
    label: "Car Accessories",
    href: "/#car-accessories",
    description: "Explore the car charger showcase",
  },
  {
    label: "RFID Wallets",
    href: "/#rfid-wallets",
    description: "Everyday carry essentials",
  },
];
