import { useTheme } from "@react-navigation/native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryPickerModal } from "@/components/todos/category-picker-modal";
import { useTodos } from "@/context/todos-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TodoDetailsScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { getTodo, updateTodo, deleteTodo, categories } = useTodos();

  const todo = id ? getTodo(id) : undefined;
  const [title, setTitle] = useState(todo?.title ?? "");
  const [note, setNote] = useState(todo?.note ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const isClosingRef = useRef(false);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setNote(todo.note);
    }
  }, [todo]);

  const saveScale = useSharedValue(1);
  const deleteScale = useSharedValue(1);

  const saveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));
  const deleteStyle = useAnimatedStyle(() => ({
    transform: [{ scale: deleteScale.value }],
  }));

  const closeScreen = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/");
  }, []);

  useEffect(() => {
    if (id && !todo) {
      closeScreen();
    }
  }, [id, todo, closeScreen]);

  const persist = () => {
    if (!todo) return;
    updateTodo(todo.id, {
      title: title.trim() || "Untitled",
      note: note.trim(),
    });
  };

  const closePicker = () => {
    setPickerOpen(false);
  };

  const setCategoryIds = (next: string[]) => {
    if (!todo) return;
    updateTodo(todo.id, { categoryIds: next });
  };

  const onDelete = () => {
    if (!todo) return;
    Alert.alert("Delete todo", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteTodo(todo.id);
        },
      },
    ]);
  };

  if (!todo) {
    return null;
  }

  const categoryIds = todo.categoryIds;
  const categorySummary = (() => {
    if (categoryIds.length === 0) return "Uncategorized";
    const map = new Map(categories.map((c) => [c.id, c.name] as const));
    const names = categoryIds.map((cid) => map.get(cid)).filter(Boolean) as string[];
    return names.length ? names.join(", ") : "Uncategorized";
  })();

  return (
    <>
      <CategoryPickerModal
        visible={pickerOpen}
        categories={categories}
        selectedIds={categoryIds}
        onClose={closePicker}
        onChange={setCategoryIds}
      />
      <Stack.Screen
        options={{ title: title.trim() || "Todo", headerBackTitle: "Back" }}
      />
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.colors.background }]}
        edges={["bottom"]}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          <Animated.View entering={FadeIn.duration(280)}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              onEndEditing={persist}
              onBlur={persist}
              placeholder="Title"
              placeholderTextColor={theme.dark ? "#888" : "#999"}
              style={[
                styles.field,
                {
                  color: theme.colors.text,
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
            />

            <Text
              style={[styles.label, { color: theme.colors.text, marginTop: 20 }]}
            >
              Note
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              onEndEditing={persist}
              onBlur={persist}
              placeholder="Add details…"
              placeholderTextColor={theme.dark ? "#888" : "#999"}
              multiline
              textAlignVertical="top"
              style={[
                styles.field,
                styles.noteField,
                {
                  color: theme.colors.text,
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
            />

            <Text
              style={[styles.label, { color: theme.colors.text, marginTop: 20 }]}
            >
              Categories
            </Text>
            <Pressable
              onPress={() => setPickerOpen(true)}
              style={[
                styles.field,
                styles.selectField,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Choose categories"
            >
              <Text
                style={[styles.selectValue, { color: theme.colors.text }]}
                numberOfLines={2}
              >
                {categorySummary}
              </Text>
              <Text style={[styles.selectChevron, { color: theme.colors.text }]}>
                ▼
              </Text>
            </Pressable>

            <View style={styles.actions}>
              <AnimatedPressable
                onPressIn={() => {
                  saveScale.value = withSpring(0.96, {
                    damping: 14,
                    stiffness: 400,
                  });
                }}
                onPressOut={() => {
                  saveScale.value = withSpring(1, { damping: 12, stiffness: 280 });
                }}
                onPress={() => {
                  persist();
                  closeScreen();
                }}
                style={[
                  styles.primaryBtn,
                  { backgroundColor: theme.colors.primary },
                  saveStyle,
                ]}
              >
                <Text style={styles.primaryBtnText}>Save & close</Text>
              </AnimatedPressable>

              <AnimatedPressable
                onPressIn={() => {
                  deleteScale.value = withSpring(0.96, {
                    damping: 14,
                    stiffness: 400,
                  });
                }}
                onPressOut={() => {
                  deleteScale.value = withSpring(1, {
                    damping: 12,
                    stiffness: 280,
                  });
                }}
                onPress={onDelete}
                style={[styles.dangerBtn, deleteStyle]}
              >
                <Text style={styles.dangerBtnText}>Delete</Text>
              </AnimatedPressable>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.85,
  },
  field: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
  },
  noteField: {
    minHeight: 140,
  },
  selectField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  selectChevron: {
    fontSize: 12,
    opacity: 0.45,
    paddingRight: 4,
  },
  actions: {
    marginTop: 28,
    gap: 12,
  },
  primaryBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  dangerBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "rgba(255, 59, 48, 0.12)",
  },
  dangerBtnText: {
    color: "#ff3b30",
    fontSize: 17,
    fontWeight: "700",
  },
});
