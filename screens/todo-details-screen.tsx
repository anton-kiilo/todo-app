import { useTheme } from "@react-navigation/native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
import { useTodos } from "@/context/todos-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TodoDetailsScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { getTodo, updateTodo, deleteTodo } = useTodos();

  const todo = id ? getTodo(id) : undefined;
  const [title, setTitle] = useState(todo?.title ?? "");
  const [note, setNote] = useState(todo?.note ?? "");

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setNote(todo.note);
    }
  }, [todo]);

  useEffect(() => {
    if (id && !todo) {
      router.back();
    }
  }, [id, todo]);

  const saveScale = useSharedValue(1);
  const deleteScale = useSharedValue(1);

  const saveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));
  const deleteStyle = useAnimatedStyle(() => ({
    transform: [{ scale: deleteScale.value }],
  }));

  const persist = () => {
    if (!todo) return;
    updateTodo(todo.id, {
      title: title.trim() || "Untitled",
      note: note.trim(),
    });
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
          router.back();
        },
      },
    ]);
  };

  if (!todo) {
    return null;
  }

  return (
    <>
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
                  router.back();
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
