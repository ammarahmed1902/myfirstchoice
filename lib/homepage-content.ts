// Only owner-approved product groups. No wall adapters, inferred brands or stock claims.
// Owner-supplied product references only. Marketplace overlays were removed for a
// consistent presentation; no unrelated products or retailer branding are used.
export type HomeProduct = {
  id: string;
  name: string;
  detail: string;
  image: string | null;
  alt: string;
  category: "charging-cables" | "car-accessories" | "rfid-wallets";
};
export const homeProducts: HomeProduct[] = [
  {
    id: "nylon-braided-cable",
    category: "charging-cables",
    name: "4-in-1 Nylon-Braided Cable",
    detail: "Braided multi-connector design",
    image: "/images/homepage/4-in-1-braided-cable.webp",
    alt: "Dark nylon-braided multi-connector cable with four connector options",
  },
  {
    id: "lightning-cable",
    category: "charging-cables",
    name: "USB-C to Lightning Cable",
    detail: "White · 2 metre",
    image: "/images/homepage/usb-c-to-lightning-cable.webp",
    alt: "White two-metre cable with USB-C and Lightning connectors",
  },
  {
    id: "usb-c-cable",
    category: "charging-cables",
    name: "USB-C to USB-C Cable",
    detail: "USB-C connectors at both ends",
    image: null,
    alt: "Supplied USB-C to USB-C cable showing both USB-C connectors",
  },
  {
    id: "car-accessories",
    category: "car-accessories",
    name: "Compact Car Charger",
    detail: "USB-A and USB-C ports",
    image: "/images/homepage/compact-car-charger.webp",
    alt: "Compact black in-car charger with USB-A and USB-C ports",
  },
  {
    id: "rfid-wallets",
    category: "rfid-wallets",
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
    description: "Braided multi-connector · USB-C to Lightning",
    products: homeProducts
      .slice(0, 3)
      .filter((product) => product.image !== null),
    desktopImage: "/images/hero/cables-desktop.webp",
    mobileImage: "/images/hero/cables-mobile.webp",
    alt: "Braided multi-connector and white USB-C to Lightning cables arranged on a deep navy studio surface",
    focalPoint: "center center",
  },
  {
    id: "automotive",
    label: "Car Accessories",
    description: "Explore the range",
    products: [homeProducts[3]],
    desktopImage: "/images/hero/car-charger-desktop.webp",
    mobileImage: "/images/hero/car-charger-mobile.webp",
    alt: "Two views of a compact black dual-port car charger on a deep navy studio surface",
    focalPoint: "center center",
  },
  {
    id: "wallets",
    label: "RFID Wallets",
    description: "Everyday carry essentials",
    products: [homeProducts[4]],
    desktopImage: "/images/hero/rfid-card-holder-desktop.webp",
    mobileImage: "/images/hero/rfid-card-holder-mobile.webp",
    alt: "Open black aluminium RFID card holder on a deep navy studio surface",
    focalPoint: "center center",
  },
];
export const homeCategories = [
  {
    label: "All Products",
    href: "/shop",
    description: "Explore our approved range",
  },
  {
    label: "Charging Cables",
    href: "/shop?category=charging-cables",
    description: "Braided & Lightning cables",
  },
  {
    label: "Car Accessories",
    href: "/shop?category=car-accessories",
    description: "Explore the car charger showcase",
  },
  {
    label: "RFID Wallets",
    href: "/shop?category=rfid-wallets",
    description: "Everyday carry essentials",
  },
];

export const approvedProducts = homeProducts.filter(
  (product) => product.image !== null,
);
export const productEnquiryHref = (id: string) =>
  `/contact?product=${encodeURIComponent(id)}`;
