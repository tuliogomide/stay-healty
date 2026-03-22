import { configureStore } from '@reduxjs/toolkit'
import plainFitness from './plainFitness'

export const store = configureStore({
    reducer: {
        plainFitness
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.getState