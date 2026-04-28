import { describe, expect, it } from "vitest";

import { buildUrl, Eventor, EventorHttpError, parseXml } from "../src";
import type { EventListResponse } from "../src";

type FetchCall = [RequestInfo | URL, RequestInit | undefined];
type MockFetch = typeof fetch & { calls: FetchCall[] };

function createFetchMock(response: Response) {
  const calls: FetchCall[] = [];
  const mock = async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push([input, init]);
    return response.clone();
  };

  return Object.assign(mock, { calls }) as MockFetch;
}

const eventListXml = `
<EventList>
  <Event>
    <EventId>123</EventId>
    <Name>Test Event</Name>
    <EventClassificationId>4</EventClassificationId>
    <EventStatusId>1</EventStatusId>
    <StartDate>
      <Date>2026-04-01</Date>
    </StartDate>
  </Event>
</EventList>
`;

describe("Eventor", () => {
  it("defaults to the international Eventor API and sends the ApiKey header", async () => {
    const fetchMock = createFetchMock(new Response(eventListXml, { status: 200 }));
    const client = new Eventor({ apiKey: "secret", fetch: fetchMock });

    await client.events.list({ fromDate: "2026-01-01", includeAttributes: true });

    const [url, init] = fetchMock.calls[0]!;
    expect(url).toBe(
      "https://eventor.orienteering.org/api/events?fromDate=2026-01-01&includeAttributes=true",
    );
    expect(new Headers(init?.headers).get("ApiKey")).toBe("secret");
  });

  it("serializes arrays as comma-separated query values", () => {
    expect(buildUrl("https://example.com/api", "/events", { eventIds: [1, 2, 3] })).toBe(
      "https://example.com/api/events?eventIds=1%2C2%2C3",
    );
  });

  it("parses XML responses and normalizes repeated list elements to arrays", async () => {
    const fetchMock = createFetchMock(new Response(eventListXml, { status: 200 }));
    const client = new Eventor({ apiKey: "secret", fetch: fetchMock });

    const response = await client.events.list();

    expect(response.EventList.Event).toHaveLength(1);
    expect(response.EventList.Event?.[0]?.EventId).toBe(123);
    expect(response.EventList.Event?.[0]?.Name).toBe("Test Event");
  });

  it("returns raw XML through requestRaw", async () => {
    const fetchMock = createFetchMock(new Response(eventListXml, { status: 200 }));
    const client = new Eventor({ apiKey: "secret", fetch: fetchMock });

    const response = await client.requestRaw("GET", "/events");

    expect(response).toContain("<EventList>");
  });

  it("sends username and password headers for authenticatePerson", async () => {
    const fetchMock = createFetchMock(new Response("<Person><PersonId>7</PersonId></Person>"));
    const client = new Eventor({ apiKey: "secret", fetch: fetchMock });

    await client.auth.authenticatePerson({ username: "OlaNordmann", password: "0r13nt3r1n5" });

    const [, init] = fetchMock.calls[0]!;
    const headers = new Headers(init?.headers);
    expect(headers.get("Username")).toBe("OlaNordmann");
    expect(headers.get("Password")).toBe("0r13nt3r1n5");
  });

  it("serializes object request bodies as XML", async () => {
    const fetchMock = createFetchMock(new Response("<Competitor><CompetitorId>1</CompetitorId></Competitor>"));
    const client = new Eventor({ apiKey: "secret", fetch: fetchMock });

    await client.competitors.save({ PersonId: 1, ControlCard: ["99999"] });

    const [, init] = fetchMock.calls[0]!;
    expect(init?.method).toBe("PUT");
    expect(String(init?.body)).toContain("<Competitor>");
    expect(String(init?.body)).toContain("<PersonId>1</PersonId>");
  });

  it("throws EventorHttpError for non-2xx responses", async () => {
    const fetchMock = createFetchMock(
      new Response("<Error>Forbidden</Error>", { status: 403, statusText: "Forbidden" }),
    );
    const client = new Eventor({ apiKey: "secret", fetch: fetchMock });

    await expect(client.events.list()).rejects.toBeInstanceOf(EventorHttpError);
  });
});

describe("parseXml", () => {
  it("preserves XML attributes with the @_ prefix", () => {
    const parsed = parseXml<EventListResponse>('<EventList><Event eventForm="IndSingleDay"><EventId>1</EventId></Event></EventList>');

    expect(parsed.EventList.Event?.[0]?.["@_eventForm"]).toBe("IndSingleDay");
  });
});
