import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTodos } from "@/context/todos-context";
import { CATEGORY_NAME_MAX, CATEGORY_NAME_MIN } from "@/constants/categories";

export function CategoriesSettingsSection() {
  const theme = useTheme();
  const { categories, addCategory, renameCategory, deleteCategory } = useTodos();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const onAdd = () => {
    const result = addCategory(newName);
    if (!result.ok) {
      Alert.alert("Could not add category", result.reason);
      return;
    }
    setNewName("");
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = (id: string) => {
    const result = renameCategory(id, editValue);
    if (!result.ok) {
      Alert.alert("Could not rename", result.reason);
      return;
    }
    cancelEdit();
  };

  const onDelete = (id: string, name: string) => {
    Alert.alert(
      "Delete category",
      `“${name}” will be removed from all todos. Those tasks become Uncategorized.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCategory(id),
        },
      ],
    );
  };

  return (
    <View style={styles.block}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Categories
      </Text>
      <Text style={[styles.sectionHint, { color: theme.colors.text }]}>
        {CATEGORY_NAME_MIN}–{CATEGORY_NAME_MAX} characters. Names must be unique.
      </Text>

      <View
        style={[
          styles.addRow,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <TextInput
          value={newName}
          onChangeText={setNewName}
          placeholder="New category…"
          placeholderTextColor={theme.dark ? "#888" : "#999"}
          maxLength={CATEGORY_NAME_MAX}
          style={[styles.addInput, { color: theme.colors.text }]}
          accessibilityLabel="New category name"
        />
        <Pressable
          onPress={onAdd}
          style={({ pressed }) => [
            styles.addBtn,
            { backgroundColor: theme.colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Add category"
        >
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      {categories.length === 0 ? (
        <Text style={[styles.empty, { color: theme.colors.text }]}>
          No categories yet.
        </Text>
      ) : (
        <View style={styles.list}>
          {categories.map((c) => {
            const isEditing = editingId === c.id;
            return (
              <View
                key={c.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                {isEditing ? (
                  <View style={styles.editBlock}>
                    <TextInput
                      value={editValue}
                      onChangeText={setEditValue}
                      maxLength={CATEGORY_NAME_MAX}
                      style={[
                        styles.editInput,
                        {
                          color: theme.colors.text,
                          borderColor: theme.colors.border,
                        },
                      ]}
                      autoFocus
                    />
                    <View style={styles.editActions}>
                      <Pressable
                        onPress={cancelEdit}
                        style={styles.secondaryPress}
                        accessibilityRole="button"
                      >
                        <Text style={[styles.secondaryText, { color: theme.colors.text }]}>
                          Cancel
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => saveEdit(c.id)}
                        style={({ pressed }) => [
                          styles.primaryMini,
                          {
                            backgroundColor: theme.colors.primary,
                            opacity: pressed ? 0.9 : 1,
                          },
                        ]}
                        accessibilityRole="button"
                      >
                        <Text style={styles.primaryMiniText}>Save</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View style={styles.row}>
                    <Text
                      style={[styles.name, { color: theme.colors.text }]}
                      numberOfLines={2}
                    >
                      {c.name}
                    </Text>
                    <View style={styles.rowBtns}>
                      <Pressable
                        onPress={() => startEdit(c.id, c.name)}
                        style={styles.secondaryPress}
                        accessibilityRole="button"
                        accessibilityLabel={`Rename ${c.name}`}
                      >
                        <Text style={[styles.link, { color: theme.colors.primary }]}>
                          Rename
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => onDelete(c.id, c.name)}
                        style={styles.secondaryPress}
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${c.name}`}
                      >
                        <Text style={styles.deleteLink}>Delete</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    opacity: 0.65,
  },
  sectionHint: {
    marginTop: 6,
    fontSize: 14,
    opacity: 0.55,
  },
  addRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  addInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    minHeight: 44,
  },
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  empty: {
    marginTop: 12,
    fontSize: 15,
    opacity: 0.55,
  },
  list: {
    marginTop: 12,
    gap: 10,
  },
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  rowBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  link: {
    fontSize: 15,
    fontWeight: "600",
  },
  deleteLink: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ff3b30",
  },
  editBlock: {
    gap: 10,
  },
  editInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    alignItems: "center",
  },
  secondaryPress: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "600",
    opacity: 0.75,
  },
  primaryMini: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  primaryMiniText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
