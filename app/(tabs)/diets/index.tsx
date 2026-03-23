import { removeDiet } from '@/app/store/ducks/plainFitness';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { GlassView } from 'expo-glass-effect';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FlatList, GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import RenderActions from '../components/render-actions';
import { Card, Content, ContentItemTraining, ContentPage, ItemTraining, TextSection, TitleSection } from './style';

export default function Trainings() {
  const dispatch = useDispatch()
  const plainFitness = useSelector((state: any) => state.plainFitness)

  return (
    <ContentPage>
      <View style={{ position: 'absolute', top:0, right: 0, paddingRight: 20, paddingTop: 60, zIndex: 1 }}>
        <Link href="/add-diet" asChild>
          <Pressable>
            <GlassView
              style={{
                width: 45,
                height: 45,
                borderRadius: 22.5,
                alignItems: "center",
                justifyContent: "center",
              }}
              glassEffectStyle="regular"
              isInteractive={true}
            >
              <IconSymbol
                size={35}
                name="plus"
                color={Colors.light.tint}
              />
            </GlassView>
          </Pressable>
        </Link>
      </View>
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
    </ContentPage>
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
