export interface Account {
  username: string;
  name: string;
  role: string;
  articles: boolean;
  articleAdd: boolean;
  articleChange: boolean;
  reviews: boolean;
  reviewChange: boolean;
  loginLogs: boolean;
  salesReports: boolean;
  can_view: boolean;
  can_add: boolean;
  can_change: boolean;
  can_delete: boolean;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: number;
  categoryName: string;
  brand: string;
  image: string;
  stock: number;
  price: number;
  active: boolean;
  model: string;
  description: string;
  type: string;
}

export interface Catalog {
  products: Product[];
  categories: { id: number; title: string; slug: string; product_count: number }[];
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'ارتباط با پنل برقرار نشد.';
}
