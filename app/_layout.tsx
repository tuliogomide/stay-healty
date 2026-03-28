import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from './store/ducks';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

    const rawTheme = useColorScheme();
    const theme = rawTheme === "dark" ? "dark" : "light";
    const isGlassAvailable = isLiquidGlassAvailable();
    const blurEffect =
      theme === "dark" ? "systemMaterialDark" : "systemMaterialLight";

  return (
    <Provider store={store}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen
            name="sheet"
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: [0.50, 0.5],
              sheetGrabberVisible: true,
              contentStyle: {
                backgroundColor: isLiquidGlassAvailable() ? "transparent" : "white",
              },
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="add-diet"
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: [0.50, 0.5],
              sheetGrabberVisible: true,
              contentStyle: {
                backgroundColor: isLiquidGlassAvailable() ? "transparent" : "white",
              },
              headerShown: false,
            }}
          />
        </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </Provider>
  );
}
