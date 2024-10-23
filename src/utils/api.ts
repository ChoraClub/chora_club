// utils/api.ts

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions extends RequestInit {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string> | Headers;
}

export async function fetchApi(
  endpoint: string,
  options: RequestOptions | RequestInit = {}
) {
  console.log("endpoint", endpoint);
  console.log("options", options);
  const { method = "GET", body, headers = {}, ...otherOptions } = options;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const fetchOptions: RequestInit = {
    method,
    headers: { ...defaultHeaders, ...headers },
    ...otherOptions,
  };

  if (body) {
    if (typeof body === "string") {
      fetchOptions.body = body;
    } else if (method === "POST" || method === "PUT") {
      fetchOptions.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`/api/proxy${endpoint}`, fetchOptions);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}
