const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(input: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${input}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    throw new Error("Request Failed");
  }
  return response.json();
}

// import type { RequestOptions } from "./types";

// const BASE_URL = import.meta.env.VITE_API_URL;

// async function request<T>(
//   endpoint: string,
//   options: RequestOptions = {},
// ): Promise<T> {
//   const response = await fetch(`${BASE_URL}${endpoint}`, {
//     headers: {
//       "Content-Type": "application/json",
//       ...options.headers,
//     },
//     ...options,
//   });

//   if (!response.ok) {
//     throw new Error("Request failed");
//   }

//   return response.json() as Promise<T>;
// }
