import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ITreatmentProgressStep {
    title: string;
    status: string;
    isCurrentTab: boolean;
}

export const initialState: any = {
    treatmentProgressSteps: [
        {
            id: 1,
            title: "Tạo báo cáo bệnh",
            status: "not_yet",
            isCurrentTab: true,
        },
        {
            id: 2,
            title: "Tạo kế hoạch điều trị",
            status: "not_yet",
            isCurrentTab: false,
        },
    ],
    currentTreatmentProgressStep: {
        title: "",
        status: "",
        isCurrentTab: false,
    },
};

export const treatmentProgressStepSlice = createSlice({
    name: "treatmentProgressStepSlice",
    initialState,
    reducers: {
        setTreatmentProgressSteps: (
            state,
            action: PayloadAction<ITreatmentProgressStep[]>
        ) => {
            state.treatmentProgressSteps = action.payload;
        },
        setNextTreatmentProgressStep: (state) => {
            const index = state.treatmentProgressSteps.findIndex(
                (x: any) => x.isCurrentTab
            );
            state.treatmentProgressSteps[index].isCurrentTab = false;
            state.treatmentProgressSteps[index].status = 'done';
            state.treatmentProgressSteps[index + 1].isCurrentTab = true;
            // save to local storage
            localStorage.setItem(
                "treatmentProgressSteps",
                JSON.stringify(state.treatmentProgressSteps)
            );
        },
    },
});

export const { setTreatmentProgressSteps, setNextTreatmentProgressStep } =
    treatmentProgressStepSlice.actions;

export const treatmentProgressStepReducer = treatmentProgressStepSlice.reducer;
