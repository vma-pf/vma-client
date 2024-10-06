import { decode } from "punycode";
import { ResponseObject } from "./models/response-object";
import { decodeToken } from "./utils";

// const SERVERURL = "https://hsc-sever-0r5m.onrender.com/api/v1"; // Replace with actual API URL
const SERVERURL = "https://vma-server.io.vn"; // Replace with actual API URL

type CustomOptions = RequestInit & {
  baseUrl?: string | undefined;
  params?: Record<string, string> | undefined;
};

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: any;
  constructor({ status, payload }: { status: number; payload: any }) {
    super(`HTTP Error: ${status}`);
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: number;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: number;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options: CustomOptions | undefined
): Promise<any> => {
  const token = localStorage.getItem("accessToken") || "";
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const params = options?.params || undefined;
  const baseHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const baseUrl = options?.baseUrl === undefined ? SERVERURL : options.baseUrl;
  let fullUrl = url.startsWith("/") ? baseUrl + url : baseUrl + "/" + url;

  const searchParams = new URLSearchParams(params);

  if (params) {
    fullUrl += "?" + searchParams.toString();
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });

  // check if token is expired before 10 minutes
  if (token && decodeToken(token).exp - Date.now() / 1000 < 600) {
    const res = await fetch(`${SERVERURL}/api/auth/refresh-token?refreshToken=${localStorage.getItem("refreshToken") || ""}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
    });
    const newToken = await res.json();
    if (newToken.isSuccess) {
      localStorage.setItem("accessToken", newToken.data.accessToken);
    }
  }

  const payload: Response = await response.json();
  // const data = {
  //   status: response.status,
  //   payload,
  // };

  // if (!response.ok) {
  //   throw new HttpError({ status: response.status, payload });
  // }

  // if (response.status === 204) {
  //   return null;
  // }
  return payload;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
