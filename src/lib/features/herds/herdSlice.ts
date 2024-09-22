import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IHerd {
  breed: string;
  totalNumber: number;
  expectedEndDate: Date;
  startDate: Date;
  actualDate: Date;
  averageWeight: number;
  status: boolean;
}

const initialState: any = {
  herds: [],
  currentHerd: {
    breed: "",
    totalNumber: 0,
    expectedEndDate: new Date(),
    startDate: new Date(),
    actualDate: new Date(),
    averageWeight: 0,
    status: true,
  },
};

export const herdSlice = createSlice({
  name: "herdSlice",
  initialState,
  reducers: {
    setHerds: (state, action: PayloadAction<IHerd[]>) => {
      state.herds= action.payload;
    },
  },
});

export const { setHerds } = herdSlice.actions

export const herdReducer = herdSlice.reducer
