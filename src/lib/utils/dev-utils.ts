export const pluck = (pluckKey: string, data: any[]): any[] => {
  return data.map((x) => x[pluckKey]);
};

export const debounce = (func: any, delay: number) => {
  let timeout: any = null;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const throttle = (func: Function, delay: number) => {
  let shouldWait = false;
  let lastArgs: any = null;
  return (...args: any[]) => {
    if (shouldWait) {
      lastArgs = args;
      return;
    }
    func(...args);
    shouldWait = true;
    setTimeout(() => {
      shouldWait = false;
      if (lastArgs === null) {
        shouldWait = false;
      } else {
        func(...lastArgs);
        lastArgs = null;
      }
    }, delay);
  };
}
