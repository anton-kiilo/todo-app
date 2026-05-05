import { useTheme } from "@react-navigation/native";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoriesSettingsSection } from "@/components/categories/categories-settings-section";
import type { AppearancePreference } from "@/context/settings-context";
import { useSettings } from "@/context/settings-context";

function AppearanceOption({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: AppearancePreference;
  selected: boolean;
  onSelect: (v: AppearancePreference) => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => onSelect(value)}
      style={[
        styles.appearanceChip,
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
          styles.appearanceChipLabel,
          { color: selected ? "#FFFFFF" : theme.colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function SettingsScreen() {
  const theme = useTheme();
  const {
    settings,
    setAppearance,
    setHideCompletedTodos,
    setHapticsEnabled,
    resetSettings,
  } = useSettings();

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      edges={["bottom"]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Appearance
        </Text>
        <Text style={[styles.sectionHint, { color: theme.colors.text }]}>
          Choose light, dark, or match the device.
        </Text>
        <View style={styles.appearanceRow}>
          <AppearanceOption
            label="System"
            value="system"
            selected={settings.appearance === "system"}
            onSelect={setAppearance}
          />
          <AppearanceOption
            label="Light"
            value="light"
            selected={settings.appearance === "light"}
            onSelect={setAppearance}
          />
          <AppearanceOption
            label="Dark"
            value="dark"
            selected={settings.appearance === "dark"}
            onSelect={setAppearance}
          />
        </View>

        <CategoriesSettingsSection />

        <Text style={[styles.sectionTitle, styles.sectionSpaced, { color: theme.colors.text }]}>
          Todos
        </Text>
        <View
          style={[
            styles.row,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: theme.colors.text }]}>
              Hide completed
            </Text>
            <Text style={[styles.rowSubtitle, { color: theme.colors.text }]}>
              Completed items stay in details; they are hidden from the list.
            </Text>
          </View>
          <Switch
            value={settings.hideCompletedTodos}
            onValueChange={setHideCompletedTodos}
            trackColor={{ false: "#8884", true: theme.colors.primary }}
          />
        </View>

        <Text style={[styles.sectionTitle, styles.sectionSpaced, { color: theme.colors.text }]}>
          Feedback
        </Text>
        <View
          style={[
            styles.row,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: theme.colors.text }]}>
              Haptics on toggle
            </Text>
            <Text style={[styles.rowSubtitle, { color: theme.colors.text }]}>
              Short vibration when marking a todo complete or incomplete.
            </Text>
          </View>
          <Switch
            value={settings.hapticsEnabled}
            onValueChange={setHapticsEnabled}
            trackColor={{ false: "#8884", true: theme.colors.primary }}
          />
        </View>

        <Pressable
          onPress={resetSettings}
          style={({ pressed }) => [
            styles.resetButton,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.resetLabel, { color: theme.colors.notification }]}>
            Reset all settings
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
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
  sectionSpaced: {
    marginTop: 28,
  },
  appearanceRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  appearanceChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
  },
  appearanceChipLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  row: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  rowSubtitle: {
    marginTop: 4,
    fontSize: 13,
    opacity: 0.55,
    lineHeight: 18,
  },
  resetButton: {
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
  },
  resetLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});
