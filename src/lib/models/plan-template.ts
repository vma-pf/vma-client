export type VaccinationTemplate = {
  titleTemplate: string,
  contentTemplate: string
}

export type CreateVaccinationTemplate = {
  titleTemplate: string,
  createVaccinationPlanIncludeStageRequest: string
}

export type PlanTemplate = {
  name: string,
  stageTemplates: StageTemplate[],
  treatmentGuide?: {
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
  toDoTemplates:
  {
    id: string | null,
    description: string,
  }[],
  medicineTemplates: MedicineTemplate[],
  id: string | null,
}

export type MedicineTemplate = {
  stageTemplateId: string,
  medicineId: string,
  portionEachPig: number,
  medicineName: string,
  id: string
}

// VaccinationTemplate
// export type VaccinationTemplate = {
//   titleTemplate: string,
//   contentTemplate: string
// }