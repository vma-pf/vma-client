export type CommonDisease = {
  id: string,
  title: string,
  description: string,
  symptom: string,
  treatment: string,
  diseaseType: string,
  createdAt: string,
  lastUpdatedAt: string,
  treatmentGuides?: {
    commonDiseaseId: string,
    title: string,
    description: string,
    cure: string,
    authorId: string,
    id: string,
  }[],
}

export type CreateCommonDisease = {
  title: string,
  description?: string,
  symptom?: string,
  treatment?: string,
  diseaseType?: string,
}

export type UpdateCommonDisease = {
  title?: string,
  description?: string,
  symptom?: string,
  treatment?: string,
  diseaseType?: string,
}