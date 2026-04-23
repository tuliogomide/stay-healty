import { Colors } from "@/constants/theme";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { initExecutorch, LFM2_VL_1_6B_QUANTIZED, useLLM } from "react-native-executorch";
import { ExpoResourceFetcher } from 'react-native-executorch-expo-resource-fetcher';
import { IconSymbol } from "./ui/icon-symbol.ios";

initExecutorch({
  resourceFetcher: ExpoResourceFetcher,
});

export default function InputIA({ setCalories, setName, setIngredients }: { setCalories: (calories: string) => void; setName: (name: string) => void; setIngredients: (ingredients: any[]) => void }) {
  const [message, setMessage] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [response, setResponse] = useState<Object | null>(null);
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState("");
  const [inputMessage, setInputMessage] = useState("")


  const llm = useLLM({ model: LFM2_VL_1_6B_QUANTIZED })

  function safeParse(text: string) {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  }

  async function sendMessage() {
    if (llm.isGenerating || !llm.isReady) return

    try {
      setLoading(true)
      const responseLLM = await llm.sendMessage('You are a nutrition assistant. Analyze the food shown in the image and estimate the calories. Return ONLY a valid JSON object with this exact structure: { "array_ingredients": [ { "name": "string", "estimated_calories": number } ], meal_name_suggest: string, total_meal_calories: number }', {
        imagePath: imageUri ?? undefined,
      });
      const jsonResponse = safeParse(responseLLM)
      console.log(jsonResponse)
      setResponse(jsonResponse)
      setCalories(String(jsonResponse.total_meal_calories))
      setName(jsonResponse.meal_name_suggest)
      setIngredients(jsonResponse.array_ingredients)
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
    } finally {
      setLoading(false)
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };;

  useEffect(() => {
    if (!llm.isReady) return

    llm.configure({
      chatConfig: {
        systemPrompt:
          "Você é um assistente útil e prestativo. Responda sempre em português de forma clara e concisa."
      },
    })
  }, [llm.isReady])

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>

      {/*

      <TextInput
        placeholder="Digite sua mensagem..."
        value={message}
        onChangeText={setMessage}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 8,
        }}
        multiline
      />

      */}

      <View style={styles.wrapper}>
        <View style={styles.inputContainer}>
          {/* Botão de imagem */}
          <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
            <IconSymbol name="photo" size={22} color="#666" />
          </TouchableOpacity>

          {/* Input */}
          <TextInput
            style={styles.input}
            aria-disabled={false}
            placeholder="Describe your meal..."
            value={value}
            onChangeText={setValue}
            multiline
          />

          {/* Botão enviar */}
          {loading || !llm.isReady ? <ActivityIndicator />
            : <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <IconSymbol name="paperplane" size={20} color={Colors.light.tint} />
            </TouchableOpacity>
          }
        </View>
      </View>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: "20%", height: 80, marginVertical: 10, borderRadius: 8 }}
        />
      )}

        {/* llm.response && <View style={[styles.messageContainer, styles.assistantMessage]}>
          <Text style={styles.messageRole}>Assistente</Text>
          <Text style={[styles.messageText, styles.messageText]}>
            {JSON.stringify(response)}
          </Text>
        </View> */}
        {!llm.isReady && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={{ fontWeight: "bold" }}>Loading IA Model</Text>
          <Text>
            This may take a few minutes on the first use...
          </Text>
          {llm.error && (
            <Text>
              Error loading model: {String(llm.error)}
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    borderRadius: 20,
  },
  inputContainer: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
  },
  iconButton: {
    padding: 8,
    marginRight: 6,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 6,
    borderRadius: 20,
    padding: 10,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    maxWidth: "85%",
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  assistantMessage: {
    alignSelf: "flex-start",
  },
  messageRole: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#666",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#000",
  },
  emptyState: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 50,
  },
  userMessage: {
    alignSelf: "flex-end",
  },
});