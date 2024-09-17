import http from "@oursrc/lib/http";
import { handleErrorApi } from "@oursrc/lib/utils";
import { cookies } from "next/headers";

const cookieStore = cookies();
const sessionToken = cookieStore.get("sessionToken") || null;

export const apiRequest = {
  getAllPackages: () => {
    try {
      const res = http.get("package/getAllPackages", {
        headers: { Authorization: `Bearer ${sessionToken?.value}` },
      });
      return res;
    } catch (error) {
      handleErrorApi({ error });
    }
  },
};
