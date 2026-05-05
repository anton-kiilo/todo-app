import { MAX_CATEGORIES_PER_TASK } from "@/constants/categories";
import type { Category } from "@/types/category";
import { useTheme } from "@react-navigation/native";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  categories: Category[];
  selectedIds: string[];
  onClose: () => void;
  onChange: (next: string[]) => void;
};

export function CategoryPickerModal({
  visible,
  categories,
  selectedIds,
  onClose,
  onChange,
}: Props) {
  const theme = useTheme();
  const selectedSet = new Set(selectedIds);

  const toggle = (id: string) => {
    if (selectedSet.has(id)) {
      onChange(selectedIds.filter((x) => x !== id));
      return;
    }
    if (selectedIds.length >= MAX_CATEGORIES_PER_TASK) {
      return;
    }
    onChange([...selectedIds, id]);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Close"
        />
        <SafeAreaView
          style={[styles.sheet, { backgroundColor: theme.colors.card }]}
          edges={["bottom"]}
        >
          <View
            style={[styles.header, { borderBottomColor: theme.colors.border }]}
          >
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Categories
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
            >
              <Text style={[styles.done, { color: theme.colors.primary }]}>
                Done
              </Text>
            </Pressable>
          </View>
          <Text style={[styles.hint, { color: theme.colors.text }]}>
            Select up to {MAX_CATEGORIES_PER_TASK} categories (
            {selectedIds.length}/{MAX_CATEGORIES_PER_TASK}).
          </Text>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.list}
          >
            {categories.length === 0 ? (
              <Text style={[styles.empty, { color: theme.colors.text }]}>
                No categories yet. Add some in Settings.
              </Text>
            ) : (
              categories.map((c) => {
                const on = selectedSet.has(c.id);
                const disabled =
                  !on && selectedIds.length >= MAX_CATEGORIES_PER_TASK;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => !disabled && toggle(c.id)}
                    style={[
                      styles.row,
                      {
                        borderColor: theme.colors.border,
                        opacity: disabled ? 0.45 : 1,
                      },
                    ]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on, disabled }}
                  >
                    <Text
                      style={[styles.rowLabel, { color: theme.colors.text }]}
                    >
                      {c.name}
                    </Text>
                    <Text
                      style={[styles.mark, { color: theme.colors.primary }]}
                    >
                      {on ? "✓" : ""}
                    </Text>
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    maxHeight: "72%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  done: {
    fontSize: 17,
    fontWeight: "700",
  },
  hint: {
    marginTop: 10,
    marginHorizontal: 16,
    fontSize: 14,
    opacity: 0.65,
  },
  list: {
    padding: 16,
    paddingBottom: 24,
    gap: 8,
  },
  empty: {
    textAlign: "center",
    fontSize: 15,
    opacity: 0.65,
    paddingVertical: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 12,
  },
  mark: {
    fontSize: 18,
    fontWeight: "700",
    width: 24,
    textAlign: "center",
  },
});
