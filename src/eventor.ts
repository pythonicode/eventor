import {
  EVENTOR_SERVERS,
  EventorHttpClient,
  type EventorConfig,
  type EventorRequestOptions,
  type HttpMethod,
} from "./client";
import {
  ActivitiesEndpoint,
  AuthEndpoint,
  CompetitorsEndpoint,
  EntriesEndpoint,
  EntryFeesEndpoint,
  EventClassesEndpoint,
  EventsEndpoint,
  ImportsEndpoint,
  OrganisationsEndpoint,
  PersonsEndpoint,
  ResultsEndpoint,
  StartsEndpoint,
} from "./endpoints";

export class Eventor {
  static readonly servers = EVENTOR_SERVERS;

  readonly activities: ActivitiesEndpoint;
  readonly auth: AuthEndpoint;
  readonly classes: EventClassesEndpoint;
  readonly competitors: CompetitorsEndpoint;
  readonly entries: EntriesEndpoint;
  readonly entryFees: EntryFeesEndpoint;
  readonly events: EventsEndpoint;
  readonly imports: ImportsEndpoint;
  readonly organisations: OrganisationsEndpoint;
  readonly persons: PersonsEndpoint;
  readonly results: ResultsEndpoint;
  readonly starts: StartsEndpoint;

  private readonly client: EventorHttpClient;

  constructor(config: EventorConfig = {}) {
    this.client = new EventorHttpClient(config);
    this.activities = new ActivitiesEndpoint(this.client);
    this.auth = new AuthEndpoint(this.client);
    this.classes = new EventClassesEndpoint(this.client);
    this.competitors = new CompetitorsEndpoint(this.client);
    this.entries = new EntriesEndpoint(this.client);
    this.entryFees = new EntryFeesEndpoint(this.client);
    this.events = new EventsEndpoint(this.client);
    this.imports = new ImportsEndpoint(this.client);
    this.organisations = new OrganisationsEndpoint(this.client);
    this.persons = new PersonsEndpoint(this.client);
    this.results = new ResultsEndpoint(this.client);
    this.starts = new StartsEndpoint(this.client);
  }

  request<T = unknown>(method: HttpMethod, path: string, options: EventorRequestOptions = {}) {
    return this.client.request<T>(method, path, options);
  }

  requestRaw(method: HttpMethod, path: string, options: EventorRequestOptions = {}) {
    return this.client.requestRaw(method, path, options);
  }
}
