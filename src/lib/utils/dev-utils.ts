export const pluck = (pluckKey: string, data: any[]): any[] => {
  return data.map((x) => x[pluckKey]);
};
