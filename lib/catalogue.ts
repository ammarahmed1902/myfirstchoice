export type Category = "electronics" | "car-accessories";
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  type: string;
  image: string;
  photo: string;
  description: string;
  moq: number | null;
  availability: "enquire" | "available" | "unavailable";
  sample: boolean;
  verified: boolean;
};
export const categories = [
  {
    slug: "electronics",
    name: "Electronics",
    image: "headphones",
    description: "Connected essentials for your next retail range.",
  },
  {
    slug: "car-accessories",
    name: "Car accessories",
    image: "dash",
    description: "In-car essentials for life on the move.",
  },
] as const;
export const products: Product[] = [
  {
    id: "EL-001",
    slug: "wireless-audio",
    name: "Wireless audio accessories",
    category: "electronics",
    type: "Audio",
    image: "audio",
    photo: "photo-1606220945770-b5b6c2c55bf1",
    description:
      "Explore wireless audio options for your retail range. Tell us your preferred format, product requirements and quantities.",
    moq: null,
    availability: "enquire",
    sample: true,
    verified: false,
  },
  {
    id: "CA-001",
    slug: "car-charging",
    name: "In-car charging accessories",
    category: "car-accessories",
    type: "Charging",
    image: "charger",
    photo: "photo-1583863788434-e58a36330cf0",
    description:
      "Discuss in-car charging requirements, connector compatibility and pack quantities with our team. Exact models are confirmed by quotation.",
    moq: null,
    availability: "enquire",
    sample: true,
    verified: false,
  },
  {
    id: "EL-002",
    slug: "over-ear-audio",
    name: "Over-ear audio accessories",
    category: "electronics",
    type: "Audio",
    image: "headphones",
    photo: "photo-1546435770-a3e426bf472b",
    description:
      "Start a wholesale enquiry for over-ear audio accessories. Share the features and quantities your customers need.",
    moq: null,
    availability: "enquire",
    sample: true,
    verified: false,
  },
  {
    id: "CA-002",
    slug: "phone-mounts",
    name: "Car phone mounts",
    category: "car-accessories",
    type: "Mounts",
    image: "dash",
    photo: "photo-1449965408869-eaa3f722e40d",
    description:
      "Explore phone mounting options for in-car use. Mounting location, device compatibility and samples are subject to confirmation.",
    moq: null,
    availability: "enquire",
    sample: true,
    verified: false,
  },
  {
    id: "EL-003",
    slug: "mobile-accessories",
    name: "Mobile accessories",
    category: "electronics",
    type: "Mobile",
    image: "phone",
    photo: "photo-1511707171634-5f897ff02aa9",
    description:
      "Build your next mobile accessory enquiry. Let us know your target devices, compatibility requirements and quantities.",
    moq: null,
    availability: "enquire",
    sample: true,
    verified: false,
  },
  {
    id: "CA-003",
    slug: "automotive-essentials",
    name: "Automotive accessory sourcing",
    category: "car-accessories",
    type: "Sourcing",
    image: "car",
    photo: "photo-1503376780353-7e6692767b70",
    description:
      "Looking for a particular car accessory? Send a product reference or describe what your business needs so our team can discuss sourcing options.",
    moq: null,
    availability: "enquire",
    sample: false,
    verified: false,
  },
];
export const productById = (id: string) => products.find((p) => p.id === id);
export const categoryName = (c: string) =>
  categories.find((v) => v.slug === c)?.name || c;
export type Tier = {
  product_id: string;
  min_qty: number;
  unit_price: number;
  currency: string;
};
export function formatPrice(value: number, currency: string) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(
    value,
  );
}
