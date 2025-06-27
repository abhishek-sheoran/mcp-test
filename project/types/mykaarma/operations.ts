// MyKaarma Operations API Types

export interface MileageDTO {
  startMileage: number;
  repeatInterval: number;
  endMileage: number;
}

export interface BrandDTO {
  id: number;
  name: string;
  motorsMakeId: number;
  motorsMakeName: string | null;
}

export interface VehicleMileageConfigDTO {
  brandDTO: BrandDTO;
  year: string;
  model: string;
  trim: string;
  engine: string;
  mileageUuid: string;
  uuid: string;
  motorsBaseVehicleId: string | null;
  motorsEngineId: string | null;
  isValid: boolean | null;
}

export interface DailyLimitConfigDTO {
  dayNumber: number;
  dayLimit: number;
}

export interface OperationDTO {
  laborOpCode: string;
  opCodeName: string | null;
  description: string;
  totalPrice: string;
  opCodeDurationInMinutes: string | null;
  isValid: boolean;
  uuid: string;
  inMobileService: boolean;
  inOnlineScheduler: boolean;
  communicationCode: string | null;
  payType: string | null;
  inServiceCart: boolean;
  inDealerAppScheduler: boolean;
  dmsDescription: string | null;
  laborPrice: string | null;
  dmsLaborPrice: string | null;
  partsPrice: string | null;
  dmsPartsPrice: string | null;
  taxAmount: string | null;
  dmsTaxAmount: string | null;
  dmsTotalPrice: string | null;
  sortOrder: number | null;
  correction: string | null;
  cause: string | null;
  soldHours: number | null;
  dispatchCode: string | null;
  comebackFlag: boolean | null;
  usagePercentile: number | null;
  position: number;
  leadTimeInMinutes: number | null;
  isIndexed: boolean;
  isDefault: boolean | null;
  notes: string | null;
  serviceType: string;
  serviceTypeServiceCart: string | null;
  recallId: string | null;
  vehicleMileageConfigDTOList: VehicleMileageConfigDTO[];
  dailyLimitConfigDTOList: DailyLimitConfigDTO[] | null;
  pullEstimateInSC: boolean | null;
  miscPrice: string | null;
  useDmsPrice: boolean | null;
  showDmsPriceMismatchWarning: boolean | null;
  noPartsNeeded: boolean | null;
  inCheckIn: boolean;
  quickOpLiteUuid: string | null;
  invoiceLineList: OperationDTO[] | null;
  menuName: string | null;
  operationType: 'OPCODE' | 'SERVICEMENU';
  dealerUuid: string;
  isCustomConcern: boolean | null;
  taxonomyId: number;
  severityFlag: string | null;
  isSeverityNormal: boolean | null;
  isSeveritySevere: boolean | null;
  notesSevere: string[] | null;
  notesNormal: string[] | null;
  motorsOperationName: string | null;
  mileage: number | null;
  motorsMake: string | null;
  motorsMakeId: number;
  totalPriceForConversion: number;
}

export interface ErrorDTO {
  errorName: string;
  errorMessage: string;
  errorCode: number;
}

export interface WarningDTO {
  warningCode: string;
  warningTitle: string;
  warningMessage: string;
}

export interface OperationsSearchRequest {
  requesterUserUUID?: string;
  onlineSchedulerVisibility?: boolean;
  mobileServiceVisibility?: boolean;
  serviceCartVisibility?: boolean;
  dealerAppSchedulerVisibility?: boolean;
  checkInVisibility?: boolean;
  startPosition?: number;
  endPosition?: number;
  isLastPage?: boolean;
  resultSize?: number;
  communicationCodes?: string[];
  opCodes?: string[];
  uuidList?: string[];
  getTotalCount?: boolean;
  getMkAndDmsSimilarOpcodeCount?: boolean;
  searchToken?: string;
  sortPreference?: 'OPCODE' | 'NAME' | 'PRICE';
  sortDirection?: 'ASCENDING' | 'DESCENDING';
  eventDealerAssociateUuid?: string;
  serviceTypeList?: ('MAINTENANCE' | 'REPAIR' | 'INSPECT' | 'SERVICE')[];
  brandUuidList?: string[];
  typeList?: string[];
  mileageDTOList?: MileageDTO[];
  baseVehicleId?: number;
  engineId?: number;
  minPrice?: number;
  maxPrice?: number;
  dmsLaborPriceMismatch?: boolean;
  severityFlag?: 'NORMAL' | 'SEVERE';
  engineList?: string[];
  modelList?: string[];
  yearList?: string[];
  trimList?: string[];
}

export interface OperationsSearchResponse {
  errors: ErrorDTO[] | null;
  warnings: WarningDTO[] | null;
  statusCode: number;
  apiRequestId: string;
  operationDTOList: OperationDTO[];
  totalCount: number;
  mkAndDmsSimilarOpcodeCount: number | null;
  pricingVisibleToCustomer: boolean;
} 