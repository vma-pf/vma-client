import { TreatmentGuide } from "./treatment-guide"

export type CreatePlanTemplate = {
  treatmentGuideId?: string | null,
  name: string,
  stageTemplates: CreatePlanStageTemplate[]
}

export type CreatePlanStageTemplate = {
  title: string,
  timeSpan: string,
  numberOfDays: number
  toDoTemplates: TodoTemplate[],
  medicineTemplates: MedicineTemplate[],
}

export type PlanTemplate = {
  name: string,
  stageTemplates: PlanStagesTemplate[]
  treatmentGuide?: TreatmentGuide
}

export type PlanStagesTemplate = {
  planTemplateId: string,
  title: string,
  timeSpan: string,
  numberOfDays: number
  toDoTemplates: TodoTemplate[],
  medicineTemplates: MedicineTemplate[],
}

export type TodoTemplate = {
  description: string
}

export type MedicineTemplate = {
  medicineId: string,
  portionOfPig?: number,
  medicineName?: string
}