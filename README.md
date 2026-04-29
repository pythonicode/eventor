# Eventor API SDK

TypeScript SDK for the IOF Eventor API. It wraps Eventor's XML REST API in a small typed client, defaults to the international Eventor host, and still lets you access raw XML when you need exact API output.

Useful API references:

- [Eventor OpenAPI Swagger UI](https://orienteering-oss.github.io/eventor-api-openapi-spec/)
- [IOF Eventor API documentation](https://eventor.orienteering.sport/api/documentation)

## Installation

```sh
npm install eventor-api-sdk
yarn add eventor-api-sdk
pnpm add eventor-api-sdk
bun add eventor-api-sdk
```

Node 18 or newer is recommended because the SDK uses the built-in `fetch` API.

## Quick Start

```ts
import { Eventor } from "eventor-api-sdk";

const client = new Eventor({
  apiKey: process.env.EVENTOR_API_KEY,
});

const events = await client.events.list({
  fromDate: "2026-01-01",
  toDate: "2026-12-31",
  includeAttributes: true,
});

console.log(events.EventList.Event);
```

The default `baseUrl` is `https://eventor.orienteering.org/api`.

## Configuration

```ts
const client = new Eventor({
  apiKey: process.env.EVENTOR_API_KEY,
  baseUrl: Eventor.servers.international,
  timeoutMs: 30_000,
});
```

Built-in server presets:

- `Eventor.servers.international`
- `Eventor.servers.internationalSport`
- `Eventor.servers.norway`
- `Eventor.servers.sweden`
- `Eventor.servers.australia`

You can also pass a custom Eventor-compatible API URL:

```ts
const client = new Eventor({
  apiKey: process.env.EVENTOR_API_KEY,
  baseUrl: "https://eventor.orientering.se/api",
});
```

The API key is sent using Eventor's required `ApiKey` HTTP header. Keep API keys on the server side; do not expose them in browser bundles or public client code.

## Common Examples

List events:

```ts
const events = await client.events.list({
  fromDate: "2026-04-01",
  toDate: "2026-04-30",
  classificationIds: [1, 2, 3],
});
```

Get one event:

```ts
const event = await client.events.get(8248);
```

Fetch event documents:

```ts
const documents = await client.events.documents({
  eventIds: [8248, 15365],
});
```

List organisations:

```ts
const organisations = await client.organisations.list({
  includeProperties: true,
});
```

Fetch members for an organisation:

```ts
const people = await client.persons.listByOrganisation({
  organisationId: 273,
  includeContactDetails: true,
  includePersonIdentifiers: true,
});
```

Fetch entries:

```ts
const entries = await client.entries.list({
  eventIds: [8248],
  includePersonElement: true,
  includeOrganisationElement: true,
  includeEntryFees: true,
});
```

Fetch starts:

```ts
const starts = await client.starts.byEvent({ eventId: 8248 });

const clubStarts = await client.starts.byOrganisation({
  organisationIds: [273],
  eventId: 8248,
});
```

Fetch results:

```ts
const results = await client.results.byEvent({
  eventId: 8248,
  includeSplitTimes: true,
  top: 50,
});
```

Authenticate a person:

```ts
const person = await client.auth.authenticatePerson({
  username: "OlaNordmann",
  password: "0r13nt3r1n5",
});
```

Create an external login URL:

```ts
const loginUrl = await client.auth.externalLoginUrl({
  personId: 1,
  organisationId: 273,
});
```

Save competitor settings:

```ts
await client.competitors.save({
  PersonId: 1,
  ControlCard: [
    {
      "#text": "99999",
      "@_punchingSystem": "SI",
    },
  ],
});
```

Import a result list:

```ts
await client.imports.resultList(resultListXml);
```

## Raw XML

Parsed XML is returned by default. To receive the exact XML response, use `requestRaw`:

```ts
const xml = await client.requestRaw("GET", "/events", {
  query: {
    fromDate: "2026-01-01",
    toDate: "2026-12-31",
  },
});
```

For endpoints that are not wrapped yet, use the generic request method:

```ts
const response = await client.request("GET", "/events", {
  query: { eventIds: [8248, 15365] },
});
```

## Parsed XML Shape

The SDK uses `fast-xml-parser` with attributes preserved using the `@_` prefix:

```ts
const parsed = await client.events.list();
const first = parsed.EventList.Event?.[0];

console.log(first?.EventId);
console.log(first?.["@_eventForm"]);
```

Common repeated elements are normalized to arrays, so list roots such as `EventList.Event`, `OrganisationList.Organisation`, `PersonList.Person`, `StartList.Start`, and `ResultList.ClassResult` can be handled consistently.

## Endpoint Coverage

The SDK includes grouped methods for:

- Events, WRS events, IOF XML event variants, and event documents.
- Event classes and entry fees.
- Organisations and the organisation for the current API key.
- Persons by organisation.
- Entries and competitor counts.
- Starts by event, person, and organisation, including IOF XML start lists.
- Results by event, person, and organisation, including WRS and IOF XML result endpoints.
- Activities.
- Competitor settings and competitor export.
- External login URLs and person authentication.
- Start list and result list import endpoints.

Refer to the [Eventor OpenAPI Swagger UI](https://orienteering-oss.github.io/eventor-api-openapi-spec/) and [IOF Eventor API documentation](https://eventor.orienteering.sport/api/documentation) for the complete upstream method definitions.

## Error Handling

```ts
import { EventorHttpError, EventorParseError } from "eventor-api-sdk";

try {
  await client.events.list();
} catch (error) {
  if (error instanceof EventorHttpError) {
    console.error(error.status, error.statusText, error.responseText);
  }

  if (error instanceof EventorParseError) {
    console.error("Invalid XML from Eventor", error.cause);
  }
}
```

## Caching

Eventor asks API consumers to cache frequently used data where possible. For example, organisation members may only need to be refreshed daily, while event results may need shorter cache windows during active events. All API requests are logged by Eventor and high request volumes for a single API key may be investigated.
