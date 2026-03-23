import { addTraining } from "@/app/store/ducks/plainFitness";
import { Colors } from "@/constants/theme";
import { Button, Form, Host, HStack, Section, Switch } from "@expo/ui/swift-ui";
import { clipShape } from "@expo/ui/swift-ui/modifiers";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import { IconSymbol } from "./ui/icon-symbol";

export default function SheetScreen() {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [isRepeat, setIsRepeat] = useState(false);

  const dispatch = useDispatch()

  const router = useRouter();

  const onSubmit = () => {
    if(calories === "" || name === "") return alert("Please fill all the fields")
      else {
    dispatch(addTraining({
      id: String(new Date().getTime()),
      title: name,
      value: Number(calories),
      subtitle: `${calories} kcal`
    }))
    router.back();
  }
  }

  const onCancel = () => {
    router.back();
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingTop: 40,
        paddingBottom: 100
      }}
    >
      <View style={{ alignItems: "center", flexDirection: "row", paddingLeft: 20, paddingRight: 20, justifyContent: "space-between" }}>
        <Pressable onPress={onCancel}>
          <GlassView
            style={{
              width: 50,
              height: 50,
              borderRadius: 22.5,
              alignItems: "center",
              justifyContent: "center"
            }}
            isInteractive={true}
          >
            <IconSymbol
              size={25}
              name="xmark"
              color={Colors.light.tint}
            />
          </GlassView>
        </Pressable>
        <Text style={{ fontSize: 15, color: Colors.light.text, fontWeight: "bold" }}>New Training</Text>
        <Pressable onPress={onSubmit}>
          <Host style={{ width: 50, height: 50 }}>
            <Button
              controlSize="large"
              color={Colors.light.tint}
              modifiers={[
                clipShape("circle", 1),
              ]}
              variant={isLiquidGlassAvailable() ? "glassProminent" : "borderless"}
              systemImage="checkmark"
            />
          </Host>
        </Pressable>
      </View>
      <View>
        <Host style={{ height: 300 }}>
          <Form>
            <Section>
              <HStack spacing={8}>
                <Text style={{ fontSize: 16 }}>Training Name</Text>
                <TextInput style={{ textAlign: 'right', width: 160, fontSize: 16 }} placeholder="Workout Muscle" onChangeText={setName} />
              </HStack>
              <HStack spacing={8}>
                <Text style={{ fontSize: 16 }}>Calories</Text>
                <TextInput style={{ textAlign: 'right', width: 160, fontSize: 16 }} placeholder="600" onChangeText={setCalories} />
              </HStack>
              <HStack spacing={8}>
                <Text style={{ fontSize: 16 }}>Repeat</Text>
                <Switch value={isRepeat} onValueChange={setIsRepeat} />
              </HStack>
            </Section>
          </Form>
        </Host>
      </View>
    </ScrollView>
  );
}

const dummyData = [
  "🎮 Gaming Setup",
  "📱 iPhone 15 Pro",
  "💻 MacBook Pro",
  "🎧 AirPods Max",
  "⌚️ Apple Watch",
  "📸 Canon EOS R5",
  "🎤 Shure SM7B Mic",
  "🖥️ Studio Display",
  "⌨️ Magic Keyboard",
  "🖱️ Magic Trackpad",
  "📱 iPad Pro",
  "🎮 PS5",
  "🕹️ Nintendo Switch",
  "📺 LG OLED TV",
  "🔊 HomePod",
];
