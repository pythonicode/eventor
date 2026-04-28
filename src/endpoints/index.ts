import type { EventorHttpClient } from "../client";
import type {
  ActivityListResponse,
  ActivityResponse,
  CompetitorCountListResponse,
  CompetitorListResponse,
  CompetitorResponse,
  DocumentListResponse,
  EntryFeeListResponse,
  EntryListResponse,
  EventClassListResponse,
  EventListResponse,
  EventResponse,
  ExternalLoginUrlResponse,
  ImportResultListResultResponse,
  OrganisationListResponse,
  OrganisationResponse,
  PersonListResponse,
  PersonResponse,
  ResultListListResponse,
  ResultListResponse,
  StartListListResponse,
  StartListResponse,
} from "../generated/eventor-types";
import type {
  ActivitiesListParams,
  ActivityGetParams,
  AuthenticatePersonParams,
  CompetitorCountParams,
  CompetitorsListParams,
  EntriesListParams,
  EventClassesParams,
  EventDocumentsParams,
  EventsListParams,
  ExportCompetitorsParams,
  ExternalLoginUrlParams,
  OrganisationsListParams,
  PersonsByOrganisationParams,
  ResultsByEventParams,
  ResultsByOrganisationParams,
  ResultsByPersonParams,
  StartsByEventParams,
  StartsByOrganisationParams,
  StartsByPersonParams,
  WrsResultsByEventParams,
  XmlBody,
} from "../types";
import { toQuery } from "../types";

export class EventsEndpoint {
  constructor(private readonly client: EventorHttpClient) {}

  list(params: EventsListParams = {}) {
    return this.client.request<EventListResponse>("GET", "/events", { query: toQuery(params) });
  }

  listWrs(params: EventsListParams = {}) {
    return this.client.request<EventListResponse>("GET", "/wrsevents", { query: toQuery(params) });
  }

  listIofXml(params: EventsListParams = {}) {
    return this.client.request<EventListResponse>("GET", "/events/iofxml", { query: toQuery(params) });
  }

  get(eventId: number) {
    return this.client.request<EventResponse>("GET", `/event/${eventId}`);
  }

  getIofXml(eventId: number) {
    return this.client.request<EventListResponse>("GET", `/event/iofxml/${eventId}`);
  }

  documents(params: EventDocumentsParams = {}) {
    return this.client.request<DocumentListResponse>("GET", "/events/documents", {
      query: toQuery(params),
    });
  }
}

export class EventClassesEndpoint {
  constructor(private readonly client: EventorHttpClient) {}

  listByEvent(params: EventClassesParams) {
    return this.client.request<EventClassListResponse>("GET", "/eventclasses", {
      query: toQuery(params),
    });
  }
}

export class EntryFeesEndpoint {
  constructor(private readonly client: EventorHttpClient) {}

  listByEvent(eventId: number) {
    return this.client.request<EntryFeeListResponse>("GET", `/entryfees/events/${eventId}`);
  }
}

export class OrganisationsEndpoint {
  constructor(private readonly client: EventorHttpClient) {}

  current() {
    return this.client.request<OrganisationResponse>("GET", "/organisation/apiKey");
  }

  list(params: OrganisationsListParams = {}) {
    return this.client.request<OrganisationListResponse>("GET", "/organisations", {
      query: toQuery(params),
    });
  }

  listIofXml() {
    return this.client.request<OrganisationListResponse>("GET", "/organisations/iofxml");
  }

  get(id: number) {
    return this.client.request<OrganisationResponse>("GET", `/organisation/${id}`);
  }
}

export class PersonsEndpoint {
  constructor(private readonly client: EventorHttpClient) {}

  listByOrganisation(params: PersonsByOrganisationParams) {
    const { organisationId, ...query } = params;
    return this.client.request<PersonListResponse>(
      "GET",
      `/persons/organisations/${organisationId}`,
      { query: toQuery(query) },
    );
  }
}

export class EntriesEndpoint {
  constructor(private readonly client: EventorHttpClient) {}

  list(params: EntriesListParams = {}) {
    return this.client.request<EntryListResponse>("GET", "/entries", { query: toQuery(params) });
  }

  competitorCount(params: CompetitorCountParams) {
    return this.client.request<CompetitorCountListResponse>("GET", "/competitorcount", {
      query: toQuery(params),
    });
  }
}

export class StartsEndpoint {
  constructor(private readonly client: EventorHttpClient) {}

  byEvent(params: StartsByEventParams) {
    return this.client.request<StartListResponse>("GET", "/starts/event", { query: toQuery(params) });
  }

  byEventIofXml(params: StartsByEventParams) {
    return this.client.request<StartListResponse>("GET", "/starts/event/iofxml", {
      query: toQuery(params),
    });
  }

  byPerson(params: StartsByPersonParams) {
    return this.client.request<StartListListResponse>("GET", "/starts/person", {
      query: toQuery(params),
    });
  }

  byOrganisation(params: StartsByOrganisationParams) {
    return this.client.request<StartListResponse>("GET", "/starts/organisation", {
      query: toQuery(params),
    });
  }
}

export class ResultsEndpoint {
  constructor(private readonly client: EventorHttpClient) {}

  byEvent(params: ResultsByEventParams) {
    return this.client.request<ResultListResponse>("GET", "/results/event", {
      query: toQuery(params),
    });
  }

  byEventIofXml(params: Omit<ResultsByEventParams, "top">) {
    return this.client.request<ResultListResponse>("GET", "/results/event/iofxml", {
      query: toQuery(params),
    });
  }

  wrsByEvent(params: WrsResultsByEventParams) {
    return this.client.request<ResultListResponse>("GET", "/wrsresults/event", {
      query: toQuery(params),
    });
  }

  byPerson(params: ResultsByPersonParams) {
    return this.client.request<ResultListListResponse>("GET", "/results/person", {
      query: toQuery(params),
    });
  }

  byOrganisation(params: ResultsByOrganisationParams) {
    return this.client.request<ResultListResponse>("GET", "/results/organisation", {
      query: toQuery(params),
    });
  }
}

export class ActivitiesEndpoint {
  constructor(private readonly client: EventorHttpClient) {}

  list(params: ActivitiesListParams) {
    return this.client.request<ActivityListResponse>("GET", "/activities", { query: toQuery(params) });
  }

  get(params: ActivityGetParams) {
    return this.client.request<ActivityResponse>("GET", "/activity", { query: toQuery(params) });
  }
}

export class CompetitorsEndpoint {
  constructor(private readonly client: EventorHttpClient) {}

  list(params: CompetitorsListParams) {
    return this.client.request<CompetitorListResponse>("GET", "/competitors", {
      query: toQuery(params),
    });
  }

  get(competitorId: number) {
    return this.client.request<CompetitorResponse>("GET", `/competitor/${competitorId}`);
  }

  save(body: XmlBody) {
    return this.client.request<CompetitorResponse>("PUT", "/competitor", {
      body,
      ...(typeof body === "string" ? {} : { rootName: "Competitor" }),
    });
  }

  export(params: ExportCompetitorsParams = {}) {
    return this.client.request<CompetitorListResponse>("GET", "/export/competitors", {
      query: toQuery(params),
    });
  }
}

export class AuthEndpoint {
  constructor(private readonly client: EventorHttpClient) {}

  externalLoginUrl(params: ExternalLoginUrlParams) {
    return this.client.request<ExternalLoginUrlResponse>("GET", "/externalLoginUrl", {
      query: toQuery(params),
    });
  }

  authenticatePerson(params: AuthenticatePersonParams) {
    return this.client.request<PersonResponse>("GET", "/authenticatePerson", {
      headers: {
        Username: params.username,
        Password: params.password,
      },
    });
  }
}

export class ImportsEndpoint {
  constructor(private readonly client: EventorHttpClient) {}

  startList(body: XmlBody) {
    return this.client.request<StartListResponse>("POST", "/import/startlist", {
      body,
      ...(typeof body === "string" ? {} : { rootName: "StartList" }),
    });
  }

  resultList(body: XmlBody) {
    return this.client.request<ImportResultListResultResponse>("POST", "/import/resultlist", {
      body,
      ...(typeof body === "string" ? {} : { rootName: "ResultList" }),
    });
  }
}
