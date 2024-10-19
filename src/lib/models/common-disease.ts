export type CommonDisease = {
  id: string,
  title: string,
  description: string,
  symptom: string,
  treatment: string,
  diseaseType: string,
  createdAt: string,
  lastUpdatedAt: string
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