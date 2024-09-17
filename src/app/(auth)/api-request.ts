import http from "@oursrc/lib/http";

export const apiRequest = {
  login: (username: string, password: string) =>
    http.post("auth/login", {
      username: username,
      password: password,
    }),

  setTokenToCookie: (sessionToken: string, refreshToken: string) =>
    http.post(
      "/api/auth",
      {
        sessionToken,
        refreshToken,
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
