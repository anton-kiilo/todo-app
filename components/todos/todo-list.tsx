import { useTheme } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import type { Category } from "@/types/category";
import type { Todo } from "@/types/todo";
import { TodoItem } from "./todo-item";

type Props = {
  todos: Todo[];
  categories: Category[];
  onToggleComplete: (id: string) => void;
};

export function TodoList({ todos, categories, onToggleComplete }: Props) {
  const theme = useTheme();

  if (todos.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
          No todos yet
        </Text>
        <Text style={[styles.emptyHint, { color: theme.colors.text }]}>
          Add one above to get started.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Animated.View layout={LinearTransition.springify()}>
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            categories={categories}
            index={index}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
    paddingTop: 8,
  },
  empty: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  emptyHint: {
    marginTop: 8,
    fontSize: 15,
    opacity: 0.6,
    textAlign: "center",
  },
});
