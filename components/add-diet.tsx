import { addDiet } from "@/app/store/ducks/plainFitness";
import { Colors } from "@/constants/theme";
import { Button, Host, Switch } from "@expo/ui/swift-ui";
import { clipShape } from "@expo/ui/swift-ui/modifiers";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import InputIA from "./input-ia";
import { IconSymbol } from "./ui/icon-symbol";

export default function SheetScreen() {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [isRepeat, setIsRepeat] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  const dispatch = useDispatch()

  const router = useRouter();

  const onSubmit = () => {
    if (calories === "" || name === "") return alert("Please fill all the fields")
    else {
      dispatch(addDiet({
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
      <View style={{ alignItems: "center", flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingBottom: 20, justifyContent: "space-between" }}>
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
        <Text style={{ fontSize: 15, color: Colors.light.text, fontWeight: "bold" }}>New Meal</Text>
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
      <InputIA setCalories={setCalories} setName={setName} setIngredients={setIngredients} />
      <View>
        <View style={styles.contentList}>
          <View style={{ padding: 20 }}>
            <View style={styles.ItemList}>
              <View style={styles.contentItemList}>
                <Text style={{ fontSize: 16 }}>Meal Name</Text>
                <Host>
                  <TextInput value={name} style={{ textAlign: 'right', width: 160, fontSize: 16 }} placeholder="Apple Pie" onChangeText={setName} />
                </Host>
              </View>
            </View>
            <View style={styles.ItemList}>
              <View style={styles.contentItemList}>
                <Text style={{ fontSize: 16 }}>Calories</Text>
                <Host>
                  <TextInput value={calories} style={{ textAlign: 'right', width: 160, fontSize: 16 }} placeholder="600" onChangeText={setCalories} />
                </Host>
              </View>
            </View>
            <View style={styles.ItemList}>
              <View style={[styles.contentItemList, { borderBottomWidth: 0 }]}>
                <Text style={{ fontSize: 16 }}>Repeat</Text>
                <Host style={{ height: 30, width: 160 }}>
                  <Switch value={isRepeat} onValueChange={setIsRepeat} />
                </Host>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 16, marginLeft: 30, fontWeight: "bold" }}>Ingredients</Text>
        <View style={styles.contentList}>
          <View style={{ padding: 20 }}>
            {ingredients.length === 0 ? (
              <View style={styles.ItemList}>
                <View style={[styles.contentItemList, { borderBottomWidth: 0 }]}>
                  <Text style={{ fontSize: 16 }}>No ingredient added</Text>
                </View>
              </View>
            ) : (ingredients.map((ingredient, index) => (
              <View key={'ingredient' + index} style={styles.ItemList}>
                <View style={index !== ingredients.length - 1 ? styles.contentItemList : [styles.contentItemList, { borderBottomWidth: 0 }]}>
                  <Host style={{ width: 100}}>
                    <TextInput value={ingredient.name} style={{ textAlign: 'left', width: 160, fontSize: 16 }} placeholder="Rice" onChangeText={(text) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index].name = text;
                      setIngredients(newIngredients);
                    }} />
                  </Host>
                  <Host>
                    <TextInput value={String(ingredient.estimated_calories)} style={{ textAlign: 'right', width: 160, fontSize: 16 }} placeholder="600" onChangeText={(text) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index].estimated_calories = text;
                      setIngredients(newIngredients);
                    }} />
                  </Host>
                </View>
              </View>
            )))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentList: {
    backgroundColor: "#ddd9d9",
    marginHorizontal: 20,
    borderRadius: 20,
    marginVertical: 20
  },
  contentItemList: {
    paddingVertical: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#7a7979bc',
  },
  ItemList: {
    paddingHorizontal: 10
  }
})