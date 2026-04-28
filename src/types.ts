import type { QueryParams } from "./client";

export type IdList = string | number | readonly number[];
export type EventorDateTime = string | Date;
export type XmlBody = string | Record<string, unknown>;

export interface RawResponseOption {
  raw?: boolean;
}

export interface EventsListParams {
  fromDate?: EventorDateTime;
  toDate?: EventorDateTime;
  fromModifyDate?: EventorDateTime;
  toModifyDate?: EventorDateTime;
  eventIds?: IdList;
  eventRaceId?: number;
  organisationIds?: IdList;
  classificationIds?: IdList;
  includeEntryBreaks?: boolean;
  includeAttributes?: boolean;
  parentIds?: IdList;
}

export type EventDocumentsParams = Pick<
  EventsListParams,
  "fromDate" | "toDate" | "eventIds" | "organisationIds"
>;

export interface EventClassesParams {
  eventId: number;
  includeEntryFees?: boolean;
}

export interface OrganisationsListParams {
  includeProperties?: boolean;
}

export interface PersonsByOrganisationParams {
  organisationId: number;
  includeContactDetails?: boolean;
  includePersonProperties?: boolean;
  includePersonIdentifiers?: boolean;
}

export interface CompetitorsListParams {
  organisationId: number;
}

export interface ExternalLoginUrlParams {
  personId: number;
  organisationId: number;
  includeContactDetails?: boolean;
}

export interface AuthenticatePersonParams {
  username: string;
  password: string;
}

export interface EntriesListParams {
  organisationIds?: IdList;
  eventIds?: IdList;
  eventClassIds?: IdList;
  fromEventDate?: EventorDateTime;
  toEventDate?: EventorDateTime;
  fromEntryDate?: EventorDateTime;
  toEntryDate?: EventorDateTime;
  fromModifyDate?: EventorDateTime;
  toModifyDate?: EventorDateTime;
  includeEntryFees?: boolean;
  includePersonElement?: boolean;
  includeOrganisationElement?: boolean;
  includeEventElement?: boolean;
}

export interface CompetitorCountParams {
  organisationIds: IdList;
  eventIds?: IdList;
  personIds?: IdList;
}

export interface StartsByEventParams {
  eventId: number;
}

export interface StartsByPersonParams {
  personId: number;
  eventIds?: IdList;
  fromDate?: EventorDateTime;
  toDate?: EventorDateTime;
}

export interface StartsByOrganisationParams {
  organisationIds: IdList;
  eventId: number;
}

export interface ResultsByEventParams {
  eventId: number;
  includeSplitTimes?: boolean;
  top?: number;
}

export interface WrsResultsByEventParams {
  classId: number;
}

export interface ResultsByPersonParams {
  personId: number;
  eventIds?: IdList;
  fromDate?: EventorDateTime;
  toDate?: EventorDateTime;
  includeSplitTimes?: boolean;
  top?: number;
}

export interface ResultsByOrganisationParams {
  organisationIds: IdList;
  eventId: number;
  includeSplitTimes?: boolean;
  top?: number;
}

export interface ActivitiesListParams {
  organisationId: number;
  from: EventorDateTime;
  to: EventorDateTime;
  includeRegistrations?: boolean;
}

export interface ActivityGetParams {
  organisationId: number;
  id: number;
  includeRegistrations?: boolean;
}

export interface ExportCompetitorsParams {
  organisationIds?: IdList;
  version?: "2.0" | "3.0" | string;
  includePreselectedClasses?: boolean;
  zip?: boolean;
}

export function toQuery<T extends object>(params: T | undefined): QueryParams {
  return (params ?? {}) as QueryParams;
}
