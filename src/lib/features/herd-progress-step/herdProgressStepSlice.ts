import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IHerdProgressStep {
  title: string;
  status: string;
  isCurrentTab: boolean;
}

const initialState: any = {
  herdProgressSteps: [
    {
      title: "Buoc 1",
      status: "done",
      isCurrentTab: true,
    },
    {
      title: "Buoc 2",
      status: "not_yet",
      isCurrentTab: false,
    },
    {
      title: "Buoc 3",
      status: "not_yet",
      isCurrentTab: false,
    },
    {
      title: "Buoc 4",
      status: "not_yet",
      isCurrentTab: false,
    },
  ],
  currentHerdProgressStep: {
    title: "",
    status: "",
    isCurrentTab: false,
  },
};

export const herdProgressStepSlice = createSlice({
  name: "herdProgressStepSlice",
  initialState,
  reducers: {
    setHerdProgressSteps: (state, action: PayloadAction<IHerdProgressStep[]>) => {
      state.herdProgressSteps = action.payload;
    },
  },
});

export const { setHerdProgressSteps } = herdProgressStepSlice.actions;

export const herdProgressStepReducer = herdProgressStepSlice.reducer;
