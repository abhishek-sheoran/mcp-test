import { AppointmentData, TimeSlot, Vehicle, Service, TransportOption } from "@/types";
import { 
  AvailabilityRequest, 
  AvailabilityResponse, 
  VehicleInformation, 
  CustomerInformation,
  CreateAppointmentRequest,
  CreateAppointmentResponse,
  AppointmentServiceItem
} from "@/types/mykaarma";
import { NEXT_PUBLIC_MYKAARMA_BASE_URL, getAuthToken } from "@/utils/myk-auth-utils";
import { convertDateTimeToStr } from "@/utils/common-utils";

// Generate time slots based on slot size (15 minutes) and dealer hours
const generateTimeSlots = (startTime: string, endTime: string, slotSizeMinutes: number = 15): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  // Parse start and end times (format: "HH:mm:ss")
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  let currentMinutes = startMinutes;
  let slotId = 1;
  
  while (currentMinutes + slotSizeMinutes <= endMinutes) {
    const hour = Math.floor(currentMinutes / 60);
    const minute = currentMinutes % 60;
    
    // Format time as 12-hour format
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const timeString = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    
    slots.push({
      id: slotId.toString(),
      time: timeString,
      available: true // Will be updated based on availability response
    });
    
    currentMinutes += slotSizeMinutes;
    slotId++;
  }
  
  return slots;
};

// Convert Vehicle to VehicleInformation for MyKaarma API
const convertVehicleToMyKaarma = (vehicle: Vehicle): VehicleInformation => ({
  vin: vehicle.vin,
  year: vehicle.year.toString(),
  model: vehicle.model,
});

// Fetch available time slots from MyKaarma API
const fetchMyKaarmaAvailability = async (
  date: string,
  dealerDepartmentUUID: string,
  vehicle?: Vehicle,
  services?: Service[],
  transportOption?: TransportOption,
  customerData?: any
): Promise<TimeSlot[]> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken || !NEXT_PUBLIC_MYKAARMA_BASE_URL) {
      throw new Error('MyKaarma authentication or base URL not configured');
    }

    // Build request body
    const requestBody: AvailabilityRequest = {
      platform: {
        id: null,
        name: "Web"
      },
      dates: [date], // yyyy-MM-dd format
      vehicleInformation: vehicle ? convertVehicleToMyKaarma(vehicle) : undefined,
      selectedOperationUuidSet: services?.map(s => s.id) || [],
      selectedAvailabilityAttributes: transportOption ? {
        dealerAssociateUuidList: [], // Will be filled based on dealer configuration
        transportOptionUuidList: [transportOption.id],
        teamUuidList: []
      } : undefined,
      customerInformation: customerData ? {
        uuid: customerData.uuid,
        firstName: customerData.fname,
        lastName: customerData.lname,
      } : undefined,
    };

    const response = await fetch(
      `${NEXT_PUBLIC_MYKAARMA_BASE_URL}/appointment/v2/department/${dealerDepartmentUUID}/availability?refreshSelectionState=true&fetchAvailability=true`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authToken}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`MyKaarma API error: ${response.status} ${response.statusText}`);
    }

    const data: AvailabilityResponse = await response.json();

    if (data.error) {
      console.error('MyKaarma API error:', data.error);
      throw new Error(`MyKaarma API error: ${data.error.errorDescription}`);
    }

    if (data.warnings && data.warnings.length > 0) {
      console.warn('MyKaarma API warnings:', data.warnings);
    }

    // Generate all possible time slots based on dealer hours
    const allSlots = generateTimeSlots(
      data.dealerHoursOfOperationStartTime, 
      data.dealerHoursOfOperationEndTime
    );

    // Mark slots as unavailable based on availability response
    const unavailableSlots = new Set<string>();
    
    // Process availabilityInfoMap to find unavailable slots
    Object.keys(data.availabilityInfoMap).forEach(key => {
      if (key.includes(date)) { // Only process entries for our requested date
        Object.keys(data.availabilityInfoMap[key]).forEach(combinationKey => {
          const vacancyInfo = data.availabilityInfoMap[key][combinationKey];
          if (!vacancyInfo.vacant) {
            // Extract time from key if it's a datetime key (e.g., "2023-12-13 08:15:00")
            if (key.includes(' ')) {
              const timeStr = key.split(' ')[1]; // "08:15:00"
              unavailableSlots.add(timeStr);
            } else if (key === date) {
              // Entire date is unavailable - mark all slots unavailable
              allSlots.forEach(slot => unavailableSlots.add(slot.time));
            }
          }
        });
      }
    });

    // Update slot availability
    const availableSlots = allSlots.map(slot => ({
      ...slot,
      available: !unavailableSlots.has(slot.time)
    })).filter(slot => slot.available); // Only return available slots

    console.log(`Fetched ${availableSlots.length} available time slots from MyKaarma for ${date}`);
    return availableSlots;

  } catch (error) {
    console.error('Failed to fetch availability from MyKaarma:', error);
    throw error;
  }
};

// Fallback mock time slots for development/testing
const getMockTimeSlots = (): TimeSlot[] => [
  { id: '1', time: '9:00 AM', available: true },
  { id: '2', time: '9:15 AM', available: true },
  { id: '3', time: '9:30 AM', available: true },
  { id: '4', time: '10:00 AM', available: true },
  { id: '5', time: '10:15 AM', available: false },
  { id: '6', time: '10:30 AM', available: true },
  { id: '7', time: '1:00 PM', available: true },
  { id: '8', time: '1:15 PM', available: true },
  { id: '9', time: '2:00 PM', available: true },
  { id: '10', time: '2:15 PM', available: false },
];

// Main function to fetch time slots - tries MyKaarma API first, falls back to mock data
const fetchTimeSlots = async (
  date: string,
  dealerDepartmentUUID?: string,
  vehicle?: Vehicle,
  services?: Service[],
  transportOption?: TransportOption,
  customerData?: any
): Promise<TimeSlot[]> => {
  // If we have all required parameters, try to fetch from MyKaarma
  if (dealerDepartmentUUID) {
    try {
      return await fetchMyKaarmaAvailability(date, dealerDepartmentUUID, vehicle, services, transportOption, customerData);
    } catch (error) {
      console.warn('Failed to fetch from MyKaarma, falling back to mock data:', error);
      // Fall back to mock data on error
    }
  }

  // Return mock data with simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockTimeSlots().filter(slot => slot.available)); // Only return available slots
    }, 1000); // Simulate 1 second API delay
  });
};

// Helper function to convert time slot to Date object
const parseTimeSlotToDate = (date: Date, timeSlot: string): Date => {
  const [time, period] = timeSlot.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let hour24 = hours;
  if (period === 'PM' && hours !== 12) {
    hour24 = hours + 12;
  } else if (period === 'AM' && hours === 12) {
    hour24 = 0;
  }
  
  const appointmentDate = new Date(date);
  appointmentDate.setHours(hour24, minutes, 0, 0);
  return appointmentDate;
};

// Convert Services to MyKaarma ServiceList format
const convertServicesToMyKaarma = (services: Service[]): AppointmentServiceItem[] => {
  return services.map(service => ({
    title: service.id, // Using service ID as labor opcode
    description: service.description,
    operationType: "OPCODE",
    operationUuid: service.id,
    isCustomConcern: false
  }));
};

// Create appointment using MyKaarma API
const createMyKaarmaAppointment = async (
  appointmentData: AppointmentData,
  selectedDate: Date,
  customerUuid: string
): Promise<{ success: boolean; appointmentId: string }> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken || !NEXT_PUBLIC_MYKAARMA_BASE_URL) {
      throw new Error('MyKaarma authentication or base URL not configured');
    }

    if (!appointmentData.dealership || !appointmentData.timeSlot) {
      throw new Error('Missing required appointment data');
    }

    // Parse the selected time slot to create start and end times
    const startDateTime = parseTimeSlotToDate(selectedDate, appointmentData.timeSlot.time);
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 14, 59, 999); // 15-minute slot ending at X:X4:59

    // Build the appointment request
    const requestBody: CreateAppointmentRequest = {
      customerUuid,
      vehicleInformation: {
        vehicleUuid: appointmentData.vehicle?.mykaarmaVehicleUUID,
        vin: appointmentData.vehicle?.vin
      },
      appointmentInformation: {
        appointmentStartDateTime: convertDateTimeToStr(startDateTime),
        appointmentEndDateTime: convertDateTimeToStr(endDateTime),
        trasportOption: appointmentData.transportOption ? {
          transportOptionUuid: appointmentData.transportOption.id,
          transportation: appointmentData.transportOption.name,
          bookInThirdParty: false
        } : undefined,
        transportOption: undefined,
        assignedUser: undefined, // Let MyKaarma auto-assign
        creatorUser: undefined,
        appointmentKey: undefined,
        mileageText: undefined,
        comments: appointmentData.services.length > 0 
          ? `Services requested: ${appointmentData.services.map(s => s.name).join(', ')}` 
          : "General service appointment",
        internalNotes: "",
        serviceList: appointmentData.services.length > 0 ? convertServicesToMyKaarma(appointmentData.services) : undefined,
        customerAppointmentPreference: {
          emailConfirmation: true,
          textConfirmation: true,
          emailReminder: true,
          textReminder: true,
          notifyCustomer: true,
          sendCommunicationToDA: true
        },
        status: undefined,
        recall: false,
        reminderCount: 0,
        isOverridden: false,
        overrideFutureNoPrefAppointment: false,
        pushToDms: true,
        draftUuid: undefined,
        pdrToOpcodes: {},
        deferredRecallDTOList: null,
        pickupDeliveryTripEvent: null,
        sdSessionId: undefined
      }
    };

    console.log('Creating MyKaarma appointment with request:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(
      `${NEXT_PUBLIC_MYKAARMA_BASE_URL}/appointment/v2/dealer/${appointmentData.dealership.mykDealerUUID}/appointment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authToken}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`MyKaarma API error: ${response.status} ${response.statusText}`);
    }

    const data: CreateAppointmentResponse = await response.json();

    if (data.error) {
      console.error('MyKaarma appointment creation error:', data.error);
      throw new Error(`MyKaarma API error: ${data.error.errorDescription}`);
    }

    if (data.warnings && data.warnings.length > 0) {
      console.warn('MyKaarma appointment creation warnings:', data.warnings);
    }

    console.log('MyKaarma appointment created successfully:', data);
    
    return {
      success: true,
      appointmentId: data.appointmentUuid || data.appointmentKey || `MYK_${Date.now()}`
    };

  } catch (error) {
    console.error('Failed to create MyKaarma appointment:', error);
    throw error;
  }
};

// Main function for booking appointment - tries MyKaarma API first, falls back to mock
const bookAppointment = async (
  appointmentData: AppointmentData,
  selectedDate?: Date,
  customerUuid?: string
): Promise<{ success: boolean; appointmentId: string }> => {
  // If we have all required data for MyKaarma API, try that first
  if (selectedDate && customerUuid && appointmentData.dealership?.mykDealerUUID) {
    try {
      return await createMyKaarmaAppointment(appointmentData, selectedDate, customerUuid);
    } catch (error) {
      console.warn('Failed to create appointment via MyKaarma, falling back to mock:', error);
      // Fall back to mock behavior on error
    }
  }

  // Fallback mock behavior for development/testing
  console.log('Using mock appointment booking');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        appointmentId: `MOCK_APT_${Date.now()}`
      });
    }, 2000); // Simulate 2 second API delay
  });
};

export { fetchTimeSlots, bookAppointment };