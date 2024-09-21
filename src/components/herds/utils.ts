export const getClassNameByHerdStatus = (
  status: string,
  isCurrentTab: boolean
) => {
  if (isCurrentTab) {
    return "text-blue-700 bg-blue-100 border border-blue-300 rounded-lg dark:bg-gray-800 dark:border-blue-800 dark:text-blue-400";
  } else {
    switch (status) {
      case "done": {
        return "text-green-700 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400";
      }
      case "not_yet": {
        ("text-gray-900 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400");
      }
    }
  }
};

export const getBorderClassNameByHerdStatus = (
  status: string,
  isCurrentTab: boolean
) => {
  if (isCurrentTab) {
    return "border-blue-600 rounded-full shrink-0 dark:border-blue-500";
  } else {
    switch (status) {
      case "done": {
        return "border-green-600 rounded-full shrink-0 dark:border-green-500";
      }
      case "not_yet": {
        return "border-gray-600 rounded-full shrink-0 dark:border-gray-500";
      }
    }
  }
};
