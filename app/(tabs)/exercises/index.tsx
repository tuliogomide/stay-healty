
import { removeTraining } from '@/app/store/ducks/plainFitness';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList, GestureHandlerRootView, Swipeable, TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import RenderActions from '../components/render-actions';
import { Card, Content, ContentItemTraining, ItemTraining, TextSection, TitleSection } from './style';

export default function Trainings() {
  const dispatch = useDispatch()
  const plainFitness = useSelector((state: any) => state.plainFitness)

  /*
    unstable_headerRightItems: (props) => [
            {
              type: "custom",
              onPress: onGoToTraining,
              hidesSharedBackground: true,
              element: (
                <Pressable onPress={onGoToTraining}>
                <IconSymbol
                  size={35}
                  name="plus"
                  color={Colors.light.tint}
                />
                </Pressable>
              )
            }
          ],
  */

  const navigation = useNavigation();
  const router = useRouter();

  const onGoToTraining = () => {
    console.log("Go to Diet pressed");
    router.push('/sheet');
  }

  useLayoutEffect(() => {
    console.log("Setting header options for (tabs)"); // Log para verificar se o useLayoutEffect está sendo chamado
    // Sobrescrevendo as opções do header que vieram do Layout
    navigation.setOptions({
      unstable_headerRightItems: () => [
        {
          type: "custom",
          element: (
            <GestureHandlerRootView style={{ flex: 0 }}>
            <TouchableOpacity onPress={onGoToTraining}>
              <IconSymbol
                size={35}
                name="plus"
                color={Colors.light.tint}
              />
            </TouchableOpacity>
            </GestureHandlerRootView>
          ),
        },
      ],
    });
  }, [navigation]); // Executa sempre que o navigation mudar

  return (
    <Content>
      <TitleSection>
        <IconSymbol
          size={35}
          name="figure.run.circle.fill"
          color={Colors.light.tint}
        />
        <TextSection>Training</TextSection>
      </TitleSection>
      <Card>
        <GestureHandlerRootView>
          <FlatList
            data={plainFitness.dataTraining}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <Swipeable
                renderRightActions={() =>
                  <RenderActions
                    isLastItem={index === plainFitness.dataTraining.length - 1 ? true : false}
                    isFirstItem={index === 0 ? true : false}
                    onDelete={() => dispatch(removeTraining(item.id))}
                  />
                }
              >
                <ItemTraining
                  isLastItem={
                    index === plainFitness.dataTraining.length - 1 ? true : false
                  }
                  isFirstItem={index === 0 ? true : false}
                >
                  <ContentItemTraining
                    isLastItem={
                      index === plainFitness.dataTraining.length - 1 ? true : false
                    }
                    isFirstItem={index === 0 ? true : false}
                  >
                    <View>
                      <Text>{item.title}</Text>
                      <Text style={{ color: "gray" }}>{item.subtitle}</Text>
                    </View>
                  </ContentItemTraining>
                </ItemTraining>
              </Swipeable>
            )}
          />
        </GestureHandlerRootView>
      </Card>
    </Content>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
