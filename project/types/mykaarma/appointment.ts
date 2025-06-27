// MyKaarma Appointment Creation Types

export interface CreateAppointmentVehicleInformation {
  vin?: string;
  vehicleKey?: string;
  vehicleUuid?: string;
}

export interface CreateAppointmentUser {
  uuid?: string;
  deptUUID?: string;
  teamUuid?: string;
}

export interface AppointmentServiceItem {
  title?: string;
  description?: string;
  opCodeName?: string;
  price?: string;
  laborTotal?: string;
  partsTotal?: string;
  shopFees?: string;
  taxes?: string;
  payType?: string;
  sortOrder?: number;
  recallID?: string;
  parentTitle?: string;
  menuUuid?: string;
  laborOpCode?: string;
  operationType?: string;
  operationUuid?: string;
  isCustomConcern?: boolean;
  durationInMins?: string;
  parentOpcodeUuid?: string;
}

export interface CustomerAppointmentPreference {
  emailConfirmation?: boolean;
  textConfirmation?: boolean;
  emailReminder?: boolean;
  textReminder?: boolean;
  notifyCustomer?: boolean;
  sendCommunicationToDA?: boolean;
  confirmationEmail?: string;
  confirmationPhoneNumber?: string;
}

export interface TransportOptionInfo {
  altTransportation?: string;
  transportation?: string;
  transportOptionUuid?: string;
  bookingID?: string;
  bookInThirdParty?: boolean;
}

export interface AppointmentInformation {
  appointmentStartDateTime: string;
  appointmentEndDateTime?: string;
  trasportOption?: TransportOptionInfo;
  transportOption?: string;
  assignedUser?: CreateAppointmentUser;
  creatorUser?: CreateAppointmentUser;
  appointmentKey?: string;
  mileageText?: string;
  comments?: string;
  internalNotes?: string;
  serviceList?: AppointmentServiceItem[];
  customerAppointmentPreference?: CustomerAppointmentPreference;
  status?: string;
  recall?: boolean;
  reminderCount?: number;
  isOverridden?: boolean;
  overrideFutureNoPrefAppointment?: boolean;
  pushToDms?: boolean;
  draftUuid?: string;
  pdrToOpcodes?: Record<string, any>;
  deferredRecallDTOList?: any;
  pickupDeliveryTripEvent?: any;
  sdSessionId?: string;
}

export interface CreateAppointmentRequest {
  customerUuid: string;
  vehicleInformation: CreateAppointmentVehicleInformation;
  appointmentInformation: AppointmentInformation;
}

export interface CreateAppointmentResponse {
  error?: {
    errorCode: string;
    errorDescription: string;
  };
  warnings?: Array<{
    warningCode: string;
    warningDescription: string;
  }>;
  appointmentUuid?: string;
  appointmentKey?: string;
  success?: boolean;
} 