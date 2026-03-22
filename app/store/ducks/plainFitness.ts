import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    training: 600,
    diet: 1700,
    movement: 150,
    dataTraining: [
      {
        id: '1',
        title: 'Workout Muscle',
        value: 350,
        type: 'training',
        isChecked: true,
        subtitle: '350 kcal'
      },
      {
        id: '2',
        title: 'Cardio',
        value: 250,
        type: 'training',
        isChecked: true,
        subtitle: '250 kcal'
      },
      {
        id: '3',
        title: 'Daily Movement',
        value: 150,
        type: 'movement',
        isChecked: true,
        subtitle: '150 kcal'
      }
    ],
    dataDiet: [
        {
          id: '1',
          title: 'Default Breakfast',
          value: 500,
          isChecked: true,
          subtitle: '500 kcal'
        },
        {
          id: '2',
          title: 'Default Lunch',
          value: 600,
          isChecked: true,
          subtitle: '600 kcal'
        },
        {
          id: '3',
          title: 'Default Dinner',
          value: 600,
          isChecked: true,
          subtitle: '600 kcal'
        },
        {
          id: '4',
          title: 'Chocolate Cake',
          value: 300,
          subtitle: '300 kcal'
        }
      ]
    
  },
  reducers: {
    incrementTraining: (state, action) => {
      state.training = state.training + action.payload
    },
    decrementTraining: (state, action) => {
      state.training = state.training - action.payload
    },
    incrementDiet: (state, action) => {
      state.diet = state.diet + action.payload
    },
    decrementDiet: (state, action) => {
      state.diet = state.diet - action.payload
    },
    incrementMovement: (state, action) => {
      state.movement = state.movement + action.payload
    },
    decrementMovement: (state, action) => {
      state.movement = state.movement - action.payload
    },
    addTraining: (state, action) => {
      state.dataTraining.push(action.payload)
    },
    addDiet: (state, action) => {
      state.dataDiet.push(action.payload) 
    },
    removeTraining: (state, action) => {
      state.dataTraining = state.dataTraining.filter(item => item.id !== action.payload)
    },
    removeDiet: (state, action) => {
      state.dataDiet = state.dataDiet.filter(item => item.id !== action.payload)
    }
  }
})

export const {
  incrementTraining,
  decrementTraining,
  incrementDiet,
  decrementDiet,
  incrementMovement,
  decrementMovement
} = counterSlice.actions
export default counterSlice.reducer