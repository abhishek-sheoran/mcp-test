// MyKaarma Resource Availability API Types

export interface Platform {
  id: number | null;
  name: string;
}

export interface CustomerInformation {
  company?: string;
  customerKey?: string;
  firstName?: string;
  lastName?: string;
  uuid?: string;
}

export interface VehicleInformation {
  brand?: string;
  dealerUuid?: string;
  engine?: string;
  mileage?: string;
  model?: string;
  trim?: string;
  uuid?: string;
  vehicleKey?: string;
  vin?: string;
  year?: string;
}

export interface AvailabilityAttributes {
  dealerAssociateUuidList: string[];
  transportOptionUuidList: string[];
  subTransportOptionUuidList?: string[];
  teamUuidList: string[];
}

export interface AvailabilityRequest {
  requesterUserUUID?: string;
  dealerUUIDList?: string[];
  platform?: Platform;
  dates: string[]; // yyyy-MM-dd format
  startTime?: string; // HH:mm:ss format
  endTime?: string; // HH:mm:ss format
  existingAppointmentUuid?: string;
  customerInformation?: CustomerInformation;
  customerPhones?: string[];
  customerEmails?: string[];
  vehicleInformation?: VehicleInformation;
  selectedAvailabilityAttributes?: AvailabilityAttributes;
  allAvailabilityAttributes?: AvailabilityAttributes;
  selectedOperationUuidSet?: string[];
  selectedRecallOemIdSet?: string[];
  callerDaUuid?: string;
  subscriberName?: string;
  refreshPanelSelectionState?: boolean;
  randomStringIdentifierForEditAppointment?: string;
}

export interface AvailabilityWarning {
  warningCode: string;
  warningDescription: string;
}

export interface SelectionState {
  selectedEntityUuidSet: string[];
  unselectedEntityUuidSet: string[];
  disabledEntityUuidToWarningsMap: Record<string, AvailabilityWarning[]>;
}

export interface VacancyInfo {
  vacant: boolean;
  warningMap: Record<string, string[]>;
}

export interface AvailabilityError {
  errorCode: string;
  errorDescription: string;
  errorUID: string;
}

export interface AvailabilityResponse {
  dealerHoursOfOperationStartTime: string;
  dealerHoursOfOperationEndTime: string;
  panelSelectionStateMap: Record<string, SelectionState>;
  availabilityInfoMap: Record<string, Record<string, VacancyInfo>>;
  error: AvailabilityError | null;
  statusCode: number;
  warnings: AvailabilityWarning[] | null;
} 