import http from "@oursrc/lib/http";

export const apiRequest = {
  login: () =>
    http.post("auth/login", {
      username: "duy",
      password: "123",
    }),

  setTokenToCookie: (sessionToken: string) =>
    http.post(
      "/api/auth",
      {
        sessionToken,
      },
      { baseUrl: "" }
    ),

  logoutFromNextServerToServer: (sessionToken: string) =>
    http.post(
      "auth/logout",
      {
        refreshToken: sessionToken,
      },
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
      }
    ),
  logoutFromNextClientToNextServer: () =>
    http.post(
      "/api/auth/logout",
      {},
      {
        baseUrl: "",
      }
    ),
};
