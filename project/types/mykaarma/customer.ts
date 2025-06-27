// MyKaarma Customer API Types

export interface CustomerSearchRequest {
  departmentUUID: string;
  fieldsToBeSearched?: string;
  maxResults?: number;
  searchTerm: string;
  queryOperator?: 'AND' | 'OR';
}

export interface CustomerCommunication {
  commValue: string;
  commType: string; // 'P' for Phone, 'E' for Email
  commLabel: string;
  preferred: boolean;
  id: number;
}

export interface CustomerVehicle {
  model: string;
  year: string;
  make: string;
  engine: string;
  bodyStyle: string;
  trim: string;
  vin: string;
  id: number;
  isValid: boolean;
  uuid: string;
  vehicleKey: string;
  imageUrl: string;
}

export interface SecondaryCustomerData {
  fname: string;
  lname: string;
  customerKey: string;
  guid: string;
  customerId: number;
}

export interface MyKaarmaCustomer {
  id: number;
  fname: string;
  lname: string;
  customerKey: string;
  uuid: string;
  company: string;
  dealerId: number;
  communications: CustomerCommunication[];
  vehicles: CustomerVehicle[];
  secondaryCustomerData: SecondaryCustomerData[];
}

export interface ApiError {
  errorCode: number;
  errorTitle: string;
  errorMessage: string;
}

export interface ApiWarning {
  warningCode: number;
  warningTitle: string;
  warningMessage: string;
}

export interface CustomerSearchResponse {
  errors: ApiError[];
  warnings: ApiWarning[];
  matchingCustomers: MyKaarmaCustomer[];
} 