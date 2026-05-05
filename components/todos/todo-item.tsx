import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { UNCATEGORIZED_LABEL } from "@/constants/categories";
import type { Category } from "@/types/category";
import type { Todo } from "@/types/todo";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  todo: Todo;
  categories: Category[];
  index: number;
  onToggleComplete: (id: string) => void;
};

function labelsForTodo(todo: Todo, categories: Category[]) {
  const map = new Map(categories.map((c) => [c.id, c.name] as const));
  return todo.categoryIds.map((id) => map.get(id)).filter(Boolean) as string[];
}

export function TodoItem({ todo, categories, index, onToggleComplete }: Props) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const resolved = labelsForTodo(todo, categories);
  const tagLabels =
    todo.categoryIds.length === 0
      ? [UNCATEGORIZED_LABEL]
      : resolved.length > 0
        ? resolved
        : [UNCATEGORIZED_LABEL];

  return (
    <Animated.View
      entering={FadeInRight.delay(Math.min(index * 40, 200)).springify()}
      exiting={FadeOutLeft.springify()}
      layout={Layout.springify()}
      style={styles.wrapper}
    >
      <Animated.View
        style={[
          styles.row,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
          rowStyle,
        ]}
      >
        <Pressable
          hitSlop={12}
          onPress={() => onToggleComplete(todo.id)}
          style={[
            styles.checkbox,
            {
              borderColor: theme.colors.primary,
              backgroundColor: todo.completed
                ? theme.colors.primary
                : "transparent",
            },
          ]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: todo.completed }}
        />
        <AnimatedPressable
          onPressIn={() => {
            scale.value = withSpring(0.98, { damping: 16, stiffness: 320 });
          }}
          onPressOut={() => {
            scale.value = withSpring(1, { damping: 14, stiffness: 280 });
          }}
          onPress={() => router.push(`/todo/${todo.id}`)}
          style={styles.mainPress}
        >
          <View style={styles.textBlock}>
            <Text
              numberOfLines={2}
              style={[
                styles.title,
                { color: theme.colors.text },
                todo.completed && styles.titleDone,
              ]}
            >
              {todo.title}
            </Text>
            {todo.note.length > 0 ? (
              <Text
                numberOfLines={1}
                style={[styles.note, { color: theme.colors.text }]}
              >
                {todo.note}
              </Text>
            ) : null}
            <View style={styles.tags}>
              {tagLabels.map((label, idx) => (
                <View
                  key={`${todo.id}-tag-${idx}-${label}`}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: theme.dark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.06)",
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      {
                        color: theme.colors.text,
                        opacity: label === UNCATEGORIZED_LABEL ? 0.55 : 0.9,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </AnimatedPressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingLeft: 10,
    paddingRight: 6,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignSelf: "center",
  },
  mainPress: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },
  titleDone: {
    opacity: 0.45,
    textDecorationLine: "line-through",
  },
  note: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.65,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  tag: {
    maxWidth: "100%",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
