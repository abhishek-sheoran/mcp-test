import { Dealership, TimeSlot, TransportOption, User } from "./index";

const mockUser: User = {
    name: 'Abhishek Sheoran',
    email: 'abhishek.sheoran@mykaarma.com',
    vehicles: [
        {
            id: '1',
            model: '2012 BMW R1200',
            year: 2012,
            vin: 'WB1049003CZX96989'
        },
        {
            id: '2',
            model: '2011 BMW 1M',
            year: 2011,
            vin: 'WBSUR9C51BVS96566'
        },
        {
            id: '3',
            model: '2015 BMW 6 Series',
            year: 2010,
            vin: 'WBALY1C53FDZ73553'
        }
    ]
}

const mockDealerships: Dealership[] = [
    { id: '1', name: 'BMW of Mt. Laurel', address: '1220 NJ-73, Mt Laurel Township, NJ 08054, United States', mykDealerUUID: 'cb731d36fd635ddd6ef8dd43500892b0c0249d1c01a46dbcc445a809c0a8e3b2', mykDealerDepartmentUUID: '8ec821aefe98664ab15df7c426c3c46f9c37d0b1aeda9ff58df3db89bb0a55a3' },
    { id: '2', name: 'BMW Northwest', address: '456 Oak Ave, North District',  mykDealerUUID: '5765507a95f23d2da7c96b5d88100bfebdc2883af8cb925ce2b61934884b24b5', mykDealerDepartmentUUID: 'b1fc4c63cce0e9fbed5406b9fea400262066700b286c827168e63cfc00350aa1' },
  ];
  
  const mockTransportOptions: TransportOption[] = [
    { id: '1', name: 'Wait at Dealership', description: 'Stay at the dealership during service' },
    { id: '2', name: 'Drop-off / Pick-up', description: 'Leave your vehicle and return later' },
    { id: '3', name: 'Loaner Vehicle', description: 'Use a complimentary BMW loaner' },
    { id: '4', name: 'Shuttle Service', description: 'Free shuttle to nearby locations' },
  ];
  
  const mockTimeSlots: TimeSlot[] = [
    { id: '1', time: '09:00 AM', available: true },
    { id: '2', time: '10:00 AM', available: true },
    { id: '3', time: '11:00 AM', available: false },
    { id: '4', time: '01:00 PM', available: true },
    { id: '5', time: '02:00 PM', available: true },
    { id: '6', time: '03:00 PM', available: true },
  ];

export { mockUser, mockDealerships, mockTransportOptions, mockTimeSlots };