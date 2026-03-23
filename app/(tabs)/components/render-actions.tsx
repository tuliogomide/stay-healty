import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DeleteButton } from "../style";

  const RenderActions = ({ isLastItem, isFirstItem, onDelete }: { isLastItem: Boolean; isFirstItem: Boolean; onDelete: () => void }) => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.button, styles.edit]}>
        <IconSymbol
          size={20}
          name="pencil.tip"
          color={'white'}
        />
        <Text style={{ color: 'white', fontSize: 10 }}>Edit</Text>
      </TouchableOpacity>
      <DeleteButton onPress={onDelete} isLastItem={isLastItem} isFirstItem={isFirstItem}>
        <IconSymbol
          size={20}
          name="trash"
          color={'white'}
        />
        <Text style={{ color: 'white', fontSize: 10 }}>Delete</Text>
      </DeleteButton>
    </View>
  )

  const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
    },
    button: {
      width: 80,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white'
    },
    edit: {
      backgroundColor: '#0066ffd3'
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 10
    }
  })

  export default RenderActions;