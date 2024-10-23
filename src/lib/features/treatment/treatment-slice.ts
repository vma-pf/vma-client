import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ITreatment {
    title: string;
    description: string;
    expectedTimePeriod: string;
    actualTimePeriod: string;
    note: string;
}

const initialState: any = {
    treatments: [],
    currentTreatment: {
        title: "",
        description: "",
        expectedTimePeriod: "",
        actualTimePeriod: "",
        note: "",
    },
};

export const treatmentSlice = createSlice({
    name: "treatmentSlice",
    initialState,
    reducers: {
        setTreatments: (state, action: PayloadAction<ITreatment[]>) => {
            state.herds = action.payload;
        },
    },
});

export const { setTreatments } = treatmentSlice.actions

export const treatmentReducer = treatmentSlice.reducer
