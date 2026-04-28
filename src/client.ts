import { EventorConfigurationError, EventorHttpError } from "./errors";
import { buildXml, parseXml } from "./xml";

export const EVENTOR_SERVERS = {
  international: "https://eventor.orienteering.org/api",
  internationalSport: "https://eventor.orienteering.sport/api",
  norway: "https://eventor.orientering.no/api",
  sweden: "https://eventor.orientering.se/api",
  australia: "https://eventor.orienteering.asn.au/api",
} as const;

export type EventorServerName = keyof typeof EVENTOR_SERVERS;
export type EventorApiKeyProvider = string | (() => string | Promise<string>);
export type EventorFetch = typeof fetch;
export type QueryValue = string | number | boolean | Date | null | undefined;
export type QueryParams = Record<string, QueryValue | readonly QueryValue[]>;
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface EventorConfig {
  apiKey?: EventorApiKeyProvider;
  baseUrl?: string;
  fetch?: EventorFetch;
  timeoutMs?: number;
  headers?: HeadersInit;
}

export interface EventorRequestOptions {
  query?: QueryParams;
  headers?: HeadersInit;
  body?: string | Record<string, unknown>;
  rootName?: string;
  raw?: boolean;
  timeoutMs?: number;
}

export class EventorHttpClient {
  readonly baseUrl: string;
  private readonly apiKey: EventorApiKeyProvider | undefined;
  private readonly fetchImpl: EventorFetch;
  private readonly timeoutMs: number;
  private readonly defaultHeaders: HeadersInit | undefined;

  constructor(config: EventorConfig = {}) {
    this.baseUrl = normalizeBaseUrl(config.baseUrl ?? EVENTOR_SERVERS.international);
    this.apiKey = config.apiKey;
    this.fetchImpl = config.fetch ?? globalThis.fetch;
    this.timeoutMs = config.timeoutMs ?? 30_000;
    this.defaultHeaders = config.headers;

    if (!this.fetchImpl) {
      throw new EventorConfigurationError(
        "No fetch implementation is available. Use Node 18+ or pass a custom fetch implementation.",
      );
    }
  }

  async request<T = unknown>(
    method: HttpMethod,
    path: string,
    options: EventorRequestOptions = {},
  ): Promise<T> {
    const raw = await this.requestRaw(method, path, options);
    return parseXml<T>(raw);
  }

  async requestRaw(
    method: HttpMethod,
    path: string,
    options: EventorRequestOptions = {},
  ): Promise<string> {
    const url = buildUrl(this.baseUrl, path, options.query);
    const headers = await this.buildHeaders(options.headers, options.body);
    const body = buildBody(options.body, options.rootName);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? this.timeoutMs);

    try {
      const requestInit: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      if (body !== undefined) {
        requestInit.body = body;
      }

      const response = await this.fetchImpl(url, requestInit);
      const responseText = await response.text();

      if (!response.ok) {
        let responseBody: unknown;
        try {
          responseBody = responseText ? parseXml(responseText) : undefined;
        } catch {
          responseBody = undefined;
        }

        throw new EventorHttpError({
          status: response.status,
          statusText: response.statusText,
          url,
          responseText,
          responseBody,
        });
      }

      return responseText;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async buildHeaders(headers: HeadersInit | undefined, body: EventorRequestOptions["body"]) {
    const merged = new Headers(this.defaultHeaders);
    const apiKey = await resolveApiKey(this.apiKey);

    if (apiKey) {
      merged.set("ApiKey", apiKey);
    }

    if (body !== undefined) {
      merged.set("Content-Type", "application/xml");
    }

    merged.set("Accept", "application/xml, text/xml, */*");

    if (headers) {
      new Headers(headers).forEach((value, key) => merged.set(key, value));
    }

    return merged;
  }
}

export function normalizeBaseUrl(baseUrl: string): string {
  if (!baseUrl.trim()) {
    throw new EventorConfigurationError("baseUrl must not be empty.");
  }

  try {
    const url = new URL(baseUrl);
    url.pathname = url.pathname.replace(/\/+$/, "");
    return url.toString().replace(/\/+$/, "");
  } catch {
    throw new EventorConfigurationError(`Invalid Eventor base URL: ${baseUrl}`);
  }
}

export function buildUrl(baseUrl: string, path: string, query?: QueryParams): string {
  const url = new URL(`${baseUrl}/${path.replace(/^\/+/, "")}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    const serialized = serializeQueryValue(value);
    if (serialized !== undefined) {
      url.searchParams.set(key, serialized);
    }
  }

  return url.toString();
}

function serializeQueryValue(value: QueryParams[string]): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (Array.isArray(value)) {
    const values = value
      .map((item) => serializeQueryValue(item))
      .filter((item): item is string => item !== undefined);
    return values.length > 0 ? values.join(",") : undefined;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function buildBody(body: EventorRequestOptions["body"], rootName?: string): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }

  if (typeof body === "string") {
    return body;
  }

  return rootName ? buildXml(body, { rootName }) : buildXml(body);
}

async function resolveApiKey(apiKey: EventorApiKeyProvider | undefined): Promise<string | undefined> {
  if (typeof apiKey === "function") {
    return apiKey();
  }

  return apiKey;
}
