import { XMLBuilder, XMLParser } from "fast-xml-parser";

import { EventorParseError } from "./errors";

const ARRAY_TAGS = new Set([
  "Activity",
  "Address",
  "ClassResult",
  "Competitor",
  "ControlCard",
  "Document",
  "Entry",
  "EntryBreak",
  "EntryFee",
  "Event",
  "EventAttribute",
  "EventClass",
  "EventClassification",
  "EventRace",
  "Given",
  "HashTableEntry",
  "Organisation",
  "OrganisationType",
  "Person",
  "PersonResult",
  "RaceResult",
  "Result",
  "Role",
  "Service",
  "ServiceRequest",
  "SplitTime",
  "Start",
  "StartList",
  "TeamResult",
  "Tele",
  "WebURL",
  "WrsResult",
]);

export interface ParseXmlOptions {
  alwaysArray?: readonly string[];
}

export interface BuildXmlOptions {
  rootName?: string;
}

export function parseXml<T = unknown>(xml: string, options: ParseXmlOptions = {}): T {
  try {
    const arrayTags = new Set([...ARRAY_TAGS, ...(options.alwaysArray ?? [])]);
    const parser = new XMLParser({
      attributeNamePrefix: "@_",
      ignoreAttributes: false,
      parseAttributeValue: true,
      parseTagValue: true,
      processEntities: true,
      trimValues: true,
      isArray: (name) => arrayTags.has(name),
    });

    return parser.parse(xml) as T;
  } catch (error) {
    throw new EventorParseError("Unable to parse Eventor XML response.", xml, error);
  }
}

export function buildXml(value: unknown, options: BuildXmlOptions = {}): string {
  try {
    const builder = new XMLBuilder({
      attributeNamePrefix: "@_",
      format: true,
      ignoreAttributes: false,
      suppressEmptyNode: true,
    });

    const document = options.rootName ? { [options.rootName]: value } : value;
    return builder.build(document);
  } catch (error) {
    throw new EventorParseError("Unable to build Eventor XML request body.", String(value), error);
  }
}
