import { useTheme } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddTodoBar } from "@/components/todos/add-todo-bar";
import { CategoryFilterBar } from "@/components/todos/category-filter-bar";
import { TodoList } from "@/components/todos/todo-list";
import { useSettings } from "@/context/settings-context";
import { useTodos } from "@/context/todos-context";

export function TodoHomeScreen() {
  const theme = useTheme();
  const { todos, categories, addTodo, updateTodo } = useTodos();
  const { settings } = useSettings();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (
      selectedCategoryId &&
      !categories.some((c) => c.id === selectedCategoryId)
    ) {
      setSelectedCategoryId(null);
    }
  }, [categories, selectedCategoryId]);

  const visibleTodos = useMemo(() => {
    let list = todos;
    if (settings.hideCompletedTodos) {
      list = list.filter((t) => !t.completed);
    }
    if (selectedCategoryId) {
      list = list.filter((t) => t.categoryIds.includes(selectedCategoryId));
    }
    return list;
  }, [todos, settings.hideCompletedTodos, selectedCategoryId]);

  const onToggleComplete = (id: string) => {
    const t = todos.find((x) => x.id === id);
    if (!t) return;
    if (settings.hapticsEnabled) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    updateTodo(id, { completed: !t.completed });
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      edges={["bottom"]}
    >
      <View style={styles.inner}>
        <CategoryFilterBar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
        <AddTodoBar onAdd={(title) => addTodo(title)} />
        <TodoList
          todos={visibleTodos}
          categories={categories}
          onToggleComplete={onToggleComplete}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
