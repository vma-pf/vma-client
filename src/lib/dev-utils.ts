export const pluck = (pluckKey: string, data: []): any[] => {
  return data.map((x) => x[pluckKey]);
};
