import type { Todo } from "@/types/todo";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type TodosContextValue = {
  todos: Todo[];
  addTodo: (title: string) => Todo;
  updateTodo: (id: string, patch: Partial<Pick<Todo, "title" | "note" | "completed">>) => void;
  deleteTodo: (id: string) => void;
  getTodo: (id: string) => Todo | undefined;
};

const TodosContext = createContext<TodosContextValue | null>(null);

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = useCallback((title: string) => {
    const trimmed = title.trim();
    const todo: Todo = {
      id: createId(),
      title: trimmed || "Untitled",
      note: "",
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [todo, ...prev]);
    return todo;
  }, []);

  const updateTodo = useCallback(
    (id: string, patch: Partial<Pick<Todo, "title" | "note" | "completed">>) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      );
    },
    [],
  );

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getTodo = useCallback(
    (id: string) => todos.find((t) => t.id === id),
    [todos],
  );

  const value = useMemo(
    () => ({ todos, addTodo, updateTodo, deleteTodo, getTodo }),
    [todos, addTodo, updateTodo, deleteTodo, getTodo],
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
