import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IHerdProgressStep {
  title: string;
  status: string;
  isCurrentTab: boolean;
}

const initialState: any = {
  herdProgressSteps: [
    {
      id: 1,
      title: "Buoc 1",
      status: "done",
      isCurrentTab: true,
    },
    {
      id: 2,
      title: "Buoc 2",
      status: "not_yet",
      isCurrentTab: false,
    },
    {
      id: 3,
      title: "Buoc 3",
      status: "not_yet",
      isCurrentTab: false,
    },
    {
      id: 4,
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
    setHerdProgressSteps: (
      state,
      action: PayloadAction<IHerdProgressStep[]>
    ) => {
      state.herdProgressSteps = action.payload;
    },
    setNextHerdProgressStep: (state) => {
      const index = state.herdProgressSteps.findIndex(
        (x: any) => x.isCurrentTab
      );
      state.herdProgressSteps[index].isCurrentTab = false;
      state.herdProgressSteps[index + 1].isCurrentTab = true;
    },
  },
});

export const { setHerdProgressSteps, setNextHerdProgressStep } =
  herdProgressStepSlice.actions;

export const herdProgressStepReducer = herdProgressStepSlice.reducer;
