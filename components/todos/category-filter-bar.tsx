import { useTheme } from "@react-navigation/native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Category } from "@/types/category";

type Props = {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
};

export function CategoryFilterBar({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: Props) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          onPress={() => onSelectCategory(null)}
          style={[
            styles.chip,
            {
              backgroundColor:
                selectedCategoryId === null ? theme.colors.primary : theme.colors.card,
              borderColor:
                selectedCategoryId === null ? theme.colors.primary : theme.colors.border,
            },
          ]}
          accessibilityRole="button"
          accessibilityState={{ selected: selectedCategoryId === null }}
        >
          <Text
            style={[
              styles.chipLabel,
              { color: selectedCategoryId === null ? "#fff" : theme.colors.text },
            ]}
          >
            All Tasks
          </Text>
        </Pressable>
        {categories.map((c) => {
          const selected = selectedCategoryId === c.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => onSelectCategory(c.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? theme.colors.primary : theme.colors.card,
                  borderColor: selected ? theme.colors.primary : theme.colors.border,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text
                style={[
                  styles.chipLabel,
                  { color: selected ? "#fff" : theme.colors.text },
                ]}
                numberOfLines={1}
              >
                {c.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 4,
  },
  scroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingRight: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 200,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
