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
import type { Todo } from "@/types/todo";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  todo: Todo;
  index: number;
  onToggleComplete: (id: string) => void;
};

export function TodoItem({ todo, index, onToggleComplete }: Props) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

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
});
