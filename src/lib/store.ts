import { configureStore } from '@reduxjs/toolkit'
import { herdReducer } from './features/herds/herdSlice';
import { herdProgressStepReducer } from './features/herd-progress-step/herdProgressStepSlice';
import { useAppSelector } from './hooks';

export const makeStore = () => {
  return configureStore({
    reducer: { herdReducer: herdReducer, herdProgressStepReducer: herdProgressStepReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  })
}

export const useHerdProgressSteps = () => useAppSelector((state) => state.herdProgressStepReducer.herdProgressSteps)

// export type AppStore = ReturnType<typeof store>
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']