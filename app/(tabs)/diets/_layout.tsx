import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack, useRouter } from "expo-router";
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';

export default function HomeLayout() {
  const rawTheme = useColorScheme();
  const theme = rawTheme === "dark" ? "dark" : "light";
  const isGlassAvailable = isLiquidGlassAvailable();
  const blurEffect =
    theme === "dark" ? "systemMaterialDark" : "systemMaterialLight";
  const router = useRouter();

  const handleAddItem = () => {
    console.log("Add Item pressed");
  };

  const onGoToDiet = () => {
    console.log("Go to Diet pressed");
    router.push('/add-diet');
  }

  const handleSearch = () => {
    console.log("Search pressed");
  };
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
          headerBlurEffect: isGlassAvailable ? undefined : blurEffect,
          unstable_headerRightItems: () => [
            {
              type: "custom",
              variant: "done",
              element: (
                <GestureHandlerRootView style={{ flex: 0 }}>
                  <TouchableOpacity onPress={onGoToDiet}>
                    <IconSymbol
                      size={35}
                      name="plus"
                      color={Colors.light.tint}
                    />
                  </TouchableOpacity>
                </GestureHandlerRootView>
              ),
            }
          ],
        }}
      />
    </Stack>
  );
}
