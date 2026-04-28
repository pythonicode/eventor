export type EventorScalar = string | number | boolean;

export interface EventorTextNode {
  "#text"?: EventorScalar;
  [attribute: `@_${string}`]: EventorScalar | undefined;
}

export type EventorValue =
  | EventorScalar
  | EventorTextNode
  | EventorXmlObject
  | EventorValue[];

export interface EventorXmlObject {
  [element: string]: EventorValue | undefined;
}

export interface EventorNamedNode extends EventorXmlObject {
  Name?: EventorValue;
}

export interface EventorIdNode extends EventorXmlObject {
  Id?: EventorValue;
}

export interface Event extends EventorNamedNode {
  EventId?: EventorValue;
  EventClassification?: EventorValue;
  EventClassificationId?: EventorValue;
  EventStatus?: EventorValue;
  EventStatusId?: EventorValue;
  StartDate?: EventorValue;
  FinishDate?: EventorValue;
  Organiser?: EventorValue;
  EventRace?: EventorValue[];
  EntryBreak?: EventorValue[];
  EventClass?: EventorValue[];
  "@_eventForm"?: string;
}

export interface EventList {
  EventClassification?: EventorValue[];
  Event?: Event[];
}

export interface Document extends EventorXmlObject {
  "@_id"?: number;
  "@_referenceId"?: number;
  "@_name"?: string;
  "@_url"?: string;
  "@_type"?: "Invitation" | "Other" | "Program" | string;
  "@_modifyDate"?: string;
}

export interface DocumentList {
  Document?: Document[];
}

export interface EventClass extends EventorNamedNode {
  EventClassId?: EventorValue;
  ClassTypeId?: EventorValue;
  EntryFeeId?: EventorValue[];
}

export interface EventClassList {
  EventClass?: EventClass[];
}

export interface EntryFee extends EventorNamedNode {
  EntryFeeId?: EventorValue;
  Amount?: EventorValue;
}

export interface EntryFeeList {
  EntryFee?: EntryFee[];
}

export interface Organisation extends EventorNamedNode {
  OrganisationId?: EventorValue;
  ShortName?: EventorValue;
  MediaName?: EventorValue;
  OrganisationType?: EventorValue;
  OrganisationTypeId?: EventorValue;
  Country?: EventorValue;
  CountryId?: EventorValue;
  Address?: EventorValue[];
  Tele?: EventorValue[];
  ParentOrganisation?: EventorValue;
  SubOrganisation?: EventorValue[];
}

export interface OrganisationList {
  OrganisationType?: EventorValue[];
  Organisation?: Organisation[];
}

export interface Person extends EventorXmlObject {
  PersonName?: EventorValue;
  PersonId?: EventorValue;
  BirthDate?: EventorValue;
  Nationality?: EventorValue;
  Organisation?: Organisation;
  OrganisationId?: EventorValue;
  Address?: EventorValue[];
  Tele?: EventorValue[];
  Role?: EventorValue[];
  Competitor?: Competitor[];
  "@_sex"?: "F" | "M" | string;
}

export interface PersonList {
  Person?: Person[];
}

export interface Competitor extends EventorXmlObject {
  CompetitorId?: EventorValue;
  Person?: Person;
  PersonId?: EventorValue;
  Organisation?: Organisation[];
  OrganisationId?: EventorValue;
  ControlCard?: EventorValue[];
  Class?: EventorValue[];
}

export interface CompetitorList {
  Competitor?: Competitor[];
}

export interface Entry extends EventorXmlObject {
  EntryId?: EventorValue;
  Event?: Event;
  EventId?: EventorValue;
  EventClass?: EventClass;
  EventClassId?: EventorValue;
  Person?: Person;
  PersonId?: EventorValue;
  Organisation?: Organisation;
  OrganisationId?: EventorValue;
  EntryDate?: EventorValue;
  ModifyDate?: EventorValue;
}

export interface EntryList {
  Entry?: Entry[];
}

export interface CompetitorCountList extends EventorXmlObject {
  CompetitorCount?: EventorValue[];
}

export interface Start extends EventorXmlObject {
  Person?: Person;
  PersonId?: EventorValue;
  Organisation?: Organisation;
  OrganisationId?: EventorValue;
  Event?: Event;
  EventId?: EventorValue;
  StartTime?: EventorValue;
  ControlCard?: EventorValue;
}

export interface StartList {
  Event?: Event;
  EventId?: EventorValue;
  Start?: Start[];
}

export interface StartListList {
  StartList?: StartList[];
}

export interface Result extends EventorXmlObject {
  ResultId?: EventorValue;
  BibNumber?: EventorValue;
  StartTime?: EventorValue;
  FinishTime?: EventorValue;
  Time?: EventorValue;
  TimeBehind?: EventorValue;
  Position?: EventorValue;
  Status?: EventorValue;
  SplitTime?: EventorValue[];
  ControlCard?: EventorValue;
}

export interface PersonResult extends EventorXmlObject {
  Person?: Person;
  PersonId?: EventorValue;
  Organisation?: Organisation;
  OrganisationId?: EventorValue;
  Result?: Result;
  ResultId?: EventorValue;
  RaceResult?: EventorValue[];
}

export interface ClassResult extends EventorXmlObject {
  EventClass?: EventClass;
  EventClassId?: EventorValue;
  PersonResult?: PersonResult[];
  TeamResult?: EventorValue[];
  "@_numberOfEntries"?: number;
  "@_numberOfStarts"?: number;
}

export interface ResultList {
  Event?: Event;
  EventId?: EventorValue;
  ClassResult?: ClassResult[];
  "@_status"?: "complete" | "delta" | "snapshot" | string;
}

export interface ResultListList {
  ResultList?: ResultList[];
}

export interface Activity extends EventorNamedNode {
  ActivityId?: EventorValue;
  Organisation?: Organisation;
  OrganisationId?: EventorValue;
  StartDate?: EventorValue;
  FinishDate?: EventorValue;
  Registration?: EventorValue[];
}

export interface ActivityList {
  Activity?: Activity[];
}

export interface ImportResultListResult {
  ResultListUrl?: EventorValue;
  SplitTimeListUrl?: EventorValue;
}

export interface ExternalLoginUrl {
  ExternalLoginUrl?: EventorValue;
}

export type EventorRootMap = {
  Activity: Activity;
  ActivityList: ActivityList;
  Competitor: Competitor;
  CompetitorCountList: CompetitorCountList;
  CompetitorList: CompetitorList;
  DocumentList: DocumentList;
  EntryFeeList: EntryFeeList;
  EntryList: EntryList;
  Event: Event;
  EventClassList: EventClassList;
  EventList: EventList;
  ExternalLoginUrl: ExternalLoginUrl;
  ImportResultListResult: ImportResultListResult;
  Organisation: Organisation;
  OrganisationList: OrganisationList;
  Person: Person;
  PersonList: PersonList;
  ResultList: ResultList;
  ResultListList: ResultListList;
  StartList: StartList;
  StartListList: StartListList;
};

export type EventorResponse<K extends keyof EventorRootMap> = {
  [P in K]: EventorRootMap[P];
};

export type ActivityResponse = EventorResponse<"Activity">;
export type ActivityListResponse = EventorResponse<"ActivityList">;
export type CompetitorResponse = EventorResponse<"Competitor">;
export type CompetitorCountListResponse = EventorResponse<"CompetitorCountList">;
export type CompetitorListResponse = EventorResponse<"CompetitorList">;
export type DocumentListResponse = EventorResponse<"DocumentList">;
export type EntryFeeListResponse = EventorResponse<"EntryFeeList">;
export type EntryListResponse = EventorResponse<"EntryList">;
export type EventResponse = EventorResponse<"Event">;
export type EventClassListResponse = EventorResponse<"EventClassList">;
export type EventListResponse = EventorResponse<"EventList">;
export type ExternalLoginUrlResponse = EventorResponse<"ExternalLoginUrl">;
export type ImportResultListResultResponse = EventorResponse<"ImportResultListResult">;
export type OrganisationResponse = EventorResponse<"Organisation">;
export type OrganisationListResponse = EventorResponse<"OrganisationList">;
export type PersonResponse = EventorResponse<"Person">;
export type PersonListResponse = EventorResponse<"PersonList">;
export type ResultListResponse = EventorResponse<"ResultList">;
export type ResultListListResponse = EventorResponse<"ResultListList">;
export type StartListResponse = EventorResponse<"StartList">;
export type StartListListResponse = EventorResponse<"StartListList">;
