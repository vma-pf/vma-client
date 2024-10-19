export type TreatmentGuide = {
  id: string,
  diseaseTitle: string,
  diseaseDescription: string,
  diseaseSymptoms: string,
  treatmentTitle: string,
  treatmentDescription: string,
  diseaseType: string,
  cure: string,
  authorName: string,
  appliedTreatmentPlans: []
}

export type CreateTreatmentGuide = {
  diseaseTitle: string,
  diseaseDescription?: string,
  diseaseSymptoms?: string,
  treatmentTitle?: string,
  treatmentDescription?: string,
  diseaseType?: string,
  cure: string,
}

export type UpdateTreatmentGuide = {
  diseaseTitle: string,
  diseaseDescription?: string,
  diseaseSymptoms?: string,
  treatmentTitle?: string,
  treatmentDescription?: string,
  diseaseType?: string,
  cure: string,
}