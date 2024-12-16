import http from "../http";
import { ResponseObject } from "../models/response-object";

export const notificationService = {
  getNotification: (pageIndex: number, pageSize: number) =>
    http.get<ResponseObject<any>>(`notifications`, {
      params: {
        pageIndex: pageIndex.toString() ?? "1",
        pageSize: pageSize.toString() ?? "5",
      },
    }),
  sendWariningAI: (model: {
    cageId?: string;
    content: string;
    image: Blob;
  }) => {
    const formData = new FormData();
    formData.append("cageId", model.cageId ?? "");
    formData.append("content", model.content);
    formData.append("image", model.image);

    return http.post("api/notification/warning-AI", formData);
  },
  detectPigByVideo: async (model: { video: Blob }) => {
    const formData = new FormData();
    formData.append("video", model.video);

    try {
      const response = await fetch(
        "http://smartpigfarm.ddns.net/process_helath_classification_video",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
};
