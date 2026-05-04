import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { SettingsProvider, useSettings } from "@/context/settings-context";
import { TodosProvider } from "@/context/todos-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

function RootNavigation() {
  const systemScheme = useColorScheme();
  const { settings } = useSettings();
  const resolvedScheme =
    settings.appearance === "system"
      ? (systemScheme ?? "light")
      : settings.appearance;

  return (
    <ThemeProvider value={resolvedScheme === "dark" ? DarkTheme : DefaultTheme}>
      <TodosProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="todo/[id]" options={{ title: "Todo" }} />
        </Stack>
      </TodosProvider>
      <StatusBar style={resolvedScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <RootNavigation />
    </SettingsProvider>
  );
}
