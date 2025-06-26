export interface Vehicle {
  id: string;
  model: string;
  year: number;
  vin: string;
}

export interface Dealership {
  id: string;
  name: string;
  address: string;
  mykDealerUUID: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
}

export interface TransportOption {
  id: string;
  name: string;
  description: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface AppointmentData {
  vehicle?: Vehicle;
  dealership?: Dealership;
  services: Service[];
  transportOption?: TransportOption;
  date?: string;
  timeSlot?: TimeSlot;
}

export interface User {
  email: string;
  name: string;
  vehicles: Vehicle[];
}