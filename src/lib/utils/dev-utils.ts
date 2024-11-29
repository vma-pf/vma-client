export const pluck = (pluckKey: string, data: any[]): any[] => {
  return data.map((x) => x[pluckKey]);
};

export const checkTime = (msg: any) => {
  const diffTime = new Date().getTime() - new Date(msg.createdAt).getTime();
  const minutes = Math.floor(diffTime / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const timeAgo =
    minutes < 60
      ? `${minutes} phút trước`
      : hours < 24
        ? `${hours} giờ trước`
        : days < 7
          ? `${days} ngày trước`
          : days < 30
            ? `${days} tuần trước`
            : `${days} tháng trước`;

  return timeAgo;
};

export const calculateProgress = (startDate: string, endDate: string) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  return ((now - start) / (end - start)) * 100;
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
