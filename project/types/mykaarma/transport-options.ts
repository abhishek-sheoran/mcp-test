// MyKaarma Transport Options API Types

export interface TransportOptionDTO {
  customName: string;
  icon: string;
  optionName: string;
  showOnDealerApp: boolean;
  showOnline: boolean;
  transportOptionUuid: string;
}

export interface TransportOptionError {
  errorCode: string;
  errorDescription: string;
  errorUID: string;
}

export interface TransportOptionWarning {
  warningCode: string;
  warningDescription: string;
}

export interface TransportOptionsResponse {
  statusCode: number;
  transportOptionList: TransportOptionDTO[];
  error: TransportOptionError | null;
  warnings: TransportOptionWarning[] | null;
} 