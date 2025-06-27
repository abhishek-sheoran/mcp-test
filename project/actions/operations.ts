import { Service } from "@/types";
import { OperationsSearchRequest, OperationsSearchResponse, OperationDTO } from "@/types/mykaarma";
import { NEXT_PUBLIC_MYKAARMA_BASE_URL, getAuthToken } from "@/utils/myk-auth-utils";

// Convert MyKaarma OperationDTO to our Service type
const convertOperationToService = (operation: OperationDTO): Service => {
  return {
    id: operation.uuid,
    name: operation.opCodeName || operation.laborOpCode,
    description: operation.description,
    price: operation.totalPrice ? parseFloat(operation.totalPrice) : undefined,
    duration: operation.opCodeDurationInMinutes ? parseInt(operation.opCodeDurationInMinutes) : undefined,
    serviceType: operation.serviceType,
  };
};

// Fetch operations from MyKaarma API
const fetchMyKaarmaOperations = async (dealerUUID: string): Promise<Service[]> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken || !NEXT_PUBLIC_MYKAARMA_BASE_URL) {
      throw new Error('MyKaarma authentication or base URL not configured');
    }

    const requestBody: OperationsSearchRequest = {
      onlineSchedulerVisibility: true, // Only fetch operations visible in online scheduler
      resultSize: 50, // Fetch up to 50 operations per request
      startPosition: 0,
      getTotalCount: true,
    };

    const response = await fetch(
      `${NEXT_PUBLIC_MYKAARMA_BASE_URL}/opcodes/v1/dealers/${dealerUUID}/operations/searches`,
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

    const data: OperationsSearchResponse = await response.json();

    if (data.errors && data.errors.length > 0) {
      console.error('MyKaarma API errors:', data.errors);
      throw new Error(`MyKaarma API errors: ${data.errors.map(e => e.errorMessage).join(', ')}`);
    }

    // Convert MyKaarma operations to our Service format
    const services = data.operationDTOList
      .filter(op => op.inOnlineScheduler && op.isValid) // Only include valid operations visible in online scheduler
      .map(convertOperationToService);

    console.log(`Fetched ${services.length} operations from MyKaarma for dealer ${dealerUUID}`);
    return services;

  } catch (error) {
    console.error('Failed to fetch operations from MyKaarma:', error);
    throw error;
  }
};

// Fallback mock services for development/testing
const getMockServices = (): Service[] => [
  { id: '1', name: 'Engine Oil Service', description: 'Complete oil change and filter replacement' },
  { id: '2', name: 'Tire Rotation and Balance', description: 'Rotate tires and check balance' },
  { id: '3', name: 'Brake System Inspection', description: 'Comprehensive brake system check' },
  { id: '4', name: 'Diagnostic Check', description: 'Computer diagnostic scan' },
  { id: '5', name: 'Battery Test', description: 'Battery health and charging system test' },
  { id: '6', name: 'Air Filter Replacement', description: 'Replace engine air filter' },
  { id: '7', name: 'Transmission Service', description: 'Transmission fluid change and inspection' },
  { id: '8', name: 'Coolant System Service', description: 'Coolant flush and system check' },
  { id: '9', name: 'Spark Plug Replacement', description: 'Replace worn spark plugs' },
  { id: '10', name: 'Cabin Air Filter', description: 'Replace cabin air filter for clean air' },
];

// Main function to fetch services - tries MyKaarma API first, falls back to mock data
const fetchServices = async (dealerUUID?: string): Promise<Service[]> => {
  // If we have a dealer UUID, try to fetch from MyKaarma
  if (dealerUUID) {
    try {
      return await fetchMyKaarmaOperations(dealerUUID);
    } catch (error) {
      console.warn('Failed to fetch from MyKaarma, falling back to mock data:', error);
      // Fall back to mock data on error
    }
  }

  // Return mock data with simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockServices());
    }, 1500); // Simulate 1.5 second API delay
  });
};

export { fetchServices };