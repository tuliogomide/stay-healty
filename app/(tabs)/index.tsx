import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from 'expo-status-bar';
import React, { useReducer, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { FlatList, GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { Rings } from './Rings';
import { Card, Content, ContentItemTraining, DeleteButton, ItemTraining, TextSection, TitleSection } from './style';

const Progress = ({ current, meta, overDiet, height }) => {
  const [width, setWidth] = React.useState(0);

  const animatedValue = React.useRef(new Animated.Value(-1000)).current;
  const reactive = React.useRef(new Animated.Value(-1000)).current;

  const animatedValue2 = React.useRef(new Animated.Value(-1000)).current;
  const reactive2 = React.useRef(new Animated.Value(-1000)).current;

  // Agora o denominador é SEMPRE a soma da meta com o excesso
  const totalScale = current + overDiet;

  // A posição da meta na escala total
  const markerPosition = current < meta ? width : (((meta+overDiet) / totalScale) * width);

  React.useEffect(()=>{
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 300,
      useNativeDriver: true
    }).start()

    Animated.timing(animatedValue2, {
      toValue: reactive2,
      duration: 300,
      useNativeDriver: true
    }).start()
  }, []);

  React.useEffect(() => {
    if(current+overDiet > meta) {
      reactive.setValue(-width + width*(current) / (current+overDiet))
      reactive2.setValue(-width + width*(current+overDiet) / (current+overDiet))
    } else {
      reactive.setValue(-width + width*(current) / meta)
      reactive2.setValue(-width + width*(current+overDiet) / meta)
    }
  }, [current, width])

  return (
    <View
    onLayout={
      (e) => {
        const newWidth = e.nativeEvent.layout.width;
        setWidth(newWidth)
      }
    }
    style={{
        marginTop: 25, // Abre espaço para o balão não sumir dentro do Card
        width: '100%',
        position: 'relative'
      }}>
      {/* Balãozinho */}
      {width > 0 && (
        <View style={{
          position: 'absolute',
          left: markerPosition - 20,
          top: -22, // Posiciona exatamente acima da barra
          alignItems: 'center',
          width: 40,
          zIndex: 100
        }}>
          <View style={{
            backgroundColor: '#000',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
          }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>meta</Text>
          </View>
          <View style={{
            width: 0,
            height: 0,
            borderLeftWidth: 4,
            borderRightWidth: 4,
            borderTopWidth: 4,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: '#000',
          }} />
        </View>
      )}
      <View style={{
        height,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: height,
        overflow: 'hidden',
      }}>
      <Animated.View
        style={{
          height,
          width: '100%',
          borderRadius: height,
          backgroundColor: 'rgb(141,49,17)',
          position: 'absolute',
          left: 0,
          top: 0,
          transform: [
            {
              translateX: animatedValue2
            }
          ]
        }}
      />
      <Animated.View
        style={{
          height,
          width: '100%',
          borderRadius: height,
          backgroundColor: 'rgb(150,183,25)',
          position: 'absolute',
          left: 0,
          top: 0,
          transform: [
            {
              translateX: animatedValue
            }
          ]
        }}
      />
        <View
          style={{
            position: 'absolute',
            left: markerPosition,
            width: 2, // Espessura da listra
            height: height,
            backgroundColor: 'white',
            zIndex: 10, // Garante que fique acima das cores
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
          }}
        />
      </View>
    </View>
  )
}

export default function HomeScreen() {
  const [checked, setChecked] = useState(false);

    const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'increment.training':
        return {
          ...state,
          training: state.training + action.payload
        }
      case 'decrement.training': 
        return {
          ...state,
          training: state.training - action.payload
        }
    }
  }, {
    training: 0
  })


  const renderActions = (isLastItem: Boolean, isFirstItem: Boolean) => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.button, styles.edit]}>
        <IconSymbol
          size={20}
          name="pencil.tip"
          color={'white'}
        />
        <Text style={{ color: 'white', fontSize: 10 }}>Edit</Text>
      </TouchableOpacity>
      <DeleteButton isLastItem={isLastItem} isFirstItem={isFirstItem}>
        <IconSymbol
          size={20}
          name="trash"
          color={'white'}
        />
        <Text style={{ color: 'white', fontSize: 10 }}>Delete</Text>
      </DeleteButton>
    </View>
  )

  const DATA_TRAININGS = [
    {
      id: '1',
      title: 'Workout Muscle',
      value: 350,
      subtitle: '350 kcal'
    },
    {
      id: '2',
      title: 'Cardio',
      value: 250,
      subtitle: '250 kcal'
    },
    {
      id: '3',
      title: 'Daily Movement',
      value: 150,
      subtitle: '150 kcal'
    }
  ]

  const DATA_DIETS = [
    {
      id: '1',
      title: 'Default Breakfast',
      subtitle: '500 kcal'
    },
    {
      id: '2',
      title: 'Default Lunch',
      subtitle: '600 kcal'
    },
    {
      id: '3',
      title: 'Default Dinner',
      subtitle: '600 kcal'
    }
  ]

  const Stack = createStackNavigator();

  const color = (r: number, g: number, b: number) =>
  `rgb(${r * 255}, ${g * 255}, ${b * 255})`;

  console.log()

  return (
    <Content>
      <TitleSection>
        <IconSymbol
          size={35}
          name="list.bullet.clipboard.fill"
          color={Colors.light.tint}
        />
        <TextSection>Summary</TextSection>
      </TitleSection>
      <Card style={{ display:'flex', flexDirection: 'row'}}>
        <View style={{height: 200, width: '50%' }}>
          <GestureHandlerRootView style={{height: 200 }}>
            <Rings totalProgressMovement={state.training/450} />
          </GestureHandlerRootView>
        </View>
        <View style={{ display: 'flex', justifyContent: 'center', marginLeft: 10 }}>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 15 }}>(-) Movement</Text>
            <Text style={{ fontSize: 20, fontWeight: 500, color: `rgb(77,94,10)` }}>{state.training}/450</Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 15 }}>(+) Diet</Text>
            <Text style={{ fontSize: 20, fontWeight: 500, color: `rgb(141,49,17)` }}>1900/1700</Text>
          </View>
          <View>
            <Text style={{ fontSize: 15 }}>(-) Training</Text>
            <Text style={{ fontSize: 20, fontWeight: 500, color: `rgb(150,183,25)` }}>300/400</Text>
          </View>
        </View>
      </Card>
      <Card style={{ display: 'flex', flexDirection: 'row', marginTop: 20, paddingBottom:10, justifyContent: 'space-between' }}>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row' }}>
            <Text>Daily Meta</Text><Text style={{ fontWeight: 'bold', marginLeft: 5 }}>400 kcal</Text>
          </View>
          <StatusBar hidden />
          <Progress current={1200} meta={400} overDiet={600} height={20} />
        </View>
      </Card>
      <View style={{ display: 'flex', flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
        <Card style={{ width: '48%', padding: 15 }}>
          <Text>Lost Calories</Text>
          <Text>
          <Text style={{ color: 'rgb(115,141,17)', fontWeight: 'bold', fontSize: 25 }}>600</Text><Text style={{ color: 'rgb(115,141,17)', fontWeight: 'bold', }}> Kcal</Text>
          </Text>
        </Card>
        <Card style={{ width: '48%', padding: 15 }}>
          <Text>Over Diet</Text>
          <Text>
            <Text style={{ color: 'rgb(141,49,17)', fontWeight: 'bold', fontSize: 22 }}>200</Text><Text style={{ color: 'rgb(141,49,17)', fontWeight: 'bold', }}> Kcal</Text>
          </Text>
        </Card>
      </View>
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
            data={DATA_TRAININGS}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <Swipeable
                renderRightActions={() =>
                  renderActions(
                    index === DATA_TRAININGS.length - 1 ? true : false,
                    index === 0 ? true : false
                  )
                }
              >
                <ItemTraining
                  isLastItem={
                    index === DATA_TRAININGS.length - 1 ? true : false
                  }
                  isFirstItem={index === 0 ? true : false}
                >
                  <ContentItemTraining
                    isLastItem={
                      index === DATA_TRAININGS.length - 1 ? true : false
                    }
                    isFirstItem={index === 0 ? true : false}
                  >
                    <View>
                      <Text>{item.title}</Text>
                      <Text style={{ color: "gray" }}>{item.subtitle}</Text>
                    </View>
                    <View style={{ borderRadius: 999 }}>
                      <BouncyCheckbox
                        size={30}
                        fillColor="black"
                        iconStyle={{
                          borderColor: "black",
                          borderRadius: 15,
                          borderWidth: 2,
                        }}
                        innerIconStyle={{ borderWidth: 0 }}
                        text="Concordo com a Política de Privacidade"
                        onPress={
                          (isChecked) => {
                            if(isChecked){
                              dispatch({ type: 'increment.training', payload: item.value })
                            } else {
                              dispatch({ type: 'decrement.training', payload: item.value })
                            }
                          }
                        }
                      />
                    </View>
                  </ContentItemTraining>
                </ItemTraining>
              </Swipeable>
            )}
          />
        </GestureHandlerRootView>
      </Card>
      <TitleSection>
        <IconSymbol size={35} name="leaf.fill" color={Colors.light.tint} />
        <TextSection>Diet</TextSection>
      </TitleSection>
      <Card>
        <GestureHandlerRootView>
          <FlatList
            data={DATA_DIETS}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <Swipeable
                renderRightActions={() =>
                  renderActions(
                    index === DATA_TRAININGS.length - 1 ? true : false,
                    index === 0 ? true : false
                  )
                }
              >
                <ItemTraining
                  isLastItem={
                    index === DATA_TRAININGS.length - 1 ? true : false
                  }
                  isFirstItem={index === 0 ? true : false}
                >
                  <ContentItemTraining
                    isLastItem={
                      index === DATA_TRAININGS.length - 1 ? true : false
                    }
                    isFirstItem={index === 0 ? true : false}
                  >
                    <View>
                      <Text>{item.title}</Text>
                      <Text style={{ color: "gray" }}>{item.subtitle}</Text>
                    </View>
                    <View style={{ borderRadius: 999 }}>
                      <BouncyCheckbox
                        size={30}
                        fillColor="black"
                        iconStyle={{
                          borderColor: "black",
                          borderRadius: 15,
                          borderWidth: 2,
                        }}
                        innerIconStyle={{ borderWidth: 0 }}
                        text="Concordo com a Política de Privacidade"
                        onPress={(isChecked) => {}}
                      />
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
