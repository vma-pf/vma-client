import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IHerdProgressStep {
  title: string;
  status: string;
  isCurrentTab: boolean;
}

export const initialState: any = {
  herdProgressSteps: [
    {
      id: 1,
      title: "Chuẩn bị chuồng trại",
      status: "not_yet",
      isCurrentTab: true,
    },
    {
      id: 2,
      title: "Tạo đàn heo",
      status: "not_yet",
      isCurrentTab: false,
    },
    {
      id: 3,
      title: "Gắn tag & xếp chuồng",
      status: "not_yet",
      isCurrentTab: false,
    },
    {
      id: 4,
      title: "Kế hoạch kiểm tra sức khỏe",
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
      state.herdProgressSteps[index].status = 'done';
      state.herdProgressSteps[index + 1].isCurrentTab = true;
      // save to local storage
      localStorage.setItem(
        "herdProgressSteps",
        JSON.stringify(state.herdProgressSteps)
      );
    },
  },
});

export const { setHerdProgressSteps, setNextHerdProgressStep } =
  herdProgressStepSlice.actions;

export const herdProgressStepReducer = herdProgressStepSlice.reducer;
