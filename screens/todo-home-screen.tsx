import { useTheme } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddTodoBar } from "@/components/todos/add-todo-bar";
import { TodoList } from "@/components/todos/todo-list";
import { useSettings } from "@/context/settings-context";
import { useTodos } from "@/context/todos-context";

export function TodoHomeScreen() {
  const theme = useTheme();
  const { todos, addTodo, updateTodo } = useTodos();
  const { settings } = useSettings();

  const visibleTodos = useMemo(() => {
    if (!settings.hideCompletedTodos) return todos;
    return todos.filter((t) => !t.completed);
  }, [todos, settings.hideCompletedTodos]);

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
        <AddTodoBar onAdd={(title) => addTodo(title)} />
        <TodoList todos={visibleTodos} onToggleComplete={onToggleComplete} />
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
