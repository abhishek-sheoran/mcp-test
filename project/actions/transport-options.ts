import { TransportOption } from "@/types";
import { TransportOptionsResponse, TransportOptionDTO } from "@/types/mykaarma";
import { NEXT_PUBLIC_MYKAARMA_BASE_URL, getAuthToken } from "@/utils/myk-auth-utils";

// Convert MyKaarma TransportOptionDTO to our TransportOption type
const convertTransportOptionToLocal = (option: TransportOptionDTO): TransportOption => {
  return {
    id: option.transportOptionUuid,
    name: option.customName || option.optionName,
    description: option.optionName, // Use optionName as description if customName is used as name
  };
};

// Fetch transport options from MyKaarma API
const fetchMyKaarmaTransportOptions = async (dealerDepartmentUUID: string): Promise<TransportOption[]> => {
  try {
    const authToken = getAuthToken();
    
    if (!authToken || !NEXT_PUBLIC_MYKAARMA_BASE_URL) {
      throw new Error('MyKaarma authentication or base URL not configured');
    }

    const response = await fetch(
      `${NEXT_PUBLIC_MYKAARMA_BASE_URL}/appointment/v2/department/${dealerDepartmentUUID}/transportOption/list`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`MyKaarma API error: ${response.status} ${response.statusText}`);
    }

    const data: TransportOptionsResponse = await response.json();

    if (data.error) {
      console.error('MyKaarma API error:', data.error);
      throw new Error(`MyKaarma API error: ${data.error.errorDescription}`);
    }

    if (data.warnings && data.warnings.length > 0) {
      console.warn('MyKaarma API warnings:', data.warnings);
    }

    // Convert MyKaarma transport options to our TransportOption format
    const transportOptions = data.transportOptionList
      .filter(option => option.showOnline) // Only include options visible online
      .map(convertTransportOptionToLocal);

    console.log(`Fetched ${transportOptions.length} transport options from MyKaarma for dealer department ${dealerDepartmentUUID}`);
    return transportOptions;

  } catch (error) {
    console.error('Failed to fetch transport options from MyKaarma:', error);
    throw error;
  }
};

// Fallback mock transport options for development/testing
const getMockTransportOptions = (): TransportOption[] => [
  {
    id: '1',
    name: 'Wait at Dealership',
    description: 'Stay at our comfortable lounge with complimentary refreshments and Wi-Fi'
  },
  {
    id: '2',
    name: 'Drop Off & Pick Up',
    description: 'Leave your vehicle with us and arrange for pickup when service is complete'
  },
  {
    id: '3',
    name: 'Courtesy Vehicle',
    description: 'Use one of our courtesy vehicles while your car is being serviced'
  },
  {
    id: '4',
    name: 'Shuttle Service',
    description: 'Take advantage of our complimentary shuttle service within 5 miles'
  }
];

// Main function to fetch transport options - tries MyKaarma API first, falls back to mock data
const fetchTransportOptions = async (dealerDepartmentUUID?: string): Promise<TransportOption[]> => {
  // If we have a dealer department UUID, try to fetch from MyKaarma
  if (dealerDepartmentUUID) {
    try {
      return await fetchMyKaarmaTransportOptions(dealerDepartmentUUID);
    } catch (error) {
      console.warn('Failed to fetch from MyKaarma, falling back to mock data:', error);
      // Fall back to mock data on error
    }
  }

  // Return mock data with simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockTransportOptions());
    }, 1500); // Simulate 1.5 second API delay
  });
};

export { fetchTransportOptions };