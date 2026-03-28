import { removeDiet } from '@/app/store/ducks/plainFitness';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList, GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import RenderActions from '../components/render-actions';
import { Card, Content, ContentItemTraining, ItemTraining, TextSection, TitleSection } from './style';

export default function Trainings() {
  const dispatch = useDispatch()
  const plainFitness = useSelector((state: any) => state.plainFitness)

  return (

      <Content>
        <TitleSection>
          <IconSymbol
            size={35}
            name="leaf.fill"
            color={Colors.light.tint}
          />
          <TextSection>Diet</TextSection>
        </TitleSection>
        <Card>
          <GestureHandlerRootView>
            <FlatList
              data={plainFitness.dataDiet}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <Swipeable
                  renderRightActions={() =>
                    <RenderActions
                      isLastItem={index === plainFitness.dataDiet.length - 1 ? true : false}
                      isFirstItem={index === 0 ? true : false}
                      onDelete={() => dispatch(removeDiet(item.id))}
                    />
                  }
                >
                  <ItemTraining
                    isLastItem={
                      index === plainFitness.dataDiet.length - 1 ? true : false
                    }
                    isFirstItem={index === 0 ? true : false}
                  >
                    <ContentItemTraining
                      isLastItem={
                        index === plainFitness.dataDiet.length - 1 ? true : false
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
