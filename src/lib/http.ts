// const SERVERURL = "https://hsc-sever-0r5m.onrender.com/api/v1"; // Replace with actual API URL
const SERVERURL = "http://35.198.240.3:10000"; // Replace with actual API URL

type ResponseObject = {
  isSuccess: boolean;
  data: any;
  errorMessage: string | null;
};

type CustomOptions = RequestInit & {
  baseUrl?: string | undefined;
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

const request = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options: CustomOptions | undefined
): Promise<any> => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const baseHeaders = {
    "Content-Type": "application/json",
  };
  const baseUrl = options?.baseUrl === undefined ? SERVERURL : options.baseUrl;
  const fullUrl = url.startsWith("/") ? baseUrl + url : baseUrl + "/" + url;

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });

  const payload: ResponseObject = await response.json();
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
  get: (url: string, options?: Omit<CustomOptions, "body"> | undefined) =>
    request("GET", url, options),
  post: (url: string, body: any, options?: Omit<CustomOptions, "body">) =>
    request("POST", url, { ...options, body }),
  put: (url: string, body: any, options?: Omit<CustomOptions, "body">) =>
    request("PUT", url, { ...options, body }),
  delete: (
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) => request("DELETE", url, { ...options, body }),
};

export default http;
