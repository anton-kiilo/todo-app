import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Category } from "@/types/category";
import type { Todo } from "@/types/todo";
import {
  CATEGORY_NAME_MAX,
  CATEGORY_NAME_MIN,
  MAX_CATEGORIES_PER_TASK,
} from "@/constants/categories";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "@todo-app/todos-and-categories";

type PersistedV1 = {
  version: 1;
  todos: Todo[];
  categories: Category[];
};

type TodosContextValue = {
  todos: Todo[];
  categories: Category[];
  addTodo: (title: string) => Todo;
  updateTodo: (
    id: string,
    patch: Partial<Pick<Todo, "title" | "note" | "completed" | "categoryIds">>,
  ) => void;
  deleteTodo: (id: string) => void;
  getTodo: (id: string) => Todo | undefined;
  addCategory: (name: string) => { ok: true; id: string } | { ok: false; reason: string };
  renameCategory: (
    id: string,
    name: string,
  ) => { ok: true } | { ok: false; reason: string };
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
};

const TodosContext = createContext<TodosContextValue | null>(null);

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function normalizeCategoryName(raw: string) {
  return raw.trim();
}

function isValidCategoryName(name: string) {
  return name.length >= CATEGORY_NAME_MIN && name.length <= CATEGORY_NAME_MAX;
}

function normalizeTodo(raw: unknown, validCategoryIds: Set<string>): Todo {
  if (!raw || typeof raw !== "object") {
    return {
      id: createId(),
      title: "Untitled",
      note: "",
      completed: false,
      createdAt: Date.now(),
      categoryIds: [],
    };
  }
  const o = raw as Record<string, unknown>;
  const rawIds = Array.isArray(o.categoryIds) ? o.categoryIds : [];
  const ids = rawIds
    .filter((x): x is string => typeof x === "string")
    .filter((id) => validCategoryIds.has(id));
  const unique = [...new Set(ids)].slice(0, MAX_CATEGORIES_PER_TASK);

  return {
    id: String(o.id ?? createId()),
    title: String(o.title ?? "Untitled"),
    note: typeof o.note === "string" ? o.note : "",
    completed: Boolean(o.completed),
    createdAt: typeof o.createdAt === "number" ? o.createdAt : Date.now(),
    categoryIds: unique,
  };
}

function parseCategories(rawList: unknown): Category[] {
  if (!Array.isArray(rawList)) return [];
  const out: Category[] = [];
  for (const item of rawList) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const id = typeof o.id === "string" ? o.id : "";
    const name = typeof o.name === "string" ? normalizeCategoryName(o.name) : "";
    if (!id || !isValidCategoryName(name)) continue;
    out.push({ id, name });
  }
  return out;
}

function parseStored(raw: string | null): { todos: Todo[]; categories: Category[] } {
  if (!raw) return { todos: [], categories: [] };
  try {
    const data = JSON.parse(raw) as unknown;
    if (Array.isArray(data)) {
      const categories: Category[] = [];
      const validIds = new Set(categories.map((c) => c.id));
      return {
        categories,
        todos: data.map((t) => normalizeTodo(t, validIds)),
      };
    }
    if (data && typeof data === "object") {
      const o = data as Record<string, unknown>;
      const categories = parseCategories(o.categories);
      const validIds = new Set(categories.map((c) => c.id));
      if (Array.isArray(o.todos)) {
        return { categories, todos: o.todos.map((t) => normalizeTodo(t, validIds)) };
      }
    }
  } catch {
    // ignore
  }
  return { todos: [], categories: [] };
}

async function loadPersisted(): Promise<{ todos: Todo[]; categories: Category[] }> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = parseStored(raw);
    const validIds = new Set(parsed.categories.map((c) => c.id));
    const todos = parsed.todos.map((t) => ({
      ...t,
      categoryIds: t.categoryIds.filter((id) => validIds.has(id)),
    }));
    return { todos, categories: parsed.categories };
  } catch {
    return { todos: [], categories: [] };
  }
}

async function savePersisted(payload: PersistedV1) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore persistence errors
  }
}

function mergeTodosAfterHydrate(loaded: Todo[], prev: Todo[]) {
  if (prev.length === 0) return loaded;
  const loadedIds = new Set(loaded.map((t) => t.id));
  const pending = prev.filter((t) => !loadedIds.has(t.id));
  return [...pending, ...loaded].sort((a, b) => b.createdAt - a.createdAt);
}

function mergeCategoriesAfterHydrate(loaded: Category[], prev: Category[]) {
  if (prev.length === 0) return loaded;
  const loadedIds = new Set(loaded.map((c) => c.id));
  const pending = prev.filter((c) => !loadedIds.has(c.id));
  return [...pending, ...loaded];
}

export function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const next = await loadPersisted();
      if (!cancelled) {
        setTodos((prev) => mergeTodosAfterHydrate(next.todos, prev));
        setCategories((prev) => mergeCategoriesAfterHydrate(next.categories, prev));
        setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void savePersisted({ version: 1, todos, categories });
  }, [todos, categories, hydrated]);

  const categoryIdSet = useMemo(() => new Set(categories.map((c) => c.id)), [categories]);

  const getCategoryById = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories],
  );

  const addTodo = useCallback((title: string) => {
    const trimmed = title.trim();
    const todo: Todo = {
      id: createId(),
      title: trimmed || "Untitled",
      note: "",
      completed: false,
      createdAt: Date.now(),
      categoryIds: [],
    };
    setTodos((prev) => [todo, ...prev]);
    return todo;
  }, []);

  const updateTodo = useCallback(
    (
      id: string,
      patch: Partial<Pick<Todo, "title" | "note" | "completed" | "categoryIds">>,
    ) => {
      setTodos((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const next = { ...t, ...patch };
          if (patch.categoryIds !== undefined) {
            const deduped = [...new Set(patch.categoryIds)].filter((cid) =>
              categoryIdSet.has(cid),
            );
            next.categoryIds = deduped.slice(0, MAX_CATEGORIES_PER_TASK);
          }
          return next;
        }),
      );
    },
    [categoryIdSet],
  );

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getTodo = useCallback(
    (id: string) => todos.find((t) => t.id === id),
    [todos],
  );

  const addCategory = useCallback(
    (name: string): { ok: true; id: string } | { ok: false; reason: string } => {
      const trimmed = normalizeCategoryName(name);
      if (!isValidCategoryName(trimmed)) {
        return {
          ok: false,
          reason: `Name must be ${CATEGORY_NAME_MIN}–${CATEGORY_NAME_MAX} characters.`,
        };
      }
      const lower = trimmed.toLowerCase();
      const exists = categories.some((c) => c.name.toLowerCase() === lower);
      if (exists) {
        return { ok: false, reason: "A category with that name already exists." };
      }
      const id = createId();
      setCategories((prev) => [...prev, { id, name: trimmed }]);
      return { ok: true, id };
    },
    [categories],
  );

  const renameCategory = useCallback(
    (
      id: string,
      name: string,
    ): { ok: true } | { ok: false; reason: string } => {
      const trimmed = normalizeCategoryName(name);
      if (!isValidCategoryName(trimmed)) {
        return {
          ok: false,
          reason: `Name must be ${CATEGORY_NAME_MIN}–${CATEGORY_NAME_MAX} characters.`,
        };
      }
      const lower = trimmed.toLowerCase();
      const clash = categories.some(
        (c) => c.id !== id && c.name.toLowerCase() === lower,
      );
      if (clash) {
        return { ok: false, reason: "A category with that name already exists." };
      }
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c)));
      return { ok: true };
    },
    [categories],
  );

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setTodos((prev) =>
      prev.map((t) => ({
        ...t,
        categoryIds: t.categoryIds.filter((cid) => cid !== id),
      })),
    );
  }, []);

  const value = useMemo(
    () => ({
      todos,
      categories,
      addTodo,
      updateTodo,
      deleteTodo,
      getTodo,
      addCategory,
      renameCategory,
      deleteCategory,
      getCategoryById,
    }),
    [
      todos,
      categories,
      addTodo,
      updateTodo,
      deleteTodo,
      getTodo,
      addCategory,
      renameCategory,
      deleteCategory,
      getCategoryById,
    ],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodosContext);
  if (!ctx) {
    throw new Error("useTodos must be used within TodosProvider");
  }
  return ctx;
}
