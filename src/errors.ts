export interface EventorHttpErrorOptions {
  status: number;
  statusText: string;
  url: string;
  responseText: string;
  responseBody?: unknown;
}

export class EventorHttpError extends Error {
  readonly name = "EventorHttpError";
  readonly status: number;
  readonly statusText: string;
  readonly url: string;
  readonly responseText: string;
  readonly responseBody: unknown;

  constructor(options: EventorHttpErrorOptions) {
    super(`Eventor API request failed with ${options.status} ${options.statusText}`);
    this.status = options.status;
    this.statusText = options.statusText;
    this.url = options.url;
    this.responseText = options.responseText;
    this.responseBody = options.responseBody;
  }
}

export class EventorParseError extends Error {
  readonly name = "EventorParseError";
  readonly source: string;
  readonly cause: unknown;

  constructor(message: string, source: string, cause: unknown) {
    super(message);
    this.source = source;
    this.cause = cause;
  }
}

export class EventorConfigurationError extends Error {
  readonly name = "EventorConfigurationError";

  constructor(message: string) {
    super(message);
  }
}
