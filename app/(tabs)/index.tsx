import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { ChartDataPoint, Host, Picker } from '@expo/ui/swift-ui';
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { FlatList, GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { decrementDiet, decrementMovement, decrementTraining, incrementDiet, incrementMovement, incrementTraining } from '../store/ducks/plainFitness';
import BarChart from './components/bar-cart';
import RenderActions from './components/render-actions';
import { Rings } from './Rings';
import { Card, Content, ContentItemTraining, ItemTraining, TextSection, TitleSection } from './style';

interface ProgressProps {
  current: number;
  meta: number;
  overDiet: number;
  height?: number; // O '?' torna a propriedade opcional
}

const Progress = ({ 
  current, 
  meta, 
  overDiet, 
  height 
}: ProgressProps) => {
  const [width, setWidth] = React.useState(0);

  const animatedValue = React.useRef(new Animated.Value(-1000)).current;
  const reactive = React.useRef(new Animated.Value(-1000)).current;

  const animatedValue2 = React.useRef(new Animated.Value(-1000)).current;
  const reactive2 = React.useRef(new Animated.Value(-1000)).current;

  // Agora o denominador é SEMPRE a soma da meta com o excesso
  const totalScale = React.useMemo(() => {
    return current + overDiet;
  }, [current, overDiet]);

  // A posição da meta na escala total
  const markerPosition = React.useMemo(() => {
    // 1. Se ainda não atingiu a meta, o marcador fica no final da barra (width)
    if (current < meta) {
      return width;
    }

    // 2. Se ultrapassou, calcula a posição proporcional baseada no excesso
    // Evitamos divisão por zero caso totalScale seja 0
    if (totalScale === 0) return 0;

    return ((meta + overDiet) / totalScale) * width;
  }, [current, meta, overDiet, totalScale, width]);

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
  }, [overDiet]);

  React.useEffect(() => {
    if(current+overDiet > meta) {
      reactive.setValue(-width + width*(current) / (current+overDiet))
      reactive2.setValue(-width + width*(current+overDiet) / (current+overDiet))
    } else {
      reactive.setValue(-width + width*(current) / meta)
      reactive2.setValue(-width + width*(current+overDiet) / meta)
    }
  }, [current, width, overDiet])

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

  const [totalTraining, setTotalTraining] = useState(600);

  const [totalDiet, setTotalDiet] = useState(1700)

  const [totalMovement, setTotalMovement] = useState(150)

  const dispatch = useDispatch()
  const plainFitness = useSelector((state: any) => state.plainFitness)

  const overDiet2 = useMemo(() => {
  const diff = totalDiet - plainFitness.diet;
  return diff < 0 ? diff * -1 : 0;
}, [totalDiet, plainFitness.diet]);

  const Stack = createStackNavigator();

  const color = (r: number, g: number, b: number) =>
  `rgb(${r * 255}, ${g * 255}, ${b * 255})`;

  const [dataSetIndex, setDataSetIndex] = useState(0);
  const dataSetOptions = ["Today", "Week", "Month"];

  const chartType: String = dataSetOptions[dataSetIndex];

  const weekData: ChartDataPoint[] = [
    { x: "Mon", y: 400 },
    { x: "Tue", y: 450 },
    { x: "Wed", y: 420 },
    { x: "Thu", y: 430 },
    { x: "Fri", y: 480 },
    { x: "Sat", y: 350 },
    { x: "Sun", y: 300 },
  ];

  const generateMonthData = () => {
  const daysInMonth = 30;
  const data: ChartDataPoint[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    // TRUQUE: Para os dias que não queremos o número, enviamos 
    // uma quantidade de espaços vazios igual ao número do dia.
    // O SwiftUI entende como um ID único, mas o usuário não vê nada.
    const label = i;

    data.push({
      x: String(label), 
      y: (Math.floor(Math.random() * (5 - 2 + 1)) + 2) * 100
    });
  }
  return data;
};

  const monthData = generateMonthData();

  const lostCalories = () => {
    if(chartType === "Today") {
      return plainFitness.training + plainFitness.movement
    } else if(chartType === "Week") {
      return weekData.reduce((acc, item) => acc + item.y, 0)
    } else if(chartType === "Month") {
      return monthData.reduce((acc, item) => acc + item.y, 0)
    }
  }

   const totalOverDiet = () => {
    if(chartType === "Today") {
      return overDiet2
    } else if(chartType === "Week") {
      return 300
    } else if(chartType === "Month") {
      return 900
    }
   }

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
      <View style={styles.pickerContainer}>
        <Host matchContents>
          <Picker
            options={dataSetOptions}
            selectedIndex={dataSetIndex}
            onOptionSelected={({ nativeEvent: { index } }) => {
              setDataSetIndex(index);
            }}
            variant="segmented"
          />
        </Host>
      </View>
      {(chartType === "Week" || chartType === "Month")  && (<Card style={{ display:'flex', flex: 1, }}>
        <View style={styles.chartContainer}>
            <BarChart rawMonthData={chartType === "Week" ? weekData : monthData} />
        </View>
      </Card>)}
      {chartType === "Today" && (
        <>
      <Card style={{ display:'flex', flexDirection: 'row'}}>
        <View style={{height: 200, width: '50%' }}>
          <GestureHandlerRootView style={{height: 200 }}>
            <Rings 
              totalProgressMovement={plainFitness.movement/totalMovement} 
              totalTraining={plainFitness.training/totalTraining}
              totalProgressDiet={plainFitness.diet/totalDiet}
            />
          </GestureHandlerRootView>
        </View>
        <View style={{ display: 'flex', justifyContent: 'center', marginLeft: 10 }}>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 15 }}>(-) Movement</Text>
            <Text style={{ fontSize: 20, fontWeight: 500, color: `rgb(77,94,10)` }}>{plainFitness.movement}/{totalMovement}</Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 15 }}>(+) Diet</Text>
            <Text style={{ fontSize: 20, fontWeight: 500, color: plainFitness.diet > totalDiet ?  `rgb(141,49,17)` : `rgb(115,141,17)` }}>{plainFitness.diet}/{totalDiet}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 15 }}>(-) Training</Text>
            <Text style={{ fontSize: 20, fontWeight: 500, color: `rgb(150,183,25)` }}>{plainFitness.training}/{totalTraining}</Text>
          </View>
        </View>
      </Card>
      <Card style={{ display: 'flex', flexDirection: 'row', marginTop: 20, paddingBottom:10, justifyContent: 'space-between' }}>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row' }}>
            <Text>Daily Meta</Text><Text style={{ fontWeight: 'bold', marginLeft: 5 }}>400 kcal</Text>
          </View>
          <StatusBar hidden />
          <Progress current={plainFitness.training+plainFitness.movement} meta={400} overDiet={overDiet2} height={20} />
        </View>
      </Card></>)}
      <View style={{ display: 'flex', flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
        <Card style={{ width: '48%', padding: 15 }}>
          <Text>Lost Calories</Text>
          <Text>
          <Text style={{ color: 'rgb(115,141,17)', fontWeight: 'bold', fontSize: 25 }}>{lostCalories()}</Text><Text style={{ color: 'rgb(115,141,17)', fontWeight: 'bold', }}> Kcal</Text>
          </Text>
        </Card>
        <Card style={{ width: '48%', padding: 15 }}>
          <Text>Over Diet</Text>
          <Text>
            <Text style={{ color: 'rgb(141,49,17)', fontWeight: 'bold', fontSize: 22 }}>{totalOverDiet()}</Text><Text style={{ color: 'rgb(141,49,17)', fontWeight: 'bold', }}> Kcal</Text>
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
            data={plainFitness.dataTraining}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <Swipeable
                renderRightActions={() =>
                  <RenderActions
                    isLastItem={index === plainFitness.dataTraining.length - 1 ? true : false}
                    isFirstItem={index === 0 ? true : false}
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
                    <View style={{ borderRadius: 999 }}>
                      <BouncyCheckbox
                        size={30}
                        isChecked={item.isChecked}
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
                            if(item.type === 'training') {
                            if(isChecked){
                              dispatch(incrementTraining(item.value))
                            } else {
                              dispatch(decrementTraining(item.value))
                            }
                          } else if(item.type === 'movement') {
                            if(isChecked){
                              dispatch(incrementMovement(item.value))
                            } else {
                              dispatch(decrementMovement(item.value))
                            }
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
      <Card style={{ marginBottom: 100 }}>
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
                    <View style={{ borderRadius: 999 }}>
                      <BouncyCheckbox
                        size={30}
                        isChecked={item.isChecked}
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
                              dispatch(incrementDiet(item.value))
                            } else {
                              dispatch(decrementDiet(item.value))
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
  },
  pickerContainer: {
    marginBottom: 16,
  },
  chartContainer: {
    height: 250,
    width: '100%',
    borderRadius: 12,
    padding: 16,
  },
  chart: {
    flex: 1,
  }
})
