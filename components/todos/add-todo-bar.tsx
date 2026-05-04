import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  onAdd: (title: string) => void;
};

export function AddTodoBar({ onAdd }: Props) {
  const theme = useTheme();
  const [title, setTitle] = useState("");
  const addScale = useSharedValue(1);

  const addButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addScale.value }],
  }));

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
    Keyboard.dismiss();
  };

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="New todo…"
        placeholderTextColor={theme.dark ? "#888" : "#999"}
        onSubmitEditing={submit}
        returnKeyType="done"
        style={[styles.input, { color: theme.colors.text }]}
        accessibilityLabel="Todo title"
      />
      <AnimatedPressable
        onPressIn={() => {
          addScale.value = withSpring(0.92, { damping: 14, stiffness: 400 });
        }}
        onPressOut={() => {
          addScale.value = withSpring(1, { damping: 12, stiffness: 280 });
        }}
        onPress={submit}
        style={[
          styles.addBtn,
          { backgroundColor: theme.colors.primary },
          addButtonStyle,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Add todo"
      >
        <Text style={styles.addBtnText}>Add</Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingVertical: 10,
    paddingHorizontal: 4,
    minHeight: 44,
  },
  addBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
