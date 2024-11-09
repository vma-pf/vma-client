export type VaccinationTemplate = {
  name: string,
  stageTemplates: StageTemplate[],
  id: string,
}

export type CreateVaccinationTemplate = {
  titleTemplate: string,
  createVaccinationPlanIncludeStageRequest: string
}

export type TreatmentTemplate = {
  name: string,
  stageTemplates: StageTemplate[],
  treatmentGuide: {
    commonDiseaseId: string,
    title: string,
    description: string,
    cure: string,
    authorId: string,
    id: string
  },
  id: string,
}

export type StageTemplate = {
  planTemplateId: string,
  title: string,
  timeSpan: string,
  numberOfDays: number,
  toDoTemplates: [
    {
      id: string,
      description: string,
    }
  ],
  medicineTemplates: MedicineTemplate[],
  id: string,
}

export type MedicineTemplate = {
  stageTemplateId: string,
  medicineId: string,
  portionEachPig: number,
  medicineName: string,
  id: string
}