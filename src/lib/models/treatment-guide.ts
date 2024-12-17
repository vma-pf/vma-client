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
  title: string,
  description: string,
  cure: string,
  commonDiseaseId: string,
}