// Only owner-approved product groups. No wall adapters, inferred brands or stock claims.
// Supply original product photographs here; never substitute unrelated stock/generated imagery.
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
    name: "Nylon-Braided Cable",
    detail: "Nylon-braided finish",
    image: null,
    alt: "Supplied nylon-braided cable, showing its actual connectors and finish",
  },
  {
    id: "lightning-cable",
    name: "Lightning Cable",
    detail: "Lightning connector",
    image: null,
    alt: "Supplied Lightning cable with its actual connectors clearly visible",
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
    name: "Car Charger",
    detail: "Car accessories",
    image: null,
    alt: "Supplied in-car charger, showing its actual ports and finish",
  },
  {
    id: "rfid-wallets",
    name: "RFID Wallet",
    detail: "Everyday carry accessories",
    image: null,
    alt: "Supplied RFID wallet showing its actual exterior and material",
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
