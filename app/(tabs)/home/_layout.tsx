import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack } from "expo-router";

export default function HomeLayout() {
  const rawTheme = useColorScheme();
  const theme = rawTheme === "dark" ? "dark" : "light";
  const isGlassAvailable = isLiquidGlassAvailable();
  const blurEffect =
    theme === "dark" ? "systemMaterialDark" : "systemMaterialLight";

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerLargeTitle: false,
          headerTransparent: true,
          navigationBarTranslucent: false,
          headerTintColor: theme === "dark" ? "white" : "black",
          headerLargeStyle: { backgroundColor: "transparent" },
          headerBlurEffect: isGlassAvailable ? undefined : blurEffect
        }}
      />
    </Stack>
  );
}
