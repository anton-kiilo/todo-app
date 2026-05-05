export type Todo = {
  id: string;
  title: string;
  note: string;
  completed: boolean;
  createdAt: number;
  /** Up to 3 category ids; empty means show as Uncategorized. */
  categoryIds: string[];
};
