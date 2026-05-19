export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string;
  notes: string;
  userId: string;
  createdAt: number;
}

export type Category =
  | "Food"
  | "Transport"
  | "Academics"
  | "Entertainment"
  | "Shopping"
  | "Subscriptions"
  | "Miscellaneous";

export const CATEGORIES: Category[] = [
  "Food",
  "Transport",
  "Academics",
  "Entertainment",
  "Shopping",
  "Subscriptions",
  "Miscellaneous",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: "#F5A623",
  Transport: "#4A90D9",
  Academics: "#B8FF00",
  Entertainment: "#FF6B6B",
  Shopping: "#2DD4BF",
  Subscriptions: "#FF6B2B",
  Miscellaneous: "#8A9BB0",
};

export interface UserProfile {
  budget: number;
  displayName: string;
  avatarUrl?: string;
}
