import http from "@oursrc/lib/http";
import { handleErrorApi } from "@oursrc/lib/utils";

export const apiRequest = {
  getAllPosts: () => {
    try {
      const res = http.get("posts");
      return res;
    } catch (error) {
      handleErrorApi({ error });
    }
  },
};
